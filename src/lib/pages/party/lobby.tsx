import { Button, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { collection, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { db } from "lib/firebase";
// import { useLogin } from "lib/hooks/useLogin";

interface User {
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  uid?: string | null;
}

interface LobbyProps {
  gameID: string;
  nickname: string;
  user?: User | null;
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

const Lobby = ({ nickname, gameID, user }: LobbyProps) => {
  // const [user] = useLogin();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [readyLoading, setReadyLoading] = useState(false);
  const persistedNickname = localStorage.getItem(`nickname_${gameID}`);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `party/${gameID}/players`),
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const player = {
            id: change.doc.id,
            ...change.doc.data(),
          } as Player;
          if (change.type === "added") {
            setPlayers((prevPlayers) => [...prevPlayers, player]);
            if (player.id === user?.uid) {
              setIsPlayerReady(player.ready);
            }
          } else if (change.type === "modified") {
            setPlayers((prevPlayers) =>
              prevPlayers.map((prevPlayer) =>
                prevPlayer.id === player.id ? player : prevPlayer
              )
            );
          } else if (change.type === "removed") {
            setPlayers((prevPlayers) =>
              prevPlayers.filter((prevPlayer) => prevPlayer.id !== player.id)
            );
          }
        });
      }
    );
    return () => unsubscribe();
  }, [gameID, user?.uid]);

  useEffect(() => {
    if (!players.find((player) => player.id === user?.uid)) {
      performFetch("/api/join", {
        partyId: gameID,
        uid: user?.uid,
        nickname: persistedNickname,
      });
    }
  }, [players, gameID, persistedNickname, user?.uid]);

  const handleDelete = useCallback(() => {
    performFetch("/api/delete", {
      partyId: gameID,
      uid: user?.uid,
    });
  }, [gameID, user]);

  useEffect(() => {
    window.addEventListener("beforeunload", async () => {
      handleDelete();
    });

    return () => {
      window.removeEventListener("beforeunload", async () => {
        handleDelete();
      });
    };
  }, [handleDelete]);

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
    <Stack>
      <Text>{user?.uid}</Text>
      <Text mb="20">Your nickname: {nickname || "anonymous"}</Text>
      {players.map((player) => (
        <Flex key={player.id} justifyContent="space-between">
          <Text>{player.nickname}</Text>
          {player.ready ? (
            <Text color="green"> Ready </Text>
          ) : (
            <Text color="red"> Not Ready </Text>
          )}
        </Flex>
      ))}
      {readyLoading ? (
        <Spinner />
      ) : (
        <Button onClick={handleReadyClicked}>
          {isPlayerReady ? "I'm Not Ready" : "I'm Ready"}
        </Button>
      )}
      {/* <Button onClick={handleDelete}>Delete</Button> */}
    </Stack>
  );
};

export default Lobby;
