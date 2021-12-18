import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
interface IProps {
  user: string;
  expenseId: string;
  name?: string;
  cost: number;
  date?: Date;
  tags?: string[];
}

function Expense({ user, expenseId, name, cost, date, tags }: IProps) {
  const [showEditForm, setShowEditForm] = useState(false);

  const deleteExpense = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + user },
    });
    if (!response.ok) return;
    const responseData = await response.json();
    if (!responseData.data) return alert("Failed to delete expense.");
    window.location.reload();
  };

  const editExpense = async (expenseData: {
    name: string | undefined;
    cost: number;
    date: Date | undefined;
    tags: string[] | undefined;
  }) => {
    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: "PATCH",
      headers: { Authorization: "Bearer " + user },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) return;
    const responseData = await response.json();
    return responseData.data; // Returns old expense
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
    const expenseData = { name, cost, date, tags };
    editExpense(expenseData);
    window.location.reload();
  };

  return (
    <div className="Expense">
      <h3>Name: {name}</h3>
      <p>Cost: {cost}</p>
      <p>Date: {date && new Date(date).toDateString()}</p>
      <p>Tags: {tags?.join(", ")}</p>
      <Button
        ml={2}
        colorScheme="red"
        variant="outline"
        onClick={deleteExpense}
      >
        Delete
      </Button>
      <Button
        ml={2}
        colorScheme="red"
        variant="outline"
        onClick={() => setShowEditForm(!showEditForm)}
      >
        Edit
      </Button>
      {showEditForm && (
        <form autoComplete="off" onSubmit={onSubmit}>
          <FormControl id="expenseName">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Please enter the name of the expense"
              defaultValue={name}
            />
          </FormControl>
          <FormControl id="expenseCost" isRequired>
            <FormLabel>Cost</FormLabel>
            <Input
              type="number"
              min={0.01}
              step={0.01}
              placeholder="Please enter the cost of the expense"
              defaultValue={cost}
            />
          </FormControl>
          <FormControl id="expenseDate">
            <FormLabel>Date</FormLabel>
            <Input type="date" defaultValue={String(date)} />
          </FormControl>
          <FormControl id="expenseTags">
            <FormLabel>Tags</FormLabel>
            <Input
              type="text"
              placeholder="Please enter tags separated by commas (ex: Household, Office, Furniture)"
              defaultValue={tags?.join(", ")}
            />
          </FormControl>
          <Button m={2} colorScheme="teal" variant="solid" type="submit">
            Edit Expense
          </Button>
          <Button m={2} colorScheme="teal" variant="outline" type="reset">
            Reset
          </Button>
        </form>
      )}
    </div>
  );
}

export default Expense;
