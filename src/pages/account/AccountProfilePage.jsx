import { useMemo, useState } from 'react'

const STORAGE_KEY = 'account_profile_v1'

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { fullName: '', email: '', phone: '' }
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object'
      ? { fullName: parsed.fullName ?? '', email: parsed.email ?? '', phone: parsed.phone ?? '' }
      : { fullName: '', email: '', phone: '' }
  } catch {
    return { fullName: '', email: '', phone: '' }
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // ignore
  }
}

const AccountProfilePage = () => {
  const [profile, setProfile] = useState(() => loadProfile())
  const [savedAt, setSavedAt] = useState(null)

  const canSave = useMemo(() => {
    const nameOk = profile.fullName.trim().length >= 2
    const emailOk = profile.email.trim().includes('@')
    return nameOk && emailOk
  }, [profile.email, profile.fullName])

  const onSave = () => {
    if (!canSave) return
    saveProfile(profile)
    setSavedAt(new Date().toISOString())
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Profile</h2>
        <p className="mt-1 text-sm text-neutral-600">Update your basic details.</p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              value={profile.fullName}
              onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="phone">
              Phone (optional)
            </label>
            <input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="+91 xxxx xxxx"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save profile
          </button>
          {savedAt && (
            <p className="text-xs text-neutral-500">
              Saved on {new Date(savedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountProfilePage

