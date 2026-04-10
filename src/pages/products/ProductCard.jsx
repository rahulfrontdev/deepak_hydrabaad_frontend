import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-neutral-500">
          {product.brand}
        </p>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-neutral-900">{product.name}</h3>
        <p className="mt-auto text-base font-semibold text-blue-600">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </Link>
  )
}

export default ProductCard
