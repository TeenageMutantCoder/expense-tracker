import React from "react";
import { Button } from "@chakra-ui/react";
interface IProps {
  user: string;
  expenseId: string;
  name?: string;
  cost: number;
  date?: Date;
  tags?: string[];
}

function Expense({ user, expenseId, name, cost, date, tags }: IProps) {
  const deleteExpense = async () => {
    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + user },
    });
    if (!response.ok) return;
    const responseData = await response.json();
    return responseData.data;
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    deleteExpense().then((data) => {
      if (!data) return alert("Failed to delete expense.");
      window.location.reload();
    });
  };

  return (
    <div className="Expense">
      <h3>Name: {name}</h3>
      <p>Cost: {cost}</p>
      <p>Date: {date && new Date(date).toDateString()}</p>
      <p>Tags: {tags?.join(", ")}</p>
      <Button ml={2} colorScheme="red" variant="outline" onClick={onClick}>
        Delete
      </Button>
    </div>
  );
}

export default Expense;
