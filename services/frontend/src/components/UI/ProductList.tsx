import useSWR from 'swr'
import Loader from './Loader'
import WithDataTable from './DataTable'
import { TableRow, TableCell, ButtonGroup, Button } from '@material-ui/core'
import Pagination from './Pagination'
import { useCurrentPage } from '../../hooks/useCurrentPage'

const fetcher = (url: string) => fetch(url)
  .then(r => r.json())

const useProducts = (page = 0) => {

  const { data, error } = useSWR<{ products: Array<InventorySystem.Product>, total: number}>(`/api/products?page=${page}`, fetcher)

  if (!data && !error) return { loading: true, error: false, products: null }
  
  
  if (!data || error) {
    console.error('Failed to fetch products')
    return { loading: false, error: true, products: null }
  }

  const { products, total } = data 
  
  return {
    loading: false,
    error: false,
    products,
    total
  }
}


const ProductList = () => {

  const { page, updatePage } = useCurrentPage()

  const { loading, error, products, total } = useProducts(page)

  if (loading) return <Loader type="ThreeDots"/>

  if (error) return <h3>Something went wrong</h3>

  const sellProductHandler = (id: string) => {}
  
  return (
    <div>
      <WithDataTable headers={['Id', 'Name', 'Price', 'Quantity']} withActions>

        {products.map((row) => (
          <TableRow key={row.id}>
              <TableCell component="th" scope="row"> {row.id}</TableCell>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">{row.price}</TableCell>
            <TableCell align="left">{row.quantity}</TableCell>
            <TableCell>
              <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                  <Button onClick={() => { sellProductHandler(row.id)}}>Sell</Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>)
        )}
        
      </WithDataTable>
      <Pagination
        count={total}
        page={page}
        changePageHandler={(currentPage) => updatePage(currentPage)}
      />
    </div>
  )
}

export default ProductList