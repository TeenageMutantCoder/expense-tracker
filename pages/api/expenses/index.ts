import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import passport from "../../../lib/passport";
import { IUserDocument } from "../../../models/User";
import Expense from "../../../models/Expense";
interface ExtendedRequest {
  user: IUserDocument;
  body?: {
    name?: string;
    cost: string;
    date?: string;
    tags?: string;
  };
}

const expenseHandler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something broke!" });
  },
  onNoMatch: (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "Page is not found" });
  },
})
  .use(passport.initialize())
  .get<ExtendedRequest>(
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      if (!req.user) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "Authentication error." });
        return;
      }
      const expenses = await Expense.find({ user: req.user.id });
      res.status(StatusCodes.OK).json({ data: expenses });
    }
  )
  .post<ExtendedRequest>(
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      if (!req.user) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "Authentication error." });
        return;
      }
      const expense = new Expense({ ...req.body, user: req.user.id });
      await expense.save();
      res.status(StatusCodes.CREATED).json({ data: expense });
    }
  );

export const config = {
  api: {
    bodyParser: true,
  },
};

export default expenseHandler;
