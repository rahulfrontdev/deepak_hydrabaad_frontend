/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'cartItems_v1'
const STORAGE_ORDERS_KEY = 'orders_v1'

function loadCartItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartItems)
  const [orders, setOrders] = useState(loadOrders)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore write errors (e.g. storage disabled)
    }
  }, [items])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders))
    } catch {
      // ignore write errors
    }
  }, [orders])

  const cartCount = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items])
  const total = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.price) || 0) * i.qty, 0),
    [items]
  )

  const getItem = (id) => items.find((i) => String(i.id) === String(id)) ?? null

  const addItem = (product, qty = 1) => {
    if (!product?.id) return
    const addQty = Math.max(1, Number(qty) || 1)

    setItems((prev) => {
      const existing = prev.find((i) => String(i.id) === String(product.id))
      if (existing) {
        return prev.map((i) =>
          String(i.id) === String(product.id) ? { ...i, qty: i.qty + addQty } : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: addQty,
        },
      ]
    })
  }

  const updateQty = (productId, qty) => {
    const nextQty = Number(qty)
    setItems((prev) => {
      if (Number.isNaN(nextQty) || nextQty <= 0) {
        return prev.filter((i) => String(i.id) !== String(productId))
      }
      return prev.map((i) => (String(i.id) === String(productId) ? { ...i, qty: nextQty } : i))
    })
  }

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => String(i.id) !== String(productId)))
  }

  const clearCart = () => setItems([])

  const placeOrder = ({ address }) => {
    const addr = String(address ?? '').trim()
    if (!addr) return { ok: false, message: 'Please enter address.' }
    if (items.length === 0) return { ok: false, message: 'Cart is empty.' }

    // Mock order placement.
    const order = {
      id: `order_${Date.now()}`,
      items,
      total,
      address: addr,
      placedAt: new Date().toISOString(),
    }

    setOrders((prev) => [order, ...prev])
    clearCart()
    return { ok: true, order }
  }

  const value = {
    items,
    cartCount,
    total,
    orders,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    getItem,
    placeOrder,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

