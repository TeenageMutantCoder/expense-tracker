import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Expense } from "../lib/db";

interface IProps {
  name: string | null;
  cost: number;
  date: Date | null;
  tags: string[] | null;
  deleteExpense: () => Promise<void>;
  editExpense: (expenseData: Expense) => Promise<void>;
}

function Expense({
  name,
  cost,
  date,
  tags,
  deleteExpense,
  editExpense,
}: IProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getProperDateFormat = (date: Date | null) => {
    if (!date) return "";

    const year = date.getFullYear().toString().padStart(4, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return [year, month, day].join("-");
  };

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
    setIsLoading(true);
    editExpense(expenseData)
      .then(() => {
        form.reset();
        setShowEditForm(false);
      })
      .catch((error) => alert(error.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="Expense">
      <h3>Name: {name}</h3>
      <p>Cost: {cost}</p>
      <p>Date: {date?.toDateString()}</p>
      <p>Tags: {tags?.join(", ")}</p>
      <Button
        ml={2}
        colorScheme="red"
        variant="outline"
        onClick={() => {
          setIsLoading(true);
          deleteExpense()
            .catch((error) => alert(error.message))
            .finally(() => setIsLoading(false));
        }}
        disabled={isLoading}
      >
        Delete
      </Button>
      <Button
        ml={2}
        colorScheme="red"
        variant="outline"
        onClick={() => setShowEditForm(!showEditForm)}
        disabled={isLoading}
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
              defaultValue={name ?? undefined}
            />
          </FormControl>
          <FormControl id="expenseCost" isRequired>
            <FormLabel>Cost</FormLabel>
            <Input
              type="number"
              min={0.01}
              step={0.01}
              placeholder="Please enter the cost of the expense"
              defaultValue={cost ?? undefined}
            />
          </FormControl>
          <FormControl id="expenseDate">
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              pattern="\d{4}-\d{2}-\d{2}"
              defaultValue={getProperDateFormat(date)}
            />
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
          <Button
            m={2}
            colorScheme="teal"
            variant="outline"
            type="reset"
            onClick={() => setShowEditForm(false)}
          >
            Cancel
          </Button>
        </form>
      )}
    </div>
  );
}

export default Expense;
