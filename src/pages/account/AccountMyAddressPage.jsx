import { useMemo, useState } from 'react'
import { MapPin, Plus } from 'lucide-react'

const STORAGE_KEY = 'account_addresses_v1'

function loadAddresses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveAddresses(addresses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses))
  } catch {
    // ignore
  }
}

function emptyAddress() {
  return {
    id: `addr_${Date.now()}`,
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  }
}

const AccountMyAddressPage = () => {
  const [addresses, setAddresses] = useState(() => loadAddresses())
  const [form, setForm] = useState(() => emptyAddress())

  const hasDefault = useMemo(() => addresses.some((a) => a.isDefault), [addresses])

  const canAdd = useMemo(() => {
    return form.fullName.trim().length >= 2 && form.phone.trim().length >= 8 && form.line1.trim().length >= 5
  }, [form.fullName, form.phone, form.line1])

  const onAdd = () => {
    if (!canAdd) return
    const next = [
      ...addresses,
      {
        ...form,
        isDefault: !hasDefault,
      },
    ]
    setAddresses(next)
    saveAddresses(next)
    setForm(emptyAddress())
  }

  const setDefault = (id) => {
    const next = addresses.map((a) => ({ ...a, isDefault: String(a.id) === String(id) }))
    setAddresses(next)
    saveAddresses(next)
  }

  const onRemove = (id) => {
    const next = addresses.filter((a) => String(a.id) !== String(id))
    const normalized = next.map((a) => ({ ...a }))
    // If removing default and none exists, set first as default.
    if (normalized.length > 0 && !normalized.some((a) => a.isDefault)) {
      normalized[0].isDefault = true
    }
    setAddresses(normalized)
    saveAddresses(normalized)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">My Address</h2>
        <p className="mt-1 text-sm text-neutral-600">Add delivery locations for faster checkout.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="space-y-3">
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
              <MapPin className="mx-auto mb-3 text-neutral-400" size={26} />
              <p className="text-sm font-medium text-neutral-700">No addresses added.</p>
              <p className="mt-1 text-xs text-neutral-500">Add one on the right.</p>
            </div>
          ) : (
            addresses.map((a) => (
              <div key={a.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{a.fullName}</p>
                      {a.isDefault && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ''}
                      {a.city ? `, ${a.city}` : ''}
                      {a.state ? `, ${a.state}` : ''} {a.pincode ? a.pincode : ''}
                    </p>
                    <p className="mt-2 text-xs text-neutral-500">Phone: {a.phone}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {!a.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefault(a.id)}
                        className="rounded-xl border border-blue-600/20 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        Set default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(a.id)}
                      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-neutral-900">Add new address</h3>
            <Plus size={16} className="text-neutral-500" />
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Name"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="+91 99999 99999"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="line1">
                Address line 1
              </label>
              <input
                id="line1"
                value={form.line1}
                onChange={(e) => setForm((p) => ({ ...p, line1: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="House no, Street, Area"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="line2">
                Address line 2 (optional)
              </label>
              <input
                id="line2"
                value={form.line2}
                onChange={(e) => setForm((p) => ({ ...p, line2: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Landmark"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="state">
                  State
                </label>
                <input
                  id="state"
                  value={form.state}
                  onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="State"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="pincode">
                Pincode
              </label>
              <input
                id="pincode"
                value={form.pincode}
                onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Pincode"
              />
            </div>

            <button
              type="button"
              disabled={!canAdd}
              onClick={onAdd}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add address
            </button>

            <p className="text-xs text-neutral-500">
              First address becomes default automatically.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default AccountMyAddressPage

