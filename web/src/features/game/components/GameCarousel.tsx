import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import type { Guess, GuessPhase, ImageEntry } from "src/features/game/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Carousel } from "@mantine/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { GameCard } from "./GameCard";
import classes from "./GameCarousel.module.css";

const PRELOAD_AHEAD = 1;

interface GameCarouselProps {
  activeIndex: number;
  guesses: Guess[];
  images: ImageEntry[];
  isGameOver: boolean;
  onNavigate: (index: number) => void;
  pendingGuess: Guess | undefined;
  phase: GuessPhase;
}

function GameCarousel({
  activeIndex,
  guesses,
  images,
  isGameOver,
  onNavigate,
  pendingGuess,
  phase,
}: GameCarouselProps) {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

  // Captured once at mount: a live index would change embla's startIndex
  // option every round, forcing a reInit that snaps instead of animating.
  const [initialSlide] = useState(activeIndex);

  const isGameOverRef = useRef(isGameOver);

  useEffect(() => {
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);

  const watchDrag = useCallback(() => isGameOverRef.current, []);

  useEffect(() => {
    if (embla && embla.selectedScrollSnap() !== activeIndex) {
      embla.scrollTo(activeIndex);
    }
  }, [activeIndex, embla]);

  useEffect(() => {
    if (!embla || !isGameOver) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        embla.scrollPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        embla.scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [embla, isGameOver]);

  const onSlideChange = (index: number) => {
    if (!isGameOver) {
      return;
    }

    onNavigate(index);
  };

  return (
    <Carousel
      classNames={{
        control: classes.control,
        root: classes.root,
      }}
      emblaOptions={{ watchDrag }}
      getEmblaApi={setEmbla}
      height="100%"
      initialSlide={initialSlide}
      onSlideChange={onSlideChange}
      withControls={isGameOver}
      withKeyboardEvents={false}
      nextControlIcon={<CaretRightIcon />}
      previousControlIcon={<CaretLeftIcon />}
    >
      {images.map((image, index) => {
        const isActive = index === activeIndex;
        const guess = guesses[index]
          ?? (isActive && phase === "revealed" ? pendingGuess : undefined);

        return (
          <Carousel.Slide key={image.id}>
            <GameCard
              guess={guess}
              image={image}
              pendingGuess={isActive ? pendingGuess : undefined}
              phase={isActive ? phase : "idle"}
              shouldLoad={index <= guesses.length + PRELOAD_AHEAD}
            />
          </Carousel.Slide>
        );
      })}
    </Carousel>
  );
}

export { GameCarousel };
