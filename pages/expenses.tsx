import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";
import Expense from "components/Expense";

const Expenses: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage("jwt", null);
  const [expenses, setExpenses] = useState([]);

  const createExpense = async (expenseData: {
    name?: string;
    cost: number;
    date?: Date;
    tags?: string[];
  }) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { Authorization: "Bearer " + user },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) return;
    const responseData = await response.json();
    return responseData.data; // Returns new expense
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.expenseName.value || undefined;
    const cost = Number(form.expenseCost.value);
    const date = form.expenseDate.value || undefined;
    let tags = form.expenseTags.value || undefined;
    if (tags) {
      // Separates tags by commas and removes extra spaces
      tags = tags.split(",").map((tag: string) => tag.trim());
    }
    // Filter out undefined properties
    const expenseData = JSON.parse(JSON.stringify({ name, cost, date, tags }));
    createExpense(expenseData);
    window.location.reload();
  };

  useEffect(() => {
    if (!user) {
      router.push("/log-in");
    }

    async function getExpenses() {
      const response = await fetch("/api/expenses", {
        headers: { Authorization: "Bearer " + user },
      });
      if (!response.ok) return;
      const responseData = await response.json();
      return responseData.data;
    }

    getExpenses().then((data) => {
      if (!data) return alert("No data");
      setExpenses(data);
    });
  }, [user, router]);

  return (
    <div className="Expenses">
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
          <Input type="date" />
        </FormControl>
        <FormControl id="expenseTags">
          <FormLabel>Tags</FormLabel>
          <Input
            type="text"
            placeholder="Please enter tags separated by commas (ex: Household, Office, Furniture)"
          />
        </FormControl>
        <Button m={2} colorScheme="teal" variant="solid" type="submit">
          Create Expense
        </Button>
        <Button m={2} colorScheme="teal" variant="outline" type="reset">
          Clear Data
        </Button>
      </form>
      {expenses.length ? (
        expenses.map(
          (
            expense: {
              _id: string;
              cost: number;
              name?: string;
              tags?: string[];
              date?: Date;
            },
            index
          ) => (
            <Expense
              expenseId={expense._id}
              key={index}
              {...expense}
              user={user!}
            />
          )
        )
      ) : (
        <p>No expense data</p>
      )}

      <Button
        onClick={(e) => {
          setUser(null);
        }}
      >
        Clear data
      </Button>
    </div>
  );
};

export default Expenses;
