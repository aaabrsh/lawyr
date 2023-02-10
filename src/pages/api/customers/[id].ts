import { prisma } from "../../../server/db";

export default async function fetchCustomer(req: any, res: any) {
  if (req.method === "GET") {
    // get customer data
    const { id } = req.query;
    const customer = await prisma.customer.findFirst({
      where: {
        userId: id,
      },
    });
    res.json({ customer });
  } else {
    res.status(405).end("Method Not Allowed");
  }
}
