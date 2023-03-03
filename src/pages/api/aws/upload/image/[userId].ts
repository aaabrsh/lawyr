/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import formidable from "formidable";
import fs from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
    //get user and file information from the request
    let { userId } = req.query;
    userId = userId?.toString();

    //add the current date and time to the file name to make it unique
    let fileName = `signatures/Signature ${Date.now().toString()}.png`;

    //get the customer information of the current user
    let customer = await prisma.customer.findFirst({
      where: { userId: userId },
    });

    //stop execution if customer is not found with the given userId
    if (!customer) {
      console.log("customer account not found");
      return res.status(404).send("customer account not found");
    }

    const form = formidable();
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (!files.image) {
        res.status(400).send("No file uploaded");
        return;
      } else {

        // Define the uploading parameters
        const params = {
          Bucket: bucket,
          Key: fileName,
          Body: fs.createReadStream(files.image.filepath),
          ACL: "public-read",
        };

        try {
          //upload file
          const command = new PutObjectCommand(params);
          let awsResponse = await S3.send(command);
          console.log("Image uploaded successfully");

          //if upload was successfull
          if (
            awsResponse.$metadata.httpStatusCode >= 200 &&
            awsResponse.$metadata.httpStatusCode < 300
          ) {
            //insert image information into user table
            await prisma.user.update({
              where: {
                id: userId,
              },
              data: {
                signature: fileName,
              },
            });
            console.log("signature added to user table");

            return res.status(201).send("Image uploaded successfully");
          } else {
            res.status(awsResponse.$metadata.httpStatusCode).send("error: file not uploaded");
          }
        } catch (error) {
          console.log(error);
          res.status(500).send("no file uploaded");
        }
      }
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
