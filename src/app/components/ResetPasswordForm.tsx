"use client"

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if we have a session (user clicked the reset link)
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (!session) {
        router.push('/login')
      }
    })
  }, [router, supabase])

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setMessage('Password updated successfully!')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Set New Password</h1>
          <p className="text-text-secondary">Create a strong new password for your account</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}