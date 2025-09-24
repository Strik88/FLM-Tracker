import { Link, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Metascript from './pages/Metascript'
import Scope from './pages/Scope'
import Staq from './pages/Staq'
import WeeklyReview from './pages/WeeklyReview'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MetascriptHistory from './pages/MetascriptHistory'
import MetascriptDetail from './pages/MetascriptDetail'
import ScopeHistory from './pages/ScopeHistory'
import ScopeDetail from './pages/ScopeDetail'
import WeeklyReviewHistory from './pages/WeeklyReviewHistory'
import WeeklyReviewDetail from './pages/WeeklyReviewDetail'
import BottomNav from './components/BottomNav'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <header className="bg-indigo-600 text-white">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="font-semibold">FLM Tracker</div>
              <nav className="space-x-4 text-sm hidden md:block">
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <Link to="/metascript" className="hover:underline">Metascript</Link>
                <Link to="/staq" className="hover:underline">STAQ</Link>
                <Link to="/weekly-review" className="hover:underline">Weekly Review</Link>
                <Link to="/scope" className="hover:underline">Scope</Link>
                <Link to="/login" className="hover:underline">Login</Link>
              </nav>
            </div>
          </header>

          <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full pb-20 md:pb-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/metascript" element={<ProtectedRoute><Metascript /></ProtectedRoute>} />
              <Route path="/metascript/history" element={<ProtectedRoute><MetascriptHistory /></ProtectedRoute>} />
              <Route path="/metascript/:id" element={<ProtectedRoute><MetascriptDetail /></ProtectedRoute>} />
              <Route path="/scope" element={<ProtectedRoute><Scope /></ProtectedRoute>} />
              <Route path="/scope/history" element={<ProtectedRoute><ScopeHistory /></ProtectedRoute>} />
              <Route path="/scope/:id" element={<ProtectedRoute><ScopeDetail /></ProtectedRoute>} />
              <Route path="/staq" element={<ProtectedRoute><Staq /></ProtectedRoute>} />
              <Route path="/weekly-review" element={<ProtectedRoute><WeeklyReview /></ProtectedRoute>} />
              <Route path="/weekly-review/history" element={<ProtectedRoute><WeeklyReviewHistory /></ProtectedRoute>} />
              <Route path="/weekly-review/:id" element={<ProtectedRoute><WeeklyReviewDetail /></ProtectedRoute>} />
              <Route path="*" element={<div>Pagina niet gevonden</div>} />
            </Routes>
          </main>

          <footer className="hidden md:block text-center text-xs text-gray-500 py-4">
            © {new Date().getFullYear()} FLM
          </footer>

          <BottomNav />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
