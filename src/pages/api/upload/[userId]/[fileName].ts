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
    //get user and file information from the request
    let { userId, fileName } = req.query;
    userId = userId?.toString();

    //get the customer information of the current user
    let customer = await prisma.customer.findFirst({
      where: { userId: userId },
    });

    //stop execution if customer is not found with the given userId
    if (!customer) {
      console.log("user account not found");
      return res.status(400).send("user account not found");
    }

    //check if the current customer hasn't exceeded the allowed number of file generations
    switch (customer?.billingPlan) {
      case "standard":
        //TODO - the numbers used here are only for testing purpose, change them later
        if (customer.generated_pdfs_count >= 5)
          return res
            .status(400)
            .send(
              "file generation limit exceeded for the current subscription plan"
            );
        break;
      case "pro":
        if (customer.generated_pdfs_count >= 10)
          return res
            .status(400)
            .send(
              "file generation limit exceeded for the current subscription plan"
            );
        break;
      case "business":
        if (customer.generated_pdfs_count >= 15)
          return res
            .status(400)
            .send(
              "file generation limit exceeded for the current subscription plan"
            );
        break;
      case "enterprise":
        if (customer.generated_pdfs_count >= 20)
          return res
            .status(400)
            .send(
              "file generation limit exceeded for the current subscription plan"
            );
        break;
      default:
        return res.status(400).send("user has not subscribed yet");
    }

    //add the current date and time to the file name to make it unique
    fileName = `${fileName} ${Date.now().toString()}.pdf`;

    //the public url of the object to be uploaded
    let pdf_url = `https://pub-d138560812bf42bdb84dbe672d95be48.r2.dev/${bucket}/${fileName}`;

    const form = formidable();
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (!files.pdfFile) {
        res.status(400).send("No file uploaded");
        return;
      } else {
        // Define the uploading parameters
        const params = {
          Bucket: bucket,
          Key: fileName,
          Body: fs.createReadStream(files.pdfFile.filepath),
          ACL: "public-read",
        };

        try {
          //upload file
          const command = new PutObjectCommand(params);
          await S3.send(command);
          console.log("file uploaded");

          //insert file information into pdfFile table
          await prisma.pdfFile.create({
            data: {
              userId: userId,
              pdf_url: pdf_url,
              file_name: fileName,
            },
          });
          console.log("pdf file entry created");

          //update generated pdfs count on customer table
          await prisma.customer.updateMany({
            where: { userId: userId },
            data: { generated_pdfs_count: { increment: 1 } },
          });
          console.log("number of files generated updated");

          return res.status(201).send("File uploaded");
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
