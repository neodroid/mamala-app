import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import { useLogin } from "lib/hooks/useLogin";

const Home = () => {
  const router = useRouter();
  const [user] = useLogin();
  const handleCreateParty = async () => {
    if (user) {
      try {
        const response = await fetch("/api/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hostUID: user.uid }),
        });
        const data = await response.json();
        localStorage.removeItem(`nickname${data.result}`);
        router.push(`/party/${data.result}`);
      } catch (error) {
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
      <Input placeholder="Party Code" width="30" />
      <Button>Enter Code</Button>
      <Text mt="5">or</Text>
      <Button mt="5" onClick={handleCreateParty}>
        Create Party
      </Button>
    </Flex>
  );
};

export default Home;
