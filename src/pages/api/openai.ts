import { NextApiRequest, NextApiResponse } from "next";

const DEFAULT_PARAMS = {
  model: "text-davinci-003",
  temperature: 0.3,
  max_tokens: 800,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { prompt, formData } = req.body;
    const input = `${prompt} ${JSON.stringify({ ...formData })}`;

    const params = { ...DEFAULT_PARAMS, prompt: input };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(process.env.OPENAI_API_KEY ?? ""),
      },
      body: JSON.stringify(params),
    };

    try {
      let openai = await fetch(
        "https://api.openai.com/v1/completions",
        requestOptions
      ).then((response) => response.json());
      const text = openai.choices[0].text;
      res.send(text);
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
