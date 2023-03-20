/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export default async function fetchCustomer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      let data = req.body;
      let chat = await prisma.chat.create(data);

      res.json({
        chat,
      });
    } catch (err) {
      console.log(err);
      res.json({ msg: "Error: Couldn't save chat" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
