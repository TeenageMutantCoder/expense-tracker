import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import passport from "../../../lib/passport";
import { IUserDocument } from "../../../models/User";
import Expense from "../../../models/Expense";
import { read } from "fs";

interface ExtendedRequest {
  user: IUserDocument;
}

const expenseIdHandler = nc<NextApiRequest, NextApiResponse>({
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
  .delete<ExtendedRequest>(
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          msg: "Authentication error.",
        });
        return;
      }
      const expense = await Expense.findByIdAndDelete(req.query.expenseId);
      res.status(StatusCodes.OK).json({ data: expense });
    }
  );

export const config = {
  api: {
    bodyParser: true,
  },
};

export default expenseIdHandler;
