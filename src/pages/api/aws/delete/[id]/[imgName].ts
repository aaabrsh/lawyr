import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "../../../../../server/db";

const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY ?? "";
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID ?? "";
const URL = process.env.URL ?? "";
const bucket = process.env.BUCKET ?? "";
const S3 = new S3Client({
  region: "auto",
  endpoint: URL,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

//delete image file
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "DELETE") {
    try {
      let { imgName, id } = req.query;
      imgName = imgName?.toString();
      id = id?.toString();

      //remove the signature record from user table
      const user = await prisma.user.update({
        where: { id: id },
        data: { signature: null },
      });

      console.log(`image ${imgName} record deleted from user table`);

      // Define the delete command with the bucket and object key
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: imgName,
      });

      let response = await S3.send(deleteCommand);
      console.log(`Object ${imgName} deleted from bucket ${bucket}`);

      res.send("image deleted successfully");
    } catch (err) {
      console.log(err);
      res.send("unexpected error");
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}
