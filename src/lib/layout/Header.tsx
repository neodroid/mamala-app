import {
  Box,
  Flex,
  Spinner,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useLogin } from "lib/hooks/useLogin";
// import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const router = useRouter();
  const [user, loading, signIn, signOut] = useLogin();
  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <Flex
      as="header"
      width="full"
      align="center"
      justifyContent="space-between"
    >
      <Text cursor="pointer" onClick={handleLogoClick}>
        Mamala
      </Text>
      {/* <ThemeToggle/> */}
      <Box marginLeft="auto">
        {loading ? (
          <Spinner />
        ) : (
          <Flex>
            {user?.email ? (
              <Menu>
                <MenuButton>
                  <Avatar
                    name={user.displayName || ""}
                    src={user.photoURL || ""}
                  />
                </MenuButton>
                <MenuList>
                  {/* <MenuItem>
                    Beli
                  </MenuItem> */}
                  <MenuItem onClick={signOut}>
                    <Text color="red">Keluar</Text>
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button onClick={signIn}>Masuk</Button>
            )}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default Header;
