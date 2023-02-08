import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      <Text fontSize="sm">
        {new Date().getFullYear()} - made with ❤️ by{" "}
        <Link
          href="https://twitter.com/kevinahmad"
          isExternal
          rel="noopener noreferrer"
          textDecoration="underline"
        >
          mamala
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
