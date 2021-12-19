import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import dbConnect from "lib/dbConnect";
import User from "models/User";

const logInHandler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something broke!", err: err.stack });
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
  const user = await User.findOne({ username });
  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Error. No user with username ${username}` });
    return;
  }
  const passwordIsValid = await user.validatePassword(password);
  if (!passwordIsValid) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Incorrect password." });
    return;
  }
  const jwtToken = await user.generateToken();
  res.status(StatusCodes.OK).json({ data: jwtToken });
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default logInHandler;
