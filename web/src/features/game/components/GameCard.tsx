import { Box, Card, Group, Image, Skeleton, Text } from "@mantine/core";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import type { Guess, ImageEntry } from "src/features/game/types";
import classes from "./GameCard.module.css";

const ICON_SIZE = 20;

interface GameCardProps {
  guess: Guess | undefined;
  image: ImageEntry | undefined;
}

function GameCard({ guess, image }: GameCardProps) {
  return (
    <Card
      className={classes.card}
      p={0}
      radius="md"
      shadow="md"
    >
      {image
        ? (
            <Image
              className={classes.image}
              src={image.storageUrl}
            />
          )
        : <Skeleton h="100%" w="100%" />}
      {image && guess !== undefined && (
        <Box className={classes.label} data-is-correct={guess.isCorrect}>
          <Group gap="xs" justify="center" c="white">
            {guess.isCorrect
              ? <CheckIcon size={ICON_SIZE} weight="bold" />
              : <XIcon size={ICON_SIZE} weight="bold" />}
            <Text fw="bold">{image.isAi ? "Slop" : "Real"}</Text>
          </Group>
        </Box>
      )}
    </Card>
  );
}

export { GameCard };
