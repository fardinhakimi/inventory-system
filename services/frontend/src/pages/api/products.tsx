import { NextApiRequest, NextApiResponse } from 'next'
import { toArray } from '../../utils'
import fetch from 'node-fetch'

export const getProducts = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {

  if (req.method !== 'GET') return res.status(400).end()

  const previous = toArray(req.query['previous'] || '0').shift()

  try {

    const response = await fetch(`${process.env.QUERY_SERVICE}/products?previous=${previous}`)
    const data: { total: number, products: Array<InventorySystem.Product> } = await response.json()
    return res.send({ products: data.products, total: data.total })
    
	} catch (err) {
		const errorMessage = 'Failed to get products'
		console.error(errorMessage)
		return res.status(500).end({ errorMessage })
	}
}

export default getProducts
