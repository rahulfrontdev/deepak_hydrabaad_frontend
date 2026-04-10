import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminFetchCategories,
  adminFetchProducts,
  adminUpdateProduct,
} from '../../api/adminApi'
import { Loader2, Pencil, Trash2 } from 'lucide-react'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  brand: '',
  category: '',
  mainCategoryId: '',
  subcategoryId: '',
  image: '',
}

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload
  if (payload?.data && Array.isArray(payload.data)) return payload.data
  return []
}

function getCategoryId(cat) {
  return cat ? String(cat._id ?? cat.id ?? '') : ''
}

function getParentId(cat) {
  if (!cat) return null
  const raw = cat.parentId ?? cat.parent?._id ?? cat.parent ?? cat.parentCategory
  if (raw == null || raw === '') return null
  return String(raw)
}

function isRootCategory(cat) {
  return !getParentId(cat)
}

/** Display name for product row: parent › sub or single name */
function categoryDisplayName(p, categories) {
  const populated = p.category
  if (populated?.name && populated?.parent?.name) {
    return `${populated.parent.name} › ${populated.name}`
  }
  if (populated?.name) return populated.name
  const cid = p.categoryId ?? p.category?._id
  if (!cid || !categories.length) return p.category ?? '—'
  const cat = categories.find((c) => getCategoryId(c) === String(cid))
  if (!cat) return p.category ?? '—'
  const pid = getParentId(cat)
  if (!pid) return cat.name
  const parent = categories.find((c) => getCategoryId(c) === pid)
  return parent ? `${parent.name} › ${cat.name}` : cat.name
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const rootCategories = useMemo(() => categories.filter(isRootCategory), [categories])

  const subcategoriesForMain = useMemo(() => {
    if (!form.mainCategoryId) return []
    return categories.filter((c) => getParentId(c) === String(form.mainCategoryId))
  }, [categories, form.mainCategoryId])

  const load = useCallback(async () => {
    setError('')
    try {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([adminFetchProducts(), adminFetchCategories()])
      setProducts(normalizeList(prodRes.data))
      setCategories(normalizeList(catRes.data))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return
    if (!form.mainCategoryId) {
      setError('Select a main category.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const price = Number(form.price)
      if (Number.isNaN(price) || price < 0) throw new Error('Invalid price')

      // Leaf category: prefer subcategory when chosen, else main category
      const leafCategoryId = form.subcategoryId || form.mainCategoryId
      const leaf = categories.find((c) => getCategoryId(c) === String(leafCategoryId))

      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        brand: form.brand.trim(),
        image: form.image.trim(),
        categoryId: leafCategoryId,
      }
      if (form.category.trim()) body.category = form.category.trim()
      else if (leaf?.name) body.category = leaf.name

      if (editingId) {
        await adminUpdateProduct(editingId, body)
      } else {
        await adminCreateProduct(body)
      }
      setForm(emptyForm)
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const onEdit = (p) => {
    const id = p._id ?? p.id
    const cid = String(p.categoryId ?? p.category?._id ?? '')
    const cat = categories.find((c) => getCategoryId(c) === cid)
    const pid = cat ? getParentId(cat) : null

    let mainCategoryId = ''
    let subcategoryId = ''
    if (cid && cat) {
      if (pid) {
        mainCategoryId = pid
        subcategoryId = cid
      } else {
        mainCategoryId = cid
      }
    }

    setEditingId(id)
    setForm({
      name: p.name ?? '',
      description: p.description ?? '',
      price: String(p.price ?? ''),
      brand: p.brand ?? '',
      category: typeof p.category === 'string' ? p.category : '',
      mainCategoryId,
      subcategoryId,
      image: p.image ?? '',
    })
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await adminDeleteProduct(id)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Delete failed.')
    }
  }

  const setMainCategory = (mainCategoryId) => {
    setForm((f) => ({ ...f, mainCategoryId, subcategoryId: '' }))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Products</h1>
      <p className="mt-1 text-sm text-slate-600">
        Choose a <strong>main category</strong> and optionally a <strong>subcategory</strong>. The product is linked to
        the most specific category selected.
      </p>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_400px]">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="w-28 px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No products yet.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const id = p._id ?? p.id
                    return (
                      <tr key={id} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                        <td className="px-4 py-3">₹{Number(p.price).toLocaleString('en-IN')}</td>
                        <td className="max-w-[240px] truncate px-4 py-3 text-slate-600" title={categoryDisplayName(p, categories)}>
                          {categoryDisplayName(p, categories)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => onEdit(p)}
                            className="mr-1 inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                            aria-label="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(id)}
                            className="inline-flex rounded-lg p-2 text-red-600 hover:bg-red-50"
                            aria-label="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">{editingId ? 'Edit product' : 'New product'}</h2>
          <form onSubmit={onSubmit} className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Price *</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Main category *</label>
              <select
                required
                value={form.mainCategoryId}
                onChange={(e) => setMainCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select main category</option>
                {rootCategories.map((c) => {
                  const cid = getCategoryId(c)
                  return (
                    <option key={cid} value={cid}>
                      {c.name}
                    </option>
                  )
                })}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Subcategory</label>
              <select
                value={form.subcategoryId}
                onChange={(e) => setForm((f) => ({ ...f, subcategoryId: e.target.value }))}
                disabled={!form.mainCategoryId || subcategoriesForMain.length === 0}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {!form.mainCategoryId
                    ? 'Select a main category first'
                    : subcategoriesForMain.length === 0
                      ? 'No subcategories — product uses main category'
                      : 'Optional — pick a subcategory'}
                </option>
                {subcategoriesForMain.map((c) => {
                  const sid = getCategoryId(c)
                  return (
                    <option key={sid} value={sid}>
                      {c.name}
                    </option>
                  )
                })}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                If you pick a subcategory, the product is stored under that category. Otherwise it uses the main category
                only.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Category label (optional)</label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Override display string if your API needs it"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Brand</label>
              <input
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setForm(emptyForm)
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts
