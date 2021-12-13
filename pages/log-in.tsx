import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Heading } from "@chakra-ui/react";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";
import router from "next/router";

const LogIn: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage("jwt", null);

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
      .then((data) => {
        const jwt = data.data;
        if (jwt) {
          setUser(jwt);
        }
      });
  };

  useEffect(() => {
    if (user) {
      router.push("/expenses");
    }
  }, [user, router]);

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
