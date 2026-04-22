import { useMemo } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import { Calendar, MapPin, Package } from 'lucide-react'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return String(iso)
  }
}

const AccountOrdersPage = () => {
  const { orders } = useCart()

  const sortedOrders = useMemo(() => [...orders].sort((a, b) => (b.placedAt ?? '').localeCompare(a.placedAt ?? '')), [orders])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">My Orders</h2>
        <p className="mt-1 text-sm text-neutral-600">Your recent purchases placed from the cart.</p>
      </div>


      {sortedOrders.length === 0 ? (

        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <Package className="mx-auto mb-3 text-neutral-400" size={26} />
          <p className="text-sm font-medium text-neutral-700">No orders yet.</p>
          <p className="mt-1 text-xs text-neutral-500">Place an order to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedOrders.map((o) => {
            const firstItem = o.items?.[0]
            return (
              <div
                key={o.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{o.id}</p>
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Placed
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                      {firstItem
                        ? `${firstItem.name}${o.items.length > 1 ? ` + ${o.items.length - 1} more` : ''}`
                        : 'Order items'}
                    </p>
                  </div>

                  <div className="flex flex-col items-start sm:items-end">
                    <p className="text-sm text-neutral-500">Total</p>
                    <p className="text-lg font-bold text-neutral-900">₹{Number(o.total).toLocaleString('en-IN')}</p>
                  </div>
                </div>


                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Calendar size={16} className="text-neutral-400" />
                    <span>{formatDate(o.placedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <MapPin size={16} className="text-neutral-400" />
                    <span className="line-clamp-1">{o.address}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AccountOrdersPage

