import { Box, Flex, Text, Button, Avatar } from "@chakra-ui/react";

import { useLogin } from "lib/hooks/useLogin";

const Header = () => {
  const [user, loading, signIn, signOut] = useLogin();

  return (
    <Flex as="header" width="full" align="center">
      <Box marginLeft="auto">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <Flex>
            {user ? (
              <Flex>
                <Button onClick={signOut}>Sign Out</Button>
                <Avatar
                  name={user.displayName || ""}
                  src={user.photoURL || ""}
                />
              </Flex>
            ) : (
              <Button onClick={signIn}>Sign In</Button>
            )}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default Header;
