import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Heading } from "@chakra-ui/react";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";

const SignUp: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage("jwt", null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form["password-1"].value;
    const password2 = form["password-2"].value;
    if (password !== password2) return alert("Passwords must match");
    const reqBody = JSON.stringify({ username, password });
    fetch("/api/sign-up", {
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
      router.push("/profile");
    }
  }, [user, router]);

  return (
    <div className="Sign-Up">
      <Heading align="center">Sign Up</Heading>
      <Container>
        <form onSubmit={onSubmit}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input type="text" placeholder="Please enter your username" />
          </FormControl>
          <FormControl id="password-1" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="text" placeholder="Please enter your password" />
          </FormControl>
          <FormControl id="password-2" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input type="text" placeholder="Please re-enter your password" />
          </FormControl>
          <Button mt={2} colorScheme="teal" variant="solid" type="submit">
            Sign Up
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default SignUp;
