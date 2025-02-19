import {
  type Message,
  createDataStreamResponse,
  generateObject,
  smoothStream,
  streamText
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { myProvider } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
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
import { getWeather } from '@/lib/ai/tools/get-weather';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { mongoDbClient } from '@/lib/mongo/mongo';
import { z } from 'zod';
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

      
      const resultQuery = await generateObject({
        model: myProvider.languageModel('azure'),
        system: `You are a MongoDB query and data visualization expert. Your job is to help the user write a MongoDB query to retrieve the data they need. The document schema is as follows:
        
        {
        "status": "LISTED", // This is the status of the properties, we only need to query properties whoses status is 'LISTED'
        "transactionType": "RENT", // This is the type of transaction, the possible values are SALE("acheter")/RENT("louer"), we only support SALE/RENT for now.
        "isNew": false, // This is a field to determine whether the property is new or not
        "photos": [ // This photos array contains the photos of the property
          {
            "url": "https://media.yakeey.com/ci001253/image_683059098.jpg",
            "subUrl": "/ci001253/image_683059098.jpg",
            "isMain": false,
            "order": 7
          },
          {
            "url": "https://media.yakeey.com/ci001253/image_133285652.jpg",
            "subUrl": "/ci001253/image_133285652.jpg",
            "isMain": false,
            "order": 2
          }
        ],
        "address": {
          "main": "Bourgogne rue ennajrani Résidence Sedki",
          "street": "",
          "neighborhood": "Bourgogne",
          "city": "Casablanca",
          "country": "Maroc",
          "location": [
            -7.6412489,
            33.5967999
          ]
        },
        "category": "FLAT", // This is the category of the property, the possible values are FLAT, VILLA, TERRAIN, OFFICE, COMMERCIAL_BUILDING, currently the only supported types are VILLA and FLAT, if ther user tries to buy something else let him know.
        "price": {
          "global": 7000, // This is the global price, it is the same field in either rent or buy
          "sellerPrice": 7000,
          "perSquareMeter": 0,
          "currency": "DH",
          "securityDeposit": 16000
        },
        "area": 100, // this is the total surface in square meter
        "builtArea": 95, // this is the built surface of the property in square meter
        "rooms": 2, // this is the total number of rooms
        "floor": 4, // this is flloor of the property
        "totalFloors": 5, //this is the total floor of the property
        "constructionYear": 1999,// This is the year when the property was constructed
        "generalState": "GOOD", // this is state of the property, these are the possible values NEW, //GOOD, //FAIR, //TO_BE_RENOVATED, //RECENTLY_RENOVATED, //RECENTLY_RESTRUCTURED, //SEMI_FINISHED,
        "occupationState": "EMPTY",// possible values :  EMPTY,OCCUPIED
        "bathrooms": 1,
        "toilets": 0,
        "numberOfFacades": 0,
        "directions": [],// These are thre directions of the property   NORTH_EAST, NORTH_WEST, SOUTH_WEST, SOUTH_EAST,
        "closedResidence": false,
        "accessibility": {
          "elevator": true,
          "disabledAccess": false,
          "intercom": true,
          "entryCode": false,
          "domotique": false,
          "emergencyExit": false,
          "serviceDoor": false,
          "videoSurveillance": false,
          "gatedCommunity": false
        },
        "commonAreas": {
          "pool": false,
          "playground": false,
          "greenSpaces": false,
          "gym": false,
          "mosque": false,
          "hammam": false,
          "sportsGround": false,
          "bikePath": false,
          "multiPurposeHall": false,
          "creche": false,
          "school": false,
          "shoppingCenter": false,
          "rooftop": false
        },
        "outDoorSpace": {
          "balcony": true,
          "terrace": false,
          "garden": false,
          "privateGarden": false,
          "solarium": false,
          "privateSwimmingPool": false,
          "veranda": false
        },
        "thermalComfort": {
          "splitAirConditioning": false,
          "centralizedAirConditioning": false,
          "splitHeating": false,
          "centralizedHeating": false,
          "stove": false,
          "fireplace": false,
          "gasWaterHeater": false,
          "electricWaterHeater": true,
          "thermalIsolation": false
        },
        "annexes": {
          "undergroundParking": true,
          "outdoorParking": false,
          "box": false,
          "basement": false,
          "storageSpace": false,
          "garage": false,
          "undergroundParkingSpaces": 1
        },
        "services": {
          "concierge": true,
          "janitor": false,
          "securityAgent": false
        },
        "kitchen": {
          "equipped": true,
          "laundryRoom": false,
          "americanKitchen": false
        },
        "equipment": {
          "wiring": false,
          "networkInstallation": false,
          "meetingRoom": false,
          "lobby": false,
          "coldStorage": false,
          "extractionSystem": false,
          "fiberInstallation": false,
          "loadLifter": false,
          "curtain": false
        },
        "description": "À Casablanca, découvrez cet appartement en location de 95 m², situé au 4ème étage d'un immeuble de 5 niveaux. Il se compose de 2 chambres, 1 salle de bain et dispose d'un balcon pour profiter de l'extérieur. Disponible au prix de 7 000 Dhs, cet espace lumineux et fonctionnel est idéal pour un cadre de vie agréable. Ne manquez pas cette opportunité !"
      }

      Your response should resprect the following format: "{"$and": [
      {// condition 1},
      {// condition 2},
      ]}"
      Make sure that your query is case insensitive.
  
      `,
        prompt: `Generate the query necessary to retrieve the data the user wants: Salam bghit nchri appartement f Casa Bourgogne 3 chambres  100m2`,
        schema: z.object({
          query: z.string(),
        }),
      });

      const mongoQuery =  JSON.parse(resultQuery.object.query);

      console.log(JSON.stringify(mongoQuery, null, 2))
      

      const db = await mongoDbClient.connect();

      const resulr = await db.db('yakeey_stage').collection('properties').find(mongoQuery).limit(1).toArray();
      
      console.log(JSON.stringify(resulr, null, 2))
 

      const result = streamText({
        model: myProvider.languageModel('azure'),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
        experimental_activeTools:
          selectedChatModel === 'chat-model-reasoning'
            ? []
            : [
                'getWeather',
                'createDocument',
                'updateDocument',
                'requestSuggestions',
              ],
        experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
        tools: {
          getWeather,
          createDocument: createDocument({ session, dataStream }),
          updateDocument: updateDocument({ session, dataStream }),
          requestSuggestions: requestSuggestions({
            session,
            dataStream,
          }),
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
    onError: () => {
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
