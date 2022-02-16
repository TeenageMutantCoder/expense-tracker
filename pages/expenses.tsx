import type { NextPage } from "next";
import type { ExpenseFromDB, StrictExpenseWithUid } from "../lib/db";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  CloseButton,
  Heading,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Expense from "../components/Expense";
import { useAuth } from "../contexts/AuthContext";
import { createExpense, deleteExpense, updateExpense } from "../lib/db";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "lib/firebase";

const Expenses: NextPage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState<StrictExpenseWithUid[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.expenseName.value || null;
    const cost = Number(form.expenseCost.value);
    let date = form.expenseDate.valueAsDate || null;
    let tags = form.expenseTags.value || null;

    // If date is not null, sets date (currently based off UTC) to be based on local time.
    if (date) {
      const localDate = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
      );
      date = localDate;
    }

    // If tags is not null, separates tags by commas and removes extra spaces
    if (tags) {
      tags = tags.split(",").map((tag: string) => tag.trim());
    }

    const expenseData = { name, cost, date, tags };
    createExpense(expenseData).then(() => form.reset());
  };

  useEffect(() => {
    if (!currentUser) {
      router.push("/log-in");
      return;
    }

    const userExpensesQuery = query(
      collection(db, "expenses"),
      where("userId", "==", auth.currentUser?.uid)
    );

    const unsubscribe = onSnapshot(userExpensesQuery, (querySnapshot) => {
      let expensesData: StrictExpenseWithUid[] = [];

      querySnapshot.forEach((doc) => {
        const { date, ...rest } = doc.data() as ExpenseFromDB;
        const expenseData: StrictExpenseWithUid = {
          uid: doc.id,
          date: date && date.toDate(),
          ...rest,
        };
        expensesData.push(expenseData);
      });

      setExpenses(expensesData);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser, router]);

  return (
    <div className="Expenses">
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
      <Heading align="center">Expenses</Heading>
      <form autoComplete="off" onSubmit={onSubmit}>
        <FormControl id="expenseName">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="Please enter the name of the expense"
          />
        </FormControl>
        <FormControl id="expenseCost" isRequired>
          <FormLabel>Cost</FormLabel>
          <Input
            type="number"
            min={0.01}
            step={0.01}
            placeholder="Please enter the cost of the expense"
          />
        </FormControl>
        <FormControl id="expenseDate">
          <FormLabel>Date</FormLabel>
          <Input type="date" pattern="\d{4}-\d{2}-\d{2}" />
        </FormControl>
        <FormControl id="expenseTags">
          <FormLabel>Tags</FormLabel>
          <Input
            type="text"
            placeholder="Please enter tags separated by commas (ex: Household, Office, Furniture)"
          />
        </FormControl>
        <Button
          disabled={isLoading}
          m={2}
          colorScheme="teal"
          variant="solid"
          type="submit"
        >
          Create Expense
        </Button>
        <Button
          disabled={isLoading}
          m={2}
          colorScheme="teal"
          variant="outline"
          type="reset"
        >
          Clear Data
        </Button>
      </form>
      {expenses.length ? (
        expenses.map(({ uid, ...rest }: StrictExpenseWithUid) => (
          <Expense
            key={uid}
            editExpense={(expenseData) => updateExpense(uid, expenseData)}
            deleteExpense={() => deleteExpense(uid)}
            {...rest}
          />
        ))
      ) : (
        <p>No expense data</p>
      )}
    </div>
  );
};

export default Expenses;
