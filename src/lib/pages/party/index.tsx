import { Button, Flex, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { auth } from "lib/firebase";
import { useLogin } from "lib/hooks/useLogin";

import Lobby from "./lobby";
// import firebase

const Party = () => {
  const router = useRouter();
  const queryID = router.query.partyID as string;
  const [inputValue, setInputValue] = useState("");
  const [nickname, setNickname] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [user, loading] = useLogin();

  useEffect(() => {
    if (!user && !loading) {
      auth.signInAnonymously();
    }
  }, [user, loading]);

  useEffect(() => {
    if (queryID) {
      const persistedNickname = localStorage.getItem(`nickname_${queryID}`);
      if (persistedNickname) {
        setNickname(persistedNickname);
      }
    }
  }, [queryID]);

  const handleNicknameEnter = async () => {
    setJoinLoading(true);
    setNickname(inputValue);
    localStorage.setItem(`nickname_${queryID}`, inputValue);
    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partyId: queryID,
          uid: user?.uid,
          nickname: inputValue,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setJoinLoading(false);
      }
    } catch (error) {
      setJoinLoading(false);
      // console.error(error);
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    );
  }
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
      // bg="blue"
    >
      <Text>{queryID}</Text>
      {user && !nickname ? (
        <Stack>
          <Text>{user.uid}</Text>
          <Text> Whats your nickname?</Text>
          <Input
            type="text"
            placeholder="Enter your nickname"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={handleNicknameEnter}>Enter</Button>
        </Stack>
      ) : (
        <Flex>
          {joinLoading ? (
            <Spinner />
          ) : (
            <Lobby nickname={nickname} gameID={queryID} user={user} />
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Party;
