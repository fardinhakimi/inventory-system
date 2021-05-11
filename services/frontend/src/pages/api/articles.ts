import { NextApiRequest, NextApiResponse } from "next";
import { toArray } from "../../utils";
export const getArticles = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") return res.status(400).end();

  try {
    const page = toArray(req.query["page"] || "0").shift();

    const response = await fetch(
      `http://inventory-service:3000/articles?page=${page}`
    );

    const {
      articles,
      total
    }: {
      articles: Array<InventorySystem.Article>;
      total: number;
    } = await response.json();
    return res.send({ articles, total });
  } catch (err) {
    const errorMessage = "Failed to get articles";
    console.error(errorMessage);
    return res.status(500).end({ errorMessage });
  }
};

export default getArticles;
