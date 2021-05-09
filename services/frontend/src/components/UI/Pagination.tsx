import { TablePagination } from "@material-ui/core"

type Props = {
  count: number
  page: number
  changePageHandler: (page: number) => void

}
const Pagination = ({ count, page, changePageHandler}: Props) => {

  const handleChangePage = (event, newPage: number) => {
    changePageHandler(newPage)
  }

  return (
    <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={count}
        rowsPerPage={10}
        page={page}
        onChangePage={handleChangePage}
      />
  )
}

export default Pagination