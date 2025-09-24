import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/dashboard', label: 'Home', icon: '🏠' },
  { to: '/metascript', label: 'Meta', icon: '📝' },
  { to: '/staq', label: 'STAQ', icon: '📊' },
  { to: '/weekly-review', label: 'Review', icon: '📅' },
  { to: '/scope', label: 'Scope', icon: '🎯' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm z-50">
      <ul className="flex justify-around items-center py-2">
        {tabs.map((t) => (
          <li key={t.to}>
            <NavLink
              to={t.to}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${isActive ? 'text-indigo-600' : 'text-gray-600'}`
              }
            >
              <span className="text-lg leading-none">{t.icon}</span>
              <span>{t.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
