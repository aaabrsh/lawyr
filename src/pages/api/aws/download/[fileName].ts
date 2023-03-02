/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    let { fileName } = req.query;

    // Define the uploading parameters
    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    try {
      //upload file
      const command = new GetObjectCommand(params);
      let { Body } = await S3.send(command);

      // create a Readable stream from the object Body
      const objectStream = Readable.from(Body);

      // set appropriate headers for the response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

      // pipe the object stream to the response stream
      objectStream.pipe(res);
    } catch (error) {
      console.log(error);
      res.status(error.$metadata.httpStatusCode).send(`no file found: ${error}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
