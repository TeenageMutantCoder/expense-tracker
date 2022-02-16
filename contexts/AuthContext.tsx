import React, { useState, useContext, useEffect } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateEmail as _updateEmail,
  updatePassword as _updatePassword,
} from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";

interface ContextOptions {
  currentUser: User | null | undefined;
  login:
    | ((email: string, password: string) => Promise<UserCredential>)
    | undefined;
  signup:
    | ((email: string, password: string) => Promise<UserCredential>)
    | undefined;
  logout: (() => Promise<void>) | undefined;
  resetPassword: ((email: string) => Promise<void>) | undefined;
}
const contextOptions: ContextOptions = {
  currentUser: undefined as ContextOptions["currentUser"],
  login: undefined as ContextOptions["login"],
  signup: undefined as ContextOptions["signup"],
  logout: undefined as ContextOptions["logout"],
  resetPassword: undefined as ContextOptions["resetPassword"],
};

const AuthContext = React.createContext(contextOptions);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(true);

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
