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

//delete pdf file
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "DELETE") {
    try {
      const { id } = req.query;

      //delete the entry from database
      const file = await prisma.pdfFile.delete({
        where: { id: id },
      });

      //delete the file from aws
      const { file_name } = file;

      console.log(`pdf_file ${file_name} record deleted from database`);

      // Define the delete command with the bucket and object key
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: file_name,
      });

      let response = await S3.send(deleteCommand);
      console.log(`Object ${file_name} deleted from bucket ${bucket}`);

      res.send("file deleted successfully");
    } catch (err) {
      console.log(err);
      res.send("unexpected error");
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}
