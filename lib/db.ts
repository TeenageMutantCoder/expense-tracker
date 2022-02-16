import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

interface AbstractExpense {
  name: string | null;
  cost: number | null;
  date: Date | Timestamp | null;
  tags: [string] | null;
}

export interface Expense extends AbstractExpense {
  date: Date | null;
}

export interface StrictExpense extends Expense {
  cost: number;
}

export interface StrictExpenseWithUid extends StrictExpense {
  uid: string;
}

export interface FormattedExpense extends AbstractExpense {
  date: Timestamp | null;
}

export interface ExpenseFromDB extends FormattedExpense {
  cost: number;
}

function formatExpenseData({ date, ...rest }: Expense) {
  let formattedDate = date && Timestamp.fromDate(date);

  if (!formattedDate) return { ...rest } as FormattedExpense;
  return { date: formattedDate, ...rest } as FormattedExpense;
}

export function createExpense(expenseData: StrictExpense) {
  let formattedExpenseData = formatExpenseData(expenseData);

  return addDoc(collection(db, "expenses"), {
    userId: auth.currentUser!.uid,
    ...formattedExpenseData,
  });
}

export function deleteExpense(expenseId: string) {
  return deleteDoc(doc(db, "expenses", expenseId));
}

export function updateExpense(expenseId: string, expenseData: Expense) {
  let formattedExpenseData = formatExpenseData(expenseData);

  return updateDoc(doc(db, "expenses", expenseId), formattedExpenseData as any);
}
