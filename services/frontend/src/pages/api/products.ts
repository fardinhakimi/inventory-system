import { NextApiRequest, NextApiResponse } from "next";
import { toArray } from "../../utils";
import fetch from "node-fetch";

export const getProducts = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") return res.status(400).end();

  const page = toArray(req.query["page"] || "0").shift();

  try {
    const response = await fetch(
      `http://query-service:3000/products?page=${page}`
    );
    const {
      products,
      total
    }: {
      total: number;
      products: Array<InventorySystem.Product>;
    } = await response.json();

    return res.status(200).send({ products, total });
  } catch (err) {
    const errorMessage = "Failed to get products";
    console.error(errorMessage);
    return res.status(500).end({ errorMessage });
  }
};

export default getProducts;
