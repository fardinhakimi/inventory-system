import { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import fetch from "node-fetch";

const feedInventory = (jsonData: string) => {
  const {
    articles
  }: {
    articles?: Array<{
      id: string;
      name: string;
      stock: number;
    }>;
  } = JSON.parse(jsonData);

  if (!articles) return;

  articles.forEach(article => {
    fetch(`http://inventory-service:3000/article`, {
      method: "POST",
      body: JSON.stringify(article),
      headers: { "Content-Type": "application/json" }
    })
      .then(data => console.log("article imported"))
      .catch(data => console.log("article import failed"));
  });
};

const importArticles = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let form = new multiparty.Form();
    form.parse(req);
    form.on("part", part => {
      part
        .on("data", chunk => {
          feedInventory(chunk.toString());
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

export default importArticles;
