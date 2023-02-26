/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import formidable from "formidable";
import fs from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "../../../../server/db";

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
    let { userId, fileName } = req.query;
    fileName = `${fileName} ${Date.now().toString()}.pdf`; //add time to it to make the filename unique
    let pdf_url = `https://pub-d138560812bf42bdb84dbe672d95be48.r2.dev/${bucket}/${fileName}`;
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
          await prisma.pdfFile.create({
            data: {
              userId: userId,
              pdf_url: pdf_url,
            },
          });
          return res.status(201).send("File uploaded");
        } catch (error) {
          console.log(error);
          res.status(500).send("no file uploaded");
        }
      }
    });
  }
}
