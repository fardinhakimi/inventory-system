import { useState, useEffect } from "react"

export const useCurrentPage = () => {

  const pageKey = 'current_page'

  const [page, setPage] = useState(0)

  const savePageToLocalStorage = (currentPage: number) => localStorage.setItem(pageKey, JSON.stringify({ currentPage }))
  
  useEffect(() => {
    const item = localStorage.getItem(pageKey)
    if (!item) {
      savePageToLocalStorage(0)
      return
    }
    setPage(JSON.parse(item).currentPage)
  }, [])

  const updatePage = (currentPage: number) => {
    savePageToLocalStorage(currentPage)
    setPage(currentPage)
  }

  return {
    page, 
    updatePage
  }
}