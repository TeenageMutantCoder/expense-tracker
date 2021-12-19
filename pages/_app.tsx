import "styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";
import UserContext from "components/UserContext";
import Navbar from "components/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  const [userToken, setUserToken] = useLocalStorage("jwt", null);
  return (
    <ChakraProvider>
      <UserContext.Provider value={{ userToken, setUserToken }}>
        <Navbar />
        <Component {...pageProps} />
      </UserContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
