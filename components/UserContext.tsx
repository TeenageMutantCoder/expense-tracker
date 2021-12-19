import React from "react";

interface ContextOptions {
  userToken: string | null;
  setUserToken: (value: any) => any;
}
const contextOptions: ContextOptions = {
  userToken: null,
  setUserToken: () => {},
};

export default React.createContext(contextOptions);
