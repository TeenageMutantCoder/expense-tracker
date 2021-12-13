import React from "react";

interface IProps {
  name?: string;
  cost: number;
  date?: Date;
  tags?: string[];
}

function Expense({ name, cost, date, tags }: IProps) {
  return (
    <div className="Expense">
      <h3>Name: {name}</h3>
      <p>Cost: {cost}</p>
      <p>Date: {date && new Date(date).toDateString()}</p>
      <p>Tags: {tags?.join(", ")}</p>
    </div>
  );
}

export default Expense;
