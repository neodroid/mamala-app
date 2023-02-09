import { Button, Flex, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";

import { useLogin } from "lib/hooks/useLogin";

const Home = () => {
  const router = useRouter();
  const toast = useToast();
  const [user, loading, signIn] = useLogin();
  const [inputValue, setInputValue] = useState("");
  const [isSeraching, setIsSearching] = useState(false);
  const handleCreateParty = async () => {
    if (user?.email) {
      setIsSearching(true);
      try {
        const response = await fetch("/api/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hostUID: user?.uid }),
        });
        const data = await response.json();
        localStorage.removeItem(`nickname${data.result}`);
        router.push(`/party/${data.result}`);
        setIsSearching(false);
      } catch (error) {
        setIsSearching(false);
        // console.error(error);
      }
    } else if (!loading) {
      signIn();
    }
  };

  const handlePartyNotFound = () => {
    toast({
      title: "Party not found",
      description: `We cannot find a party with code: ${inputValue}`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
    setIsSearching(false);
    setInputValue("");
  };

  const handleSearchParty = async () => {
    if (inputValue.length === 4) {
      setIsSearching(true);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: inputValue }),
        });
        const data = await response.json();
        if (data.result) {
          localStorage.removeItem(`nickname_${data.result}`);
          router.push(`/party/${data.result}`);
          setIsSearching(false);
        } else {
          handlePartyNotFound();
          // console.log("party not found");
        }
      } catch (error) {
        setIsSearching(false);
        // console.error(error);
      }
    }
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <NextSeo title="Mamala" />
      <Text fontWeight="bold" fontSize="2xl" textAlign="center">
        Mamala: The Dancing Game
      </Text>
      <Input
        placeholder="Party Code"
        width="30"
        value={inputValue}
        onChange={(e) => {
          if (e.target.value.length <= 4) {
            setInputValue(e.target.value.toUpperCase());
          }
        }}
      />
      {isSeraching ? (
        <Spinner />
      ) : (
        <>
          <Button
            onClick={handleSearchParty}
            isDisabled={inputValue.length !== 4}
          >
            Enter Code
          </Button>
          <Text mt="5">or</Text>
          <Button mt="5" onClick={handleCreateParty}>
            Create Party
          </Button>
        </>
      )}
    </Flex>
  );
};

export default Home;
