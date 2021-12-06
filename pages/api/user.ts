import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { StatusCodes } from "http-status-codes";
import passport from "../../lib/passport";
import { IUser } from "../../models/User";
interface ExtendedRequest {
  user: IUser;
}

const userHandler = nc<NextApiRequest, NextApiResponse>({
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
    (req, res) => {
      if (!req.user) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "Authentication error." });
        return;
      }
      res.status(StatusCodes.OK).json({ data: req.user });
    }
  );

export default userHandler;
