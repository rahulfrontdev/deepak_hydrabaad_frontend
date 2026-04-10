import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import { isAdminRole, useAuth } from '../context/AuthContext.jsx'

const initialForm = { email: '', password: '' }

const Login = () => {
    const [form, setForm] = useState(initialForm)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { setUser, isAdmin } = useAuth()

    // Already logged in as admin → go straight to management dashboard
    if (isAdmin) {
        return <Navigate to="/admin" replace />
    }

    const onChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.email.trim() || !form.password) {
            setError('Please enter email and password.')
            return
        }

        try {
            setSubmitting(true)
            const { data } = await axiosInstance.post('/auth/login', {
                email: form.email.trim().toLowerCase(),
                password: form.password,
            })

            if (data?.token) {
                localStorage.setItem('token', data.token)
            }

            const email = form.email.trim().toLowerCase()
            const roleFromUser = data?.user?.role
            const roleTopLevel = data?.role
            const resolvedRole = roleFromUser ?? roleTopLevel ?? 'customer'

            const nextUser = data?.user
                ? { ...data.user, role: resolvedRole }
                : { email, role: resolvedRole }

            setUser(nextUser)

            // Admins land on /admin (dashboard with Categories, Products, Users)
            if (isAdminRole(resolvedRole)) {
                navigate('/admin', { replace: true })
            } else {
                navigate('/', { replace: true })
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Login failed.'
            setError(String(msg))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
                    <p className="mt-2 text-sm text-slate-300">Sign in to view your orders and account.</p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-200">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={onChange}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-200">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={onChange}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25"
                                placeholder="Your password"
                            />
                        </div>

                        {error && (
                            <p className="text-xs font-medium text-rose-400" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-600 hover:to-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-xs text-slate-300">
                        New here?{' '}
                        <Link to="/register" className="font-semibold text-blue-300 hover:text-blue-200">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
