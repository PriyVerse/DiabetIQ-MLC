import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Predict from './pages/Predict'
import Visualize from './pages/Visualize'
import DataInfo from './pages/DataInfo'

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar />
      <main style={{ flex: 1, width: '100%' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/visualize" element={<Visualize />} />
          <Route path="/data" element={<DataInfo />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
