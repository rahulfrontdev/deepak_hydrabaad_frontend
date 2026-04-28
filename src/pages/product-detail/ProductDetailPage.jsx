import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearCurrentProduct, loadProductById } from '../../features/products/productsSlice'

/** Isolated so `key={productId}` on the parent remount resets the selected image without an effect. */
function ProductGallery({ product }) {
  const gallery = product.images?.length ? product.images : [product.image]
  const [activeImage, setActiveImage] = useState(gallery[0])

  return (
    <div>
      <div className=" overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
        <img src={activeImage || product.image} alt="" style={{ height: '390px' }} className="h-full w-full object-cover" />
      </div>
      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActiveImage(src)}
              className={`h-11 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${activeImage === src ? 'border-blue-600' : 'border-transparent'
                }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ProductDetailPage = () => {
  const { productId } = useParams()
  const dispatch = useAppDispatch()
  const { current: productRaw, status, error } = useAppSelector((s) => s.products)
  const { addItem, updateQty, getItem } = useCart()

  useEffect(() => {
    if (!productId) return
    dispatch(loadProductById(productId))
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, productId])

  const product = useMemo(() => {
    if (!productRaw) return null
    const id = productRaw?._id || productRaw?.id || productId
    const categoryLabel =
      typeof productRaw?.category === 'string'
        ? productRaw.category
        : productRaw?.category?.name || ''
    const image = productRaw?.imageUrl || productRaw?.image || ''
    const price = Number(productRaw?.specialOfferPrice || productRaw?.price || 0)
    const normalizedExtraImages = Array.isArray(productRaw?.images)
      ? productRaw.images
          .map((img) => {
            if (typeof img === 'string') return img
            if (img && typeof img === 'object') return img.url || img.imageUrl || ''
            return ''
          })
          .filter(Boolean)
      : []
    const gallery = Array.from(new Set([image, ...normalizedExtraImages].filter(Boolean)))

    return {
      ...productRaw,
      id,
      category: categoryLabel,
      image,
      images: gallery,
      price,
    }
  }, [productRaw, productId])

  const cartItem = product ? getItem(product.id) : null
  const qtyInCart = cartItem?.qty ?? 0

  if (status === 'loading') {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-sm text-neutral-600">Loading product details...</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">Unable to load product</h1>
        <p className="mt-2 text-sm text-neutral-600">{String(error || 'Please try again.')}</p>
        <Link to="/products" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className=" px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">Product not found</h1>
        <p className="mt-2 text-sm text-neutral-600">This item may have been removed or the link is incorrect.</p>
        <Link to="/products" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="  px-4 py-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link to="/products" className="hover:text-blue-600">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery key={product.id} product={product} />

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            {product.brand || product.category}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-neutral-900">{product.name}</h1>
          <p className="mt-2 text-sm text-neutral-600">
            <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-neutral-700">
              {product.category}
            </span>
          </p>
          <p className="mt-4 text-2xl font-semibold text-blue-600">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="mt-6 text-sm leading-relaxed text-neutral-700">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-1">
              <button
                type="button"
                onClick={() => updateQty(product.id, qtyInCart - 1)}
                disabled={qtyInCart === 0}
                aria-label="Decrease quantity"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Minus size={18} className='cursor-pointer' />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold text-neutral-900">
                {qtyInCart}
              </span>
              <button
                type="button"
                onClick={() =>
                  qtyInCart === 0 ? addItem(product, 1) : updateQty(product.id, qtyInCart + 1)
                }
                aria-label="Increase quantity"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 transition hover:bg-neutral-100"
              >
                <Plus size={18} className='cursor-pointer' />
              </button>

            </div>
          </div>
          <div className='mt-4 ml-2  cursor-pointer'>
            <button
              type="button" className='cursor-pointer'>
              Go To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
