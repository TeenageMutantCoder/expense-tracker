import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import passport from "../../lib/passport";

const logInHandler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
})
  .use(passport.initialize())
  .post(passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send("Hello world");
  });

export default logInHandler;
