import { formatPropertyToListingCard } from "@/utils/utils";
import ListingCard, { TListingCard } from "./properties-preview";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

type TPropertiesSwiperProps = {
  properties: TListingCard[];
};
const PropertiesSwiper = (props: TPropertiesSwiperProps) => {
  const { properties } = props;
  return (
    <div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mx-auto max-w-3xl px-4 "
      >
        <CarouselContent>
          {properties.map((property, index) => {
            const formattedProperty = formatPropertyToListingCard(property);
            return (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <ListingCard property={formattedProperty} />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default PropertiesSwiper;
