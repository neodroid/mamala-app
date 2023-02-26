import { Button, Center, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import type { Timestamp } from "firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { db } from "lib/firebase";
// import { useLogin } from "lib/hooks/useLogin";

interface User {
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  uid?: string | null;
}
interface PartyData {
  code: string;
  createdAt: Timestamp;
  hostUID: string;
}

interface LobbyProps {
  gameID: string;
  nickname: string;
  user?: User | null;
  partyData: PartyData;
}

interface Player {
  id?: string;
  nickname?: string;
  joined: boolean;
  ready: boolean;
}

const performFetch = (endpoint: string, body: object) => {
  try {
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    // console.error(error);
  }
};

const Lobby = ({ nickname, gameID, user, partyData }: LobbyProps) => {
  // const [user] = useLogin();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [readyLoading, setReadyLoading] = useState(false);
  const persistedNickname = localStorage.getItem(`nickname_${gameID}`);
  const [readyPlayerCount, setReadyPlayerCount] = useState(0);
  const isUserInPlayers = players.some((player) => player.id === user?.uid);

  const handlePlayerChange = useCallback(
    (player: Player, changeType: "added" | "modified" | "removed") => {
      if (changeType === "added") {
        const playerIndex = players.findIndex((p) => p.id === player.id);
        if (playerIndex !== -1) {
          setPlayers((prevPlayers) => {
            const newPlayers = [...prevPlayers];
            newPlayers[playerIndex] = player;
            return newPlayers;
          });
        } else {
          setPlayers((prevPlayers) => [...prevPlayers, player]);
        }
        if (player.id === user?.uid) {
          setIsPlayerReady(player.ready);
        }
      } else if (changeType === "modified") {
        setPlayers((prevPlayers) =>
          prevPlayers.map((prevPlayer) =>
            prevPlayer.id === player.id ? player : prevPlayer
          )
        );
      } else if (changeType === "removed") {
        // console.log("remove");
        if (player.id === user?.uid) {
          router.push(`/`);
        }
        setPlayers((prevPlayers) =>
          prevPlayers.filter((prevPlayer) => prevPlayer.id !== player.id)
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [players, user]
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `party/${gameID}/players`),
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const player = {
            id: change.doc.id,
            ...change.doc.data(),
          } as Player;
          // console.log(`DEBUG ${change.type}`);
          handlePlayerChange(player, change.type);
        });
      }
    );
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameID, user?.uid]);
  useEffect(() => {
    if (!players.find((player) => player.id === user?.uid)) {
      performFetch("/api/join", {
        partyId: gameID,
        uid: user?.uid,
        nickname: persistedNickname,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameID, persistedNickname, user?.uid]);

  useEffect(() => {
    setReadyPlayerCount(players.filter((player) => player.ready).length);
  }, [players]);

  const handleDelete = useCallback(
    (uid: string | null | undefined) => {
      performFetch("/api/delete", {
        partyId: gameID,
        uid,
      });
    },
    [gameID]
  );

  useEffect(() => {
    const unloadHandler = () => {
      handleDelete(user?.uid);
    };

    window.addEventListener("beforeunload", unloadHandler);

    return () => {
      window.removeEventListener("beforeunload", unloadHandler);
      handleDelete(user?.uid);
    };
  }, [handleDelete, user]);

  const handleReadyClicked = async () => {
    setReadyLoading(true);
    try {
      const response = await fetch("/api/ready", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          partyId: gameID,
          uid: user?.uid,
          ready: !isPlayerReady,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setReadyLoading(false);
        setIsPlayerReady(!isPlayerReady);
      }
    } catch (error) {
      setReadyLoading(false);
      // console.error(error);
    }
  };

  return (
    <Flex w="100%">
      {isUserInPlayers ? (
        <Stack minW="95%" justifyContent="center">
          {/* <Text>{user?.uid}</Text> */}
          <Text pb="5">Your nickname: {nickname || "anonymous"}</Text>
          {players.map((player) => (
            <Flex key={player.id} justifyContent="space-between">
              <Text>
                {player.nickname}{" "}
                {player.id === partyData.hostUID ? "[Host]" : ""}
              </Text>
              <Flex align="center">
                {player.ready ? (
                  <Text color="green"> Ready </Text>
                ) : (
                  <Text color="red"> Not Ready </Text>
                )}
                {user?.uid === partyData.hostUID && player.id !== user?.uid ? (
                  <Button
                    ml="5"
                    onClick={() => {
                      handleDelete(player.id);
                    }}
                  >
                    Kick
                  </Button>
                ) : (
                  <Flex />
                )}
              </Flex>
            </Flex>
          ))}
          <Center flexDir="column">
            <Text>
              {readyPlayerCount}/{players.length} are ready
            </Text>
            {readyLoading ? (
              <Spinner />
            ) : (
              <Button onClick={handleReadyClicked} maxW="200">
                {isPlayerReady ? "I'm Not Ready" : "I'm Ready"}
              </Button>
            )}
          </Center>
        </Stack>
      ) : (
        <Spinner />
      )}
    </Flex>
  );
};

export default Lobby;
