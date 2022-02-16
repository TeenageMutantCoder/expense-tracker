import React from "react";
import { Box, Spacer, Flex, Link } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <Box bg="gray.100" p={3}>
      <Flex>
        <Link href="/" mx={1}>
          Home
        </Link>
        <Link href="/expenses" mx={1}>
          Expenses
        </Link>
        <Spacer />
        {currentUser ? (
          <Link onClick={logout} mx={1}>
            Log Out
          </Link>
        ) : (
          <>
            <Link href="/log-in" mx={1}>
              Log In
            </Link>
            <Link href="/sign-up" mx={1}>
              Sign Up
            </Link>
          </>
        )}
      </Flex>
    </Box>
  );
}

export default Navbar;
