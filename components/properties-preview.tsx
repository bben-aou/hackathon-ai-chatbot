import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

type TAddress = {
  main: string;
  street: string;
  neighborhood: string;
  city: string;
  country: string;
  zipCode: string;
  location: [longitude: number, latitude: number];
};
type TPricing = {
  global: number;
  sellerPrice: number;
  perSquareMeter: number;
  currency: string;
  securityDeposit: number;
  rentPricingSchema: {
    propertyOwnerFeesPercentage: {
      min: number;
      value: number;
    }[];
    clientFeesPercentage: {
      min: number;
      value: number;
    }[];
    vatPercentage: number;
  };
  canUpdateSchemaAutomatically: boolean;
};
export type TListingCard = {
  adress: TAddress;
  area: number;
  bathrooms: number;
  category: string;
  price: TPricing;
  transactionType: string;
  image: string;
};
export type TListingCardProps = {
  property: TListingCard;
};
const ListingCard = (props: TListingCardProps) => {
  const { property } = props;
  console.log('test ', property);
  return (
    <Card className="w-full rounded-[16px] max-w-sm mx-auto">
      <CardHeader className="p-0">
        <img
          src={property.image}
          alt="property_Image"
          className="w-full h-48 object-cover rounded-t-[16px]"
          width={50}
          height={50}
        />
      </CardHeader>
      <CardContent className="p-4 ">
        <h2 className="text-lg font-bold">{property.category}</h2>
        <p className="text-gray-600">{property.price.global}</p>
        <div className="h-8 bg-[#f2fbf9]  border-1 border-[#a7e9db] rounded-[6px] flex items-center p-2 text-[14px]">
          <div className="text-gray-600">{"ops"}</div>
          <div className="text-gray-600">{"sdjk"}</div>
        </div>
        <p className="text-gray-600">{property.adress.city}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <Button variant="outline">Voir plus</Button>
        <div className="flex space-x-2">
          <Button variant="ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Button>
          <Button variant="ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
