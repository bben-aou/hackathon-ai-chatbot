import { calculateMonthlyPayment, formatAmount } from "@/utils/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Check, MapPin } from "lucide-react";
import Link from 'next/link';

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
  userReference: number;
  adress: TAddress;
  area: number;
  bathrooms: number;
  category: string;
  price: TPricing;
  transactionType: string;
  image: string;
  rooms: number;
  url : string;
};
export type TListingCardProps = {
  property: TListingCard;
  onRemove: () => void;
  onClick: () => void;
};

const ListingCard = (props: TListingCardProps) => {
  const { property, onRemove } = props;

  const handleSelectProperty = () => {
    const inputElement = document.getElementById(
      "prompt-input"
    ) as HTMLTextAreaElement;
    const sendButton = document.getElementById(
      "send-buttom"
    ) as HTMLButtonElement;

    if (inputElement && sendButton) {
      const message = `3jbatni had dar ${property.category} li kayna f ${property.adress.city}, ${property.adress.neighborhood}? Fiha ${property.rooms} d lbiyout, ${property.bathrooms} d bit lma, w lmsa7a dyalha ${property.area}m². Taman dyalha ${formatAmount(property.price.global)}. Reference dyalha ${property.userReference}`;

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(inputElement, message);
      }

      const ev2 = new Event("input", { bubbles: true });
      inputElement.dispatchEvent(ev2);

      requestAnimationFrame(() => {
        sendButton.click();
      });
    }
  };

  return (
    <Card className="w-full bg-red rounded-[16px] max-w-sm mx-auto min-h-[409px]">
      <CardHeader className="p-0">
        <img
          src={property.image}
          alt="property_Image"
          className="w-full h-48 object-cover rounded-t-[16px]"
          width={50}
          height={50}
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold ">{property.category}</h2>
          <p className="text-gray-600 truncate text-xl font-bold">
            {formatAmount(property.price.global)}
          </p>
        </div>
        {property.transactionType === "SALE" ? (
          <div className="h-7 bg-[#f2fbf9] border border-[#9cdccd] rounded-full text-[#1D645C] flex items-center p-2 text-[14px] justify-between w-fit my-[5px]">
            <div className="text-[#1d645c] text-xs font-medium leading-[18px] ">
              {`soit  ${formatAmount(
                calculateMonthlyPayment(property.price.global)
              )}/par mois`}
            </div>
          </div>
        ) : (<div className="h-7"/>)}
        <div className="flex items-center text-gray-600">
          <div className="flex items-center">
            <MapPin className="size-[16px] mr-[3px] text-gray-600" />
            <p className="truncate max-w-[150px]">{property.adress.city},</p>
          </div>
          <div>
            <p className="ml-[2px] truncate max-w-[150px]">
              {property.adress.neighborhood}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-[5px]">
          <div className="flex items-center gap-1">
            <div className="font-medium">{property.rooms}</div>
            <p>chambres</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="font-medium">{property.bathrooms}</div>
            <p>salles de bains</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="font-medium">{property.area}</div>
            <p>m²</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 flex justify-between">
        <Link href={property.url} target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            className="w-[160px] rounded-[8px] bg-[#218075] text-white hover:bg-[#64a69f] hover:text-text"
          >
            Voir plus
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            className="size-[40px] border border-[#e6e7eb] rounded-[12px]"
            onClick={onRemove}
          >
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
          <Button
            variant="ghost"
            className="size-[40px] border border-[#e6e7eb] rounded-[12px]"
            onClick={handleSelectProperty}
          >
            <Check />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
