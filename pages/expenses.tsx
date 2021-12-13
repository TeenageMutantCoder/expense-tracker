import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Heading } from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";
import Expense from "../components/Expense";

const Expenses: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage("jwt", null);
  const [expenses, setExpenses] = useState([]);

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
      if (!response.ok) return;
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
      {expenses.length ? (
        expenses.map((expense, index) => <Expense key={index} {...expense} />)
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
