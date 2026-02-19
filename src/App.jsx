import { useState } from 'react'
import Sidebar from './components/Sidebar'
import DashBoard from './components/DashBoard'
import Scanning from './components/Scanning'
import RegisterCow from './components/RegisterCow'
import History from './components/History'
import Profile from './components/Profile'
import Settings from './components/Settings'
import Footer from './components/Footer'
import { Menu, Activity } from 'lucide-react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [herd, setHerd] = useState([
    { id: 'C-001', name: 'Gir Cow #102', breed: 'Gir', date: '2024-02-15', status: 'Healthy', weight: '420kg', confidence: '98%', age: 4, rfid: 'TAG-12345' },
    { id: 'C-002', name: 'Kankrej #44', breed: 'Kankrej', date: '2024-02-14', status: 'Sick / Alert', weight: '510kg', confidence: '94%', age: 6, rfid: 'TAG-99887' },
  ])

  const addToHerd = (animal) => {
    const newAnimal = {
      ...animal,
      id: `C-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0]
    }
    setHerd(prev => [newAnimal, ...prev])
  }

  const removeFromHerd = (id) => {
    setHerd(prev => prev.filter(c => c.id !== id))
  }

  const goBack = () => setActiveSection('dashboard')

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashBoard setActiveSection={setActiveSection} herd={herd} />
      case 'scanning':
        return <Scanning addToHerd={addToHerd} onBack={goBack} mode="breed" />
      case 'register':
        return <RegisterCow addToHerd={addToHerd} onBack={goBack} />
      case 'history':
        return <History herd={herd} removeFromHerd={removeFromHerd} onBack={goBack} />
      case 'weight':
        return <Scanning addToHerd={addToHerd} onBack={goBack} mode="weight" />
      case 'diseases':
        return <Scanning addToHerd={addToHerd} onBack={goBack} mode="disease" />
      case 'profile':
        return <Profile onBack={goBack} />
      case 'settings':
        return <Settings onBack={goBack} />
      default:
        return <DashBoard setActiveSection={setActiveSection} herd={herd} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="main-container">
        <header className="mobile-header">
          <div className="logo-section-sidebar" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon-wrapper" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: '10px' }}>
              <Activity size={20} />
            </div>
            <h1 className="logo-text-sidebar" style={{ fontSize: '1.25rem' }}>SmartCattle</h1>
          </div>
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        <main className="main-content container">
          {renderSection()}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
