import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { loadProducts } from '../../features/products/productsSlice'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'

const ProductsPage = () => {
  const dispatch = useDispatch()
  const { list: products, status, error } = useSelector((state) => state.products)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadProducts())
    }
  }, [dispatch, status])

  const [category, setCategory] = useState('All')
  const search = searchParams.get('q') ?? ''

  const categoryOptions = useMemo(() => {
    const names = new Set()
    products.forEach((p) => {
      const categoryName =
        typeof p?.category === 'string' ? p.category : p?.category?.name
      if (categoryName) names.add(categoryName)
    })
    return ['All', ...Array.from(names)]
  }, [products])

  const setSearch = (value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value.trim()) next.set('q', value.trim())
        else next.delete('q')
        return next
      },
      { replace: true }
    )
  }

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      const productCategory =
        typeof p?.category === 'string' ? p.category : p?.category?.name
      if (category !== 'All' && productCategory !== category) return false
      if (q) {
        const hay = `${p.name} ${p.brand ?? ''} ${p.description ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [products, category, search])

  const handleClear = () => {
    setCategory('All')
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="">
      <header className="mb-3">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Products</h1>
        {/* <p className="mt-1 text-sm text-neutral-600">Browse the catalog. Data comes from `src/data/productsData.js` until your API is wired.</p> */}
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <ProductFilter
          categories={categoryOptions}
          category={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
          onClear={handleClear}
          resultCount={filteredProducts.length}
        />

        {status === 'loading' ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white py-20">
            <p className="text-sm text-neutral-600">Loading products...</p>
          </div>
        ) : status === 'failed' ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 py-20 text-center">
            <p className="text-sm font-medium text-red-700">Failed to load products.</p>
            {error && <p className="mt-2 text-xs text-red-500">{String(error)}</p>}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-20 text-center">
            <p className="text-sm font-medium text-neutral-700">No products match your filters.</p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-3 text-sm font-medium text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
