import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Expense from "components/Expense";
import UserContext from "components/UserContext";

const Expenses: NextPage = () => {
  const router = useRouter();
  const { userToken, setUserToken } = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);

  const createExpense = async (expenseData: {
    name?: string;
    cost: number;
    date?: Date;
    tags?: string[];
  }) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { Authorization: "Bearer " + userToken },
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
    if (!userToken) {
      router.push("/log-in");
      return;
    }

    async function getExpenses() {
      const response = await fetch("/api/expenses", {
        headers: { Authorization: "Bearer " + userToken },
      });
      if (!response.ok) return;
      const responseData = await response.json();
      return responseData.data;
    }

    getExpenses().then((data) => {
      if (!data) return alert("No data");
      setExpenses(data);
    });
  }, [userToken, router]);

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
          ) => <Expense expenseId={expense._id} key={index} {...expense} />
        )
      ) : (
        <p>No expense data</p>
      )}
    </div>
  );
};

export default Expenses;
