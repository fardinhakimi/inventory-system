import { NextApiRequest, NextApiResponse } from 'next'
import { toArray } from '../../utils'
export const getArticles = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
  if (req.method !== 'GET') return res.status(400).end()

  try {
    const page = Number(toArray(req.query['page'] || '').shift())
    const response = await fetch(`${process.env.INVENTORY_SERVICE}/articles?page=${page}`)
    const data: { articles: Array<InventorySystem.Article> } = await response.json()
    return res.send({ products: data.articles })
    
	} catch (err) {
		const errorMessage = 'Failed to get articles'
		console.error(errorMessage)
		return res.status(500).end({ errorMessage })
	}
}

export default getArticles
