declare namespace InventorySystem {
  
  export type Article = {
    id: string
    name: string
    stock: number
  }

  export type Product = {
    id: string
    name: string
    quantity: number
    price: number
    articles: Array<Omit<Article, "stock"> & { amount: number }>
  }
}
