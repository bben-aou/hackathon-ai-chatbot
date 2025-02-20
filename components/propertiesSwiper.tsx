// eslint-disable-next-line import/no-unresolved
import { formatPropertyToListingCard } from "@/utils/utils";
import ListingCard, { TListingCard } from "./properties-preview";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useState } from "react";
import { useParams } from "next/navigation";


type TPropertiesSwiperProps = {
  properties: TListingCard[];
};

const PropertiesSwiper = (props: TPropertiesSwiperProps) => {
  const [properties, setProperties] = useState(props.properties);
  const { id } = useParams(); // Assuming you need the id from the URL
  const removeProperty = (indexToRemove: number) => {
    setProperties((prevProperties) =>
      prevProperties.filter((_, index) => index !== indexToRemove)
  );
};


  return (
    <>
      {properties.length > 0 && (
        <div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full mx-auto max-w-4xl px-4"
          >
            <CarouselContent>
              {properties.map((property, index) => {
                const formattedProperty = formatPropertyToListingCard(property);
                return (
                  <CarouselItem key={index} className="basis-1/2">
                    <div className="p-1">
                      <ListingCard
                        property={formattedProperty}
                        onRemove={() => removeProperty(index)}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </>
  );
};

export default PropertiesSwiper;
