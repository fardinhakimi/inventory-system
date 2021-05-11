declare namespace InventorySystem {
  export type Article = {
    id: string;
    name: string;
    stock: number;
  };

  export type ContainedArticle = Omit<Article, "stock"> & { amount: number };

  export type Product = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    articles: Array<ContainedArticle>;
  };
}
