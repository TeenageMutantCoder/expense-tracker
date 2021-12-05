import mongoose from "mongoose";

interface IExpense {
  name: string;
  cost: number;
  date: Date;
  tags?: string[];
  user: mongoose.ObjectId;
}

const expenseSchema = new mongoose.Schema<IExpense>({
  name: { type: String, default: "" },
  cost: {
    type: Number,
    min: [0, "Cost must be greater than 0"],
    required: true,
  },
  date: { type: Date, required: true },
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId, // The ID of the User that created the expense
    ref: "User",
    required: true,
  },
});

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", expenseSchema);
