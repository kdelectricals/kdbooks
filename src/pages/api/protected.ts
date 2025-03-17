import { getServerSession } from "next-auth";
import  authOptions from "./auth/[...nextauth]"; // Import your NextAuth config
/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function handler(req:any, res:any) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({ message: "Welcome to the protected route!" });
}
