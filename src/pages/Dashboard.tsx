export default function Dashboard() {
  const configured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  const { user, signOut } = useAuth()

  const [metaHeart, setMetaHeart] = useState<string>('')

      {user && (
        <div className="text-sm text-gray-700">Ingelogd als: <span className="font-medium">{user.email}</span></div>
      )}
      {import.meta.env.DEV && (
        <div className={`rounded border px-3 py-2 text-sm ${configured ? 'border-green-300 bg-green-50 text-green-800' : 'border-yellow-300 bg-yellow-50 text-yellow-800'}`}>
          Supabase config: {configured ? 'gevonden' : 'niet gevonden'}
        </div>
      )}
}