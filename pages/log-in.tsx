import type { NextPage } from "next";
import { Heading } from "@chakra-ui/react";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

const LogIn: NextPage = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form.password.value;
    const reqBody = JSON.stringify({ username, password });
    fetch("/api/log-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: reqBody,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  return (
    <div className="Home">
      <Heading align="center">Log In</Heading>
      <Container>
        <form onSubmit={onSubmit}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input type="text" placeholder="Please enter your username" />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="text" placeholder="Please enter your password" />
          </FormControl>
          <Button mt={2} colorScheme="teal" variant="solid" type="submit">
            Log In
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default LogIn;
