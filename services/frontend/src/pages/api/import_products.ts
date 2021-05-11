import { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import fetch from "node-fetch";

const feedProductService = (jsonData: string) => {
  const {
    products
  }: {
    products?: Array<{
      id: string;
      price: string;
      name: string;
      articles: Array<{
        id: string;
        amount: number;
      }>;
    }>;
  } = JSON.parse(jsonData);

  if (!products) return;

  products.forEach(product => {
    fetch(`http://products-service:3000/product`, {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "Content-Type": "application/json" }
    })
      .then(data => console.log("product imported"))
      .catch(error => console.error(error));
  });
};

const importProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let form = new multiparty.Form();
    form.parse(req);
    form.on("part", part => {
      part
        .on("data", chunk => {
          feedProductService(chunk.toString());
        })
        .on("close", () => {});
    });

    return res.status(200).send("uploading ...");
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default importProducts;
