'use client'

import { useState } from 'react'

import { signIn } from 'next-auth/react'

import { useRouter } from 'next/navigation'

export default function Login() {

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    const result = await signIn('credentials', {

      email,

      password,

      redirect: false

    })

    if (result?.error) {

      setError('Invalid credentials')

    } else {

      router.push('/admin')

    }

  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">

        <h1 className="text-2xl mb-4 text-center">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">

          <label className="block text-sm font-medium mb-2">Email</label>

          <input

            type="email"

            value={email}

            onChange={(e) => setEmail(e.target.value)}

            className="border border-gray-300 p-2 w-full rounded"

            required

          />

        </div>

        <div className="mb-4">

          <label className="block text-sm font-medium mb-2">Password</label>

          <input

            type="password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            className="border border-gray-300 p-2 w-full rounded"

            required

          />

        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600">Login</button>

      </form>

    </div>

  )

}
