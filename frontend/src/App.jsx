import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import logo from './assets/logo.png'
import Navbar from './components/layout/Navbar'
import LoginPage from './pages/Login/LoginPage'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import PatientDashboard from './pages/Patient/PatientDashboard'
import './App.css'

function Home({ message, status }) {
  return (
    <div className="glass-container">
      <header className="App-header">
        <div className="logo-wrapper">
          <img src={logo} className="main-logo" alt="MediSync Logo" />
        </div>
        <h1>MediSync <span className="highlight">Portal</span></h1>
        
        <div className={`status-card ${status}`}>
          <div className="status-indicator"></div>
          <p className="message">{message}</p>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <span className="dot"></span>
            <span>Advanced Medical System</span>
          </div>
          <div className="feature-item">
            <span className="dot"></span>
            <span>Secure Data Protocol</span>
          </div>
        </div>
      </header>
    </div>
  )
}

function App() {
  const [message, setMessage] = useState('Connecting to MediSync Backend...')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/hello/')
      .then(response => {
        setMessage(response.data.message)
        setStatus('success')
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        setMessage('Backend Connection Offline')
        setStatus('error')
      })
  }, [])

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home message={message} status={status} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/patient" element={<PatientDashboard />} />
          </Routes>
        </main>
        <div className="bg-animation"></div>
      </div>
    </Router>
  )
}

export default App
