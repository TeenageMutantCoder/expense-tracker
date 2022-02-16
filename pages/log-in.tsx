import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Center,
  CloseButton,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

const LogIn: NextPage = () => {
  const router = useRouter();
  const { currentUser, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    if (!login) return;

    setError("");
    setIsLoading(true);
    login(email, password)
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/expenses");
    }
  }, [currentUser, router]);

  return (
    <div className="Home">
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <CloseButton
            onClick={() => setError("")}
            position="absolute"
            right="8px"
            top="8px"
          />
        </Alert>
      )}
      <Heading align="center">Log In</Heading>
      <Container>
        <form onSubmit={onSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              autoComplete="email"
              placeholder="Please enter your email"
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="text"
              autoComplete="current-password"
              placeholder="Please enter your password"
            />
          </FormControl>
          <Button
            disabled={isLoading}
            mt={2}
            colorScheme="teal"
            variant="solid"
            type="submit"
          >
            Log In
          </Button>
        </form>
        <Center>
          <Text mr={3}>Don&apos;t have an account?</Text>
          <NextLink href="/sign-up" passHref>
            <Link>Sign Up</Link>
          </NextLink>
        </Center>
      </Container>
    </div>
  );
};

export default LogIn;
