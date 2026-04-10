import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'

function QtyStepper({ qty, onMinus, onPlus }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-1">
      <button
        type="button"
        onClick={onMinus}
        aria-label="Decrease quantity"
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-700 transition hover:bg-neutral-100"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-semibold text-neutral-900">{qty}</span>
      <button
        type="button"
        onClick={onPlus}
        aria-label="Increase quantity"
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-700 transition hover:bg-neutral-100"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}

const CartPage = () => {
  const { items, total, updateQty, removeItem, placeOrder } = useCart()
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState(null)

  const cartTotal = useMemo(() => total, [total])

  const handlePlaceOrder = () => {
    const res = placeOrder({ address })
    if (!res.ok) {
      setStatus({ type: 'error', message: res.message })
      return
    }
    setStatus({ type: 'success', message: `Order placed successfully. Order id: ${res.order.id}` })
    setAddress('')
  }

  return (
    <div className=" px-2 py-2">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Cart</h1>
          <p className="mt-1 text-sm text-neutral-600">Add address and place your order.</p>
        </div>
        <Link to="/products" className="text-sm font-medium text-blue-600 hover:underline">
          ← Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-6 text-center">
          <p className="text-sm font-medium text-neutral-700">Your cart is empty.</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <ul className="space-y-4">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-lg bg-neutral-100">
                      <img src={i.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{i.name}</p>
                      <p className="text-sm text-neutral-600">₹{Number(i.price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <QtyStepper
                      qty={i.qty}
                      onMinus={() => updateQty(i.id, i.qty - 1)}
                      onPlus={() => updateQty(i.id, i.qty + 1)}
                    />

                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-neutral-900">
                        ₹{(Number(i.price) * i.qty).toLocaleString('en-IN')}
                      </p>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeItem(i.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition hover:bg-neutral-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
            <h2 className="text-sm font-semibold text-neutral-900">Delivery address</h2>

            <div className="mt-3">
              <label htmlFor="address" className="mb-1 block text-xs font-medium text-neutral-700">
                Address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={5}
                placeholder="House no, Street, Area, City, Pincode"
                className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {status?.message && (
              <p
                className={`mt-3 text-sm ${status.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                role="status"
              >
                {status.message}
              </p>
            )}

            <div className="mt-5 rounded-lg bg-neutral-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-700">Total</p>
                <p className="text-sm font-semibold text-neutral-900">
                  ₹{Number(cartTotal).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={items.length === 0}
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Place order
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

export default CartPage

