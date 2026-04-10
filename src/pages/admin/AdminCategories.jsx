import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminCreateCategory, adminDeleteCategory, adminFetchCategories, adminUpdateCategory } from '../../api/adminApi'
import { Loader2, Pencil, Trash2 } from 'lucide-react'

const emptyMainForm = { name: '', slug: '', description: '' }
const emptySubForm = { parentId: '', name: '', slug: '', description: '' }

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

const AdminCategories = () => {
  const [activeTab, setActiveTab] = useState('main')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mainForm, setMainForm] = useState(emptyMainForm)
  const [subForm, setSubForm] = useState(emptySubForm)
  const [savingMain, setSavingMain] = useState(false)
  const [savingSub, setSavingSub] = useState(false)
  const [editingMainId, setEditingMainId] = useState(null)
  const [editingSubId, setEditingSubId] = useState(null)
  /** Filter subcategory list by parent (empty = show all) */
  const [subFilterParentId, setSubFilterParentId] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      setLoading(true)
      const { data } = await adminFetchCategories()
      setList(normalizeList(data))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const rootCategories = useMemo(() => list.filter(isRootCategory), [list])

  const allSubcategories = useMemo(() => list.filter((c) => !isRootCategory(c)), [list])

  const filteredSubcategories = useMemo(() => {
    if (!subFilterParentId) return allSubcategories
    return allSubcategories.filter((c) => getParentId(c) === String(subFilterParentId))
  }, [allSubcategories, subFilterParentId])

  const parentNameById = useMemo(() => {
    const m = new Map()
    for (const c of list) {
      m.set(getCategoryId(c), c.name ?? '')
    }
    return m
  }, [list])

  const onSubmitMain = async (e) => {
    e.preventDefault()
    if (!mainForm.name.trim()) return
    setSavingMain(true)
    setError('')
    try {
      const body = {
        name: mainForm.name.trim(),
        slug: mainForm.slug.trim() || undefined,
        description: mainForm.description.trim() || undefined,
      }
      if (editingMainId) {
        await adminUpdateCategory(editingMainId, body)
      } else {
        await adminCreateCategory(body)
      }
      setMainForm(emptyMainForm)
      setEditingMainId(null)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Save failed.')
    } finally {
      setSavingMain(false)
    }
  }

  const onSubmitSub = async (e) => {
    e.preventDefault()
    if (!subForm.parentId || !subForm.name.trim()) return
    setSavingSub(true)
    setError('')
    try {
      const body = {
        name: subForm.name.trim(),
        slug: subForm.slug.trim() || undefined,
        description: subForm.description.trim() || undefined,
        parentId: subForm.parentId,
      }
      if (editingSubId) {
        await adminUpdateCategory(editingSubId, body)
      } else {
        await adminCreateCategory(body)
      }
      setSubForm(emptySubForm)
      setEditingSubId(null)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Subcategory save failed.')
    } finally {
      setSavingSub(false)
    }
  }

  const onEditMain = (cat) => {
    setEditingMainId(getCategoryId(cat))
    setMainForm({
      name: cat.name ?? '',
      slug: cat.slug ?? '',
      description: cat.description ?? '',
    })
  }

  const onEditSub = (cat) => {
    setEditingSubId(getCategoryId(cat))
    setSubForm({
      parentId: getParentId(cat) ?? '',
      name: cat.name ?? '',
      slug: cat.slug ?? '',
      description: cat.description ?? '',
    })
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this category? Child subcategories may need to be removed first.')) return
    try {
      await adminDeleteCategory(id)
      if (String(id) === String(editingMainId)) {
        setEditingMainId(null)
        setMainForm(emptyMainForm)
      }
      if (String(id) === String(editingSubId)) {
        setEditingSubId(null)
        setSubForm(emptySubForm)
      }
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Delete failed.')
    }
  }

  const tabBtn = (id, label) => (
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => {
        setActiveTab(id)
        setError('')
      }}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
        activeTab === id
          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
      <p className="mt-1 text-sm text-slate-600">
        Use <strong>Categories</strong> for top-level groups and <strong>Subcategories</strong> for items under a parent.
        API uses optional <code className="rounded bg-slate-100 px-1 text-xs">parentId</code>.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 rounded-xl bg-slate-200/60 p-1.5" role="tablist" aria-label="Category type">
        {tabBtn('main', 'Categories')}
        {tabBtn('sub', 'Subcategories')}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      {activeTab === 'main' && (
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Main categories</h2>
              <p className="mt-0.5 text-xs text-slate-500">Top-level only (no parent).</p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-500">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-white text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Slug</th>
                    <th className="w-28 px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rootCategories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                        No categories yet. Add one using the form.
                      </td>
                    </tr>
                  ) : (
                    rootCategories.map((cat) => {
                      const id = getCategoryId(cat)
                      return (
                        <tr key={id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3 font-medium text-slate-900">{cat.name}</td>
                          <td className="px-4 py-3 text-slate-600">{cat.slug ?? '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => onEditMain(cat)}
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
            <h2 className="text-sm font-semibold text-slate-900">
              {editingMainId ? 'Edit category' : 'New category'}
            </h2>
            <form onSubmit={onSubmitMain} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Name *</label>
                <input
                  value={mainForm.name}
                  onChange={(e) => setMainForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Electronics"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Slug</label>
                <input
                  value={mainForm.slug}
                  onChange={(e) => setMainForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Description</label>
                <textarea
                  value={mainForm.description}
                  onChange={(e) => setMainForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingMain}
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {savingMain ? 'Saving…' : editingMainId ? 'Update' : 'Create'}
                </button>
                {editingMainId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMainId(null)
                      setMainForm(emptyMainForm)
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
      )}

      {activeTab === 'sub' && (
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Subcategories</h2>
                <p className="mt-0.5 text-xs text-slate-500">Must belong to a main category.</p>
              </div>
              <div className="min-w-[200px]">
                <label htmlFor="sub-filter" className="mb-1 block text-xs font-medium text-slate-600">
                  Filter by parent
                </label>
                <select
                  id="sub-filter"
                  value={subFilterParentId}
                  onChange={(e) => setSubFilterParentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All parents</option>
                  {rootCategories.map((c) => {
                    const id = getCategoryId(c)
                    return (
                      <option key={id} value={id}>
                        {c.name}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-500">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : rootCategories.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                Create at least one main category in the <strong>Categories</strong> tab first.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-white text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Parent</th>
                    <th className="px-4 py-3 font-semibold">Slug</th>
                    <th className="w-28 px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubcategories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                        No subcategories yet. Add one using the form.
                      </td>
                    </tr>
                  ) : (
                    filteredSubcategories.map((cat) => {
                      const id = getCategoryId(cat)
                      const pid = getParentId(cat)
                      return (
                        <tr key={id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3 font-medium text-slate-900">{cat.name}</td>
                          <td className="px-4 py-3 text-slate-600">{parentNameById.get(pid) ?? '—'}</td>
                          <td className="px-4 py-3 text-slate-600">{cat.slug ?? '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => onEditSub(cat)}
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
            <h2 className="text-sm font-semibold text-slate-900">
              {editingSubId ? 'Edit subcategory' : 'New subcategory'}
            </h2>
            <form onSubmit={onSubmitSub} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Parent category *</label>
                <select
                  required
                  value={subForm.parentId}
                  onChange={(e) => setSubForm((f) => ({ ...f, parentId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={rootCategories.length === 0}
                >
                  <option value="">Select main category</option>
                  {rootCategories.map((c) => {
                    const id = getCategoryId(c)
                    return (
                      <option key={id} value={id}>
                        {c.name}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Name *</label>
                <input
                  value={subForm.name}
                  onChange={(e) => setSubForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Smartphones"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Slug</label>
                <input
                  value={subForm.slug}
                  onChange={(e) => setSubForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Description</label>
                <textarea
                  value={subForm.description}
                  onChange={(e) => setSubForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingSub || !subForm.parentId || !subForm.name.trim()}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingSub ? 'Saving…' : editingSubId ? 'Update' : 'Create'}
                </button>
                {editingSubId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubId(null)
                      setSubForm(emptySubForm)
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
      )}
    </div>
  )
}

export default AdminCategories
