import React from "react";
import { Box, Spacer, Flex, Link } from "@chakra-ui/react";

function Navbar() {
  return (
    <Box bg="gray.100" p={3}>
      <Flex>
        <Link href="/">Home</Link>
        <Spacer />
        <Link href="/log-in" mx={1}>
          Log In
        </Link>
        <Link href="/sign-up" mx={1}>
          Sign Up
        </Link>
      </Flex>
    </Box>
  );
}

export default Navbar;
