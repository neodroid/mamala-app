import { Flex, Img, Text } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

const Home = () => {
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
      <Text>COMING REAL SOON!</Text>
      <Img src="/mamala_team.jpeg" />
    </Flex>
  );
};

export default Home;
