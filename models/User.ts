import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export interface IUser {
  username: string;
  password: string;
  expenses?: Array<mongoose.Schema.Types.ObjectId>;
}

interface IUserDocument extends IUser, mongoose.Document {
  generateToken: () => Promise<string>;
  validatePassword: (password: string) => Promise<boolean>;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
  hashPassword: (password: string) => Promise<string>;
}

const userSchema = new mongoose.Schema<IUserDocument, IUserModel>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, required: true },
  expenses: {
    type: [mongoose.Schema.Types.ObjectId], // List of user's expenses' objectIds
    ref: "Expense",
  },
});

userSchema.methods.generateToken = async function () {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error(
      "Please define the JWT_SECRET environment variable inside .env.local"
    );
  }

  const token = await jwt.sign({}, JWT_SECRET, {
    expiresIn: "2h",
    audience: ["all"],
    subject: this._id.toString(),
    issuer: "expensetracker",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password: string) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

userSchema.statics.hashPassword = async function (password: string) {
  const hashedPassword = await bcrypt.hash(password, 8);
  return hashedPassword;
};

// slightly edited from https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/models/Pet.js
export default (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>("User", userSchema);
