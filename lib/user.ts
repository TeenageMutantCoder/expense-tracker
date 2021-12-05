import dbConnect from "./dbConnect";

export async function findUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  await dbConnect();
}

export async function createUser() {}

export async function editUser() {}

export async function deleteUser() {}
