import { NextApiRequest, NextApiResponse } from "next";
import { toArray } from "../../utils";
import fetch from "node-fetch";

export const sellProduct = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") return res.status(400).end();

  if (!req.query["id"]) return res.status(400).end();

  const productId = toArray(req.query["id"] || "").shift();

  try {
    const response = await fetch(
      `http://products-service:3000/sell?id=${productId}`
    );

    if (!response.ok) throw new Error();

    return res.status(200).send("product sold");
  } catch (err) {
    const errorMessage = "Failed to get products";
    console.error(errorMessage);
    return res.status(500).end({ errorMessage });
  }
};

export default sellProduct;
