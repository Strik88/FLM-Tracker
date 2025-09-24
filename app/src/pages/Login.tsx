import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (isRegister) {
      const { error } = await signUp(email, password)
      if (error) return setError(error)
    }
    const { error: signInError } = await signIn(email, password)
    if (signInError) return setError(signInError)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{isRegister ? 'Registreren' : 'Inloggen'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Wachtwoord</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-sm text-red-700">{error}</div>}
        <div className="flex items-center gap-3">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
            {isRegister ? 'Account aanmaken' : 'Inloggen'}
          </button>
          <button type="button" className="text-sm underline" onClick={() => setIsRegister((v) => !v)}>
            {isRegister ? 'Ik heb al een account' : 'Nieuw? Registreer'}
          </button>
        </div>
      </form>
    </div>
  )
}
