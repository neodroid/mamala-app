import { Button, Center, Spinner, Text } from "@chakra-ui/react";
import type { FC } from "react";

interface ReadyButtonProps {
  handleReadyClicked: () => void;
  isPlayerReady: boolean;
  readyLoading: boolean;
  readyPlayerCount: number;
  totalPlayers: number;
  isHost: boolean;
}

const ReadyButton: FC<ReadyButtonProps> = ({
  handleReadyClicked,
  isPlayerReady,
  readyLoading,
  readyPlayerCount,
  totalPlayers,
  isHost,
}) => {
  return (
    <Center flexDir="column">
      <Text mt="20">
        {readyPlayerCount}/{totalPlayers} are ready
      </Text>
      {readyLoading ? (
        <Spinner />
      ) : (
        <div>
          {isHost ? (
            <Button
              onClick={handleReadyClicked}
              maxW="200"
              isDisabled={
                readyPlayerCount !== totalPlayers - 1 || totalPlayers < 2
              }
            >
              Start Game
            </Button>
          ) : (
            <Button onClick={handleReadyClicked} maxW="200">
              {isPlayerReady ? "I'm Not Ready" : "I'm Ready"}
            </Button>
          )}
        </div>
      )}
    </Center>
  );
};

export default ReadyButton;
