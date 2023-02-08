import { Stack, Text } from "@chakra-ui/react";

import { useLogin } from "lib/hooks/useLogin";

interface LobbyProps {
  // userID: string;
  nickname: string;
}

const Lobby = ({ nickname }: LobbyProps) => {
  const [user] = useLogin();

  return (
    <Stack bg="red">
      <Text>{user?.uid}</Text>
      <Text>Your nickname: {nickname || "anonymous"}</Text>
    </Stack>
  );
};

export default Lobby;
