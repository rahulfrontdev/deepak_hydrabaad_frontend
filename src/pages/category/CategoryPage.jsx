import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { loadCategoryById } from '../../features/categories/categoriesSlice'
import { loadProductsByCategory } from '../../features/products/productsSlice'

const CategoryPage = () => {
  const { categoryId } = useParams()
  const dispatch = useAppDispatch()
  const { current: category, status: catStatus } = useAppSelector((s) => s.categories)
  const { list: products, status: prodStatus, error } = useAppSelector((s) => s.products)

  useEffect(() => {
    if (!categoryId) return
    dispatch(loadCategoryById(categoryId))
    dispatch(loadProductsByCategory(categoryId))
  }, [dispatch, categoryId])

  return (
    <section>
      <h1>Category</h1>
      {catStatus === 'loading' && <p>Loading category…</p>}
      {category && (
        <p>
          <strong>{category.name ?? category.title ?? categoryId}</strong>
        </p>
      )}
      <h2>Products in this category</h2>
      {prodStatus === 'loading' && <p>Loading products…</p>}
      {prodStatus === 'failed' && <p role="alert">{String(error)}</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id ?? p.slug}>
            <Link to={`/products/${p.id ?? p.slug}`}>{p.name ?? p.title ?? 'Product'}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CategoryPage
