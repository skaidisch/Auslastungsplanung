import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Layout/Sidebar'
import DashboardPage from './components/Dashboard/DashboardPage'
import OrderPoolPage from './components/OrderPool/OrderPoolPage'
import MasterDataPage from './components/MasterData/MasterDataPage'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />
      case 'orderPool':
        return <OrderPoolPage />
      case 'masterData':
        return <MasterDataPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <main className="ml-[250px] min-h-screen bg-white">
          {renderPage()}
        </main>
      </div>
    </AppProvider>
  )
}

export default App
