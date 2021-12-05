import type { NextPage } from "next";
import { Heading } from "@chakra-ui/react";
import { Container, FormControl, FormLabel, Input } from "@chakra-ui/react";

const LogIn: NextPage = () => {
  return (
    <div className="Home">
      <Heading align="center">Log In</Heading>
      <Container>
        <form action="/log-in" method="post">
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Please enter your email" />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="text" placeholder="Please enter your password" />
          </FormControl>
        </form>
      </Container>
    </div>
  );
};

export default LogIn;
