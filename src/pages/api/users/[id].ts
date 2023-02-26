/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    let { id } = req.query;
    let userData = req.body;
    userData.dob = new Date(userData.dob);
    try {
      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...userData,
        },
      });
      res.send("user updated");
    } catch (err) {
      console.error(err);
      res.send("couldn't update user");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
