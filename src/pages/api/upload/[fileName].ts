import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import formidable from "formidable";
import fs from "node:fs";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

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
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {

    const { fileName } = req.query;
    const form = formidable();
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (!files.pdfFile) {
        res.status(400).send("No file uploaded");
        return;
      } else {
        const params = {
          Bucket: bucket,
          Key: fileName,
          Body: fs.createReadStream(files.pdfFile.filepath),
          ACL: "public-read",
        };

        try {
          const command = new PutObjectCommand(params);
          await S3.send(command);
          return res.status(201).send("File uploaded");
        } catch (error) {
          console.log(error);
          res.status(500).send("no file uploaded");
        }
      }
    });
  }
}