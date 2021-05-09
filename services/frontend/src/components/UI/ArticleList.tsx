import { useEffect } from 'react'
import useSWR from 'swr'
import Loader from './Loader'
import WithDataTable from './DataTable'
import { TableRow, TableCell, ButtonGroup, Button } from '@material-ui/core'
import Pagination from './Pagination'
import { useCurrentPage } from '../../hooks/useCurrentPage'

const fetcher = (url: string) => fetch(url)
  .then(r => r.json())

const useArticles = (page = 0) => {

  const { data, error } = useSWR<{ articles: Array<InventorySystem.Article>, total: number}>(`/api/articles?page=${page}`, fetcher)

  if (!data && !error) return { loading: true, error: false, articles: null }
  
  
  if (!data || error) {
    console.error('Failed to fetch articles')
    return { loading: false, error: true, articles: null }
  }

  const { articles, total } = data 
  
  return {
    loading: false,
    error: false,
    articles,
    total
  }
}


const ArticleList = () => {

  const { page, updatePage } = useCurrentPage()

  const { loading, error, articles, total } = useArticles(page)

  if (loading) return <Loader type="ThreeDots"/>

  if (error) return <h3>Something went wrong</h3>
  
  return (
    <div>
      <WithDataTable headers={['Id', 'Name', 'Stock']}>

        {articles.map((row) => (
          <TableRow key={row.id}>
              <TableCell component="th" scope="row"> {row.id}</TableCell>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">{row.stock > 0 ? row.stock : 'Out of stock'}</TableCell>
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

export default ArticleList