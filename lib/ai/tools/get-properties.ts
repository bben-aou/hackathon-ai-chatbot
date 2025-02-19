import { generateUUID } from '@/lib/utils';
import { DataStreamWriter, generateObject, tool } from 'ai';
import { z } from 'zod';
import { Session } from 'next-auth';
import {
  artifactKinds,
  documentHandlersByArtifactKind,
} from '@/lib/artifacts/server';
import { myProvider } from '../models';
import { mongoDbClient } from '@/lib/mongo/mongo';

interface CreateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

const sysPrompt = `
You are a MongoDB query and data visualization expert. Your job is to help the user write a MongoDB query to retrieve the data they need. The document schema is as follows:
{
  status: 'LISTED', // This is the status of the properties, we only need to query properties whoses status is 'LISTED'
  transactionType: 'RENT', // This is the type of transaction, the possible values are SALE("acheter")/RENT("louer"), we only support SALE/RENT for now.
  isNew: false, // This is a field to determine whether the property is new or not
  photos: [
    // This photos array contains the photos of the property
    {
      url: 'https://media.yakeey.com/ci001253/image_683059098.jpg',
      subUrl: '/ci001253/image_683059098.jpg',
      isMain: false,
      order: 7,
    },
    {
      url: 'https://media.yakeey.com/ci001253/image_133285652.jpg',
      subUrl: '/ci001253/image_133285652.jpg',
      isMain: false,
      order: 2,
    },
  ],
  address: {
    main: 'Bourgogne rue ennajrani Résidence Sedki',
    street: '',
    neighborhood: 'Bourgogne',
    city: 'Casablanca',
    country: 'Maroc',
    location: [-7.6412489, 33.5967999],
  },
  category: 'FLAT', // This is the category of the property, the possible values are FLAT, VILLA, TERRAIN, OFFICE, COMMERCIAL_BUILDING, currently the only supported types are VILLA and FLAT, if ther user tries to buy something else let him know.
  price: {
    global: 7000, // This is the global price, it is the same field in either rent or buy
    sellerPrice: 7000,
    perSquareMeter: 0,
    currency: 'DH',
    securityDeposit: 16000,
  },
  area: 100, // this is the total surface in square meter
  builtArea: 95, // this is the built surface of the property in square meter
  rooms: 2, // this is the total number of rooms
  floor: 4, // this is flloor of the property
  totalFloors: 5, //this is the total floor of the property
  constructionYear: 1999, // This is the year when the property was constructed
  generalState: 'GOOD', // this is state of the property, these are the possible values NEW, //GOOD, //FAIR, //TO_BE_RENOVATED, //RECENTLY_RENOVATED, //RECENTLY_RESTRUCTURED, //SEMI_FINISHED,
  occupationState: 'EMPTY', // possible values :  EMPTY,OCCUPIED
  bathrooms: 1,
  toilets: 0,
  numberOfFacades: 0,
  directions: [], // These are thre directions of the property   NORTH_EAST, NORTH_WEST, SOUTH_WEST, SOUTH_EAST,
  closedResidence: false,
  accessibility: {
    elevator: true,
    disabledAccess: false,
    intercom: true,
    entryCode: false,
    domotique: false,
    emergencyExit: false,
    serviceDoor: false,
    videoSurveillance: false,
    gatedCommunity: false,
  },
  commonAreas: {
    pool: false,
    playground: false,
    greenSpaces: false,
    gym: false,
    mosque: false,
    hammam: false,
    sportsGround: false,
    bikePath: false,
    multiPurposeHall: false,
    creche: false,
    school: false,
    shoppingCenter: false,
    rooftop: false,
  },
  outDoorSpace: {
    balcony: true,
    terrace: false,
    garden: false,
    privateGarden: false,
    solarium: false,
    privateSwimmingPool: false,
    veranda: false,
  },
  thermalComfort: {
    splitAirConditioning: false,
    centralizedAirConditioning: false,
    splitHeating: false,
    centralizedHeating: false,
    stove: false,
    fireplace: false,
    gasWaterHeater: false,
    electricWaterHeater: true,
    thermalIsolation: false,
  },
  annexes: {
    undergroundParking: true,
    outdoorParking: false,
    box: false,
    basement: false,
    storageSpace: false,
    garage: false,
    undergroundParkingSpaces: 1,
  },
  services: {
    concierge: true,
    janitor: false,
    securityAgent: false,
  },
  kitchen: {
    equipped: true,
    laundryRoom: false,
    americanKitchen: false,
  },
  equipment: {
    wiring: false,
    networkInstallation: false,
    meetingRoom: false,
    lobby: false,
    coldStorage: false,
    extractionSystem: false,
    fiberInstallation: false,
    loadLifter: false,
    curtain: false,
  },
  description:
    "À Casablanca, découvrez cet appartement en location de 95 m², situé au 4ème étage d'un immeuble de 5 niveaux. Il se compose de 2 chambres, 1 salle de bain et dispose d'un balcon pour profiter de l'extérieur. Disponible au prix de 7 000 Dhs, cet espace lumineux et fonctionnel est idéal pour un cadre de vie agréable. Ne manquez pas cette opportunité !",
};

Your response should resprect the following format: "{"$and": [
{// condition 1},
{// condition 2},
]}"
Make sure that your query is case insensitive,
`;

export const propertyTypes = ['VILLA', 'FLAT'] as const;

export const getProperties = ({
  message,
  dataStream,
}: {
  message: string;
  dataStream: DataStreamWriter;
}) =>
  tool({
    description:
      'Get Suggestions for real estate properties based on user prompt, and make sure to take into consideration the fact that the user can use multiple languages, mainly darija, french and english',
    parameters: z.object({
      price: z.number().optional(),
      propertyType: z.enum(propertyTypes).optional(),
      city: z.string().optional(),
      neighborhood: z.string().optional(),
      bedrooms: z.number().optional(),
      bathrooms: z.number().optional(),
      surface: z.number().optional(),
    }),
    execute: async (res) => {
      const generatedQuery = await generateObject({
        model: myProvider.languageModel('azure'),
        system: sysPrompt,
        prompt: `Generate the query necessary to retrieve the data the user wants: ${message}`,
        schema: z.object({
          query: z.string(),
        }),
      });

      console.log('generatedQuery', generatedQuery);

      const mongoQuery = JSON.parse(generatedQuery.object.query);

      const db = await mongoDbClient.connect();
      const documents = await db
        .db('yakeey_stage')
        .collection('properties')
        .find(mongoQuery)
        .limit(4)
        .toArray();
      const properties = JSON.parse(JSON.stringify(documents, null, 2));
      const id = generateUUID();

      //   dataStream.writeData({
      //     type: 'kind',
      //     content: kind,
      //   });

      //   dataStream.writeData({
      //     type: 'id',
      //     content: id,
      //   });

      //   dataStream.writeData({
      //     type: 'title',
      //     content: title,
      //   });

      //   dataStream.writeData({
      //     type: 'clear',
      //     content: '',
      //   });

      //   const documentHandler = documentHandlersByArtifactKind.find(
      //     (documentHandlerByArtifactKind) =>
      //       documentHandlerByArtifactKind.kind === kind
      //   );

      //   if (!documentHandler) {
      //     throw new Error(`No document handler found for kind: ${kind}`);
      //   }

      //   await documentHandler.onCreateDocument({
      //     id,
      //     title,
      //     dataStream,
      //     session,
      //   });

      //   dataStream.writeData({ type: 'finish', content: '' });

      //   return {
      //     id,
      //     title,
      //     kind,
      //     content: 'A document was created and is now visible to the user.',
      //   };
      // },
      properties.forEach((property) => {
        property?.photos?.forEach((photo) => {
          if (photo?.url) {
            photo.url = photo.url.replace(
              'media.yakeey.com',
              'medias-stage.yakeey.com'
            );
          }
        });
      });

      return {
        id,
        properties: [...properties],
      };
    },
  });
