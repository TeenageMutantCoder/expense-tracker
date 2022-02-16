import { useEffect, useState } from "react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
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

const SignUp: NextPage = () => {
  const router = useRouter();
  const { currentUser, signup } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form["password"].value;
    const passwordConfirm = form["password-confirm"].value;
    if (password !== passwordConfirm) return setError("Passwords do not match");

    if (!signup) return;

    setError("");
    setIsLoading(true);
    signup(email, password)
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
    <div className="Sign-Up">
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
      <Heading align="center">Sign Up</Heading>
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
              autoComplete="new-password"
              placeholder="Please enter your password"
            />
          </FormControl>
          <FormControl id="password-confirm" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="text"
              autoComplete="new-password"
              placeholder="Please re-enter your password"
            />
          </FormControl>
          <Button
            disabled={isLoading}
            mt={2}
            colorScheme="teal"
            variant="solid"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
        <Center>
          <Text mr={3}>Already have an account?</Text>
          <NextLink href="/log-in" passHref>
            <Link>Log In</Link>
          </NextLink>
        </Center>
      </Container>
    </div>
  );
};

export default SignUp;
