"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/app/components/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function ImageCarousel({ images }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}>
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id} className="basis-full">
              <div>
                <div className="relative w-full aspect-square">
                  <Image
                    src={image.image}
                    alt={image.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
                <h3 className="mt-4 text-center text-lg font-medium">
                  {image.title}
                </h3>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <div className="text-muted-foreground text-center text-sm">
        {current} / {count}
      </div>
    </div>
  );
}
