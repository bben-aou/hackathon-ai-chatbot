import { DataStreamWriter, generateObject, tool } from 'ai';
import { z } from 'zod';
import { Session } from 'next-auth';
import { generateUUID } from '@/lib/utils';

interface CreateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const propertyTypes = ['VILLA', 'FLAT'] as const;

export const getContactInfos = (userMessage: string) =>
  tool({
    description:
      'Get the user credentials, phone, email, last name and first name',
    parameters: z.object({
      lastName: z.string().optional(),
      firstName: z.string().optional(),
      phoneNumber: z.number(),
      email: z.string().optional(),
      price: z.number().optional(),
      propertyType: z.enum(propertyTypes).optional(),
      city: z.string().optional(),
      neighborhood: z.string().optional(),
      bedrooms: z.number().optional(),
      bathrooms: z.number().optional(),
      surface: z.number().optional(),
    }),
    execute: async (res) => {
      return {
        id: generateUUID(),
        result: 'dedede',
      };
    },
  });
