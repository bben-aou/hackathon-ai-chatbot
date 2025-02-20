import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { myProvider } from '@/lib/ai/models';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { createDocument } from '@/lib/ai/tools/create-document';
import { getLoanSuggestions } from '@/lib/ai/tools/get-loan-suggestions';
import { getProperties } from '@/lib/ai/tools/get-properties';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { getContactInfos } from '@/lib/ai/tools/getContactInfos';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { generateTitleFromUserMessage } from '../../actions';

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
  });

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel('azure'),
        system:
          'You are a real estate agent representing Yakeey. You receive inquiries about properties in Morocco. When asked about specific properties or locations, you help clients find suitable options based on their requirements. After identifying matching properties, simply inform the client that results have been found, without providing detailed descriptions of the properties themselves. When a client inquires about properties, respond in the same language they used for their inquiry. If they ask in English, respond in English. If they ask in French, respond in French. If they ask in Arabic, respond in Arabic. For example, if a client asks in French: "Avez-vous des appartements à Casablanca?" you would respond in French: "J\'ai trouvé plusieurs propriétés qui correspondent à vos critères. Yakeey dispose d\'options disponibles dans cette zone." Always maintain the policy of not describing specific property details in your responses, regardless of the language used. and if no results were found say something like this: hey we coulndt find a property with your criterias, can you give us your contact info(phone numer, last name and first name) so that we can call you once we have your desired property',
        messages,
        maxSteps: 5,
        experimental_activeTools: [
          'getWeather',
          'createDocument',
          'updateDocument',
          'requestSuggestions',
          'getProperties',
          'getContactInfos',
          'getLoanSuggestions'
        ],
        experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
        tools: {
          getWeather,
          getProperties: getProperties({
            message: userMessage.content,
            dataStream,
          }),
          getLoanSuggestions: getLoanSuggestions(),
          createDocument: createDocument({ session, dataStream }),
          updateDocument: updateDocument({ session, dataStream }),
          requestSuggestions: requestSuggestions({
            session,
            dataStream,
          }),
          getContactInfos: getContactInfos(userMessage.content),
        },
        onFinish: async ({ response, reasoning }) => {
          if (session.user?.id) {
            try {
              const sanitizedResponseMessages = sanitizeResponseMessages({
                messages: response.messages,
                reasoning,
              });

              await saveMessages({
                messages: sanitizedResponseMessages.map((message) => {
                  return {
                    id: message.id,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(),
                  };
                }),
              });
            } catch (error) {
              console.error('Failed to save chat');
            }
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'stream-text',
        },
      });

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: (e) => {
      console.log(e);
      return 'Oops, an error occured!';
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
