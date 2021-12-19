import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import User from "models/User";
import dbConnect from "lib/dbConnect";

const signUpHandler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something broke!", err: err.toString() });
  },
  onNoMatch: (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "Page is not found" });
  },
}).post(async (req, res) => {
  await dbConnect();
  const { username, password }: { username: string; password: string } =
    req.body;
  if (!req.body || !username || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Error. Must have JSON object with username and password in request body.",
    });
    return;
  }
  const userExists = await User.exists({ username });
  if (userExists) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: `Error. User already exists with username ${username}.` });
  }
  const hashedPassword = await User.hashPassword(password);
  const user = new User({ username, password: hashedPassword });

  const jwtToken = await user.generateToken();
  await user.save();
  res.status(StatusCodes.CREATED).json({ data: jwtToken });
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default signUpHandler;
