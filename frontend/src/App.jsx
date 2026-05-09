import { useState, useEffect } from 'react'
import axios from 'axios'
import logo from './assets/logo.png'
import './App.css'

function App() {
  const [message, setMessage] = useState('Connecting to MediSync Backend...')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    // Fetch data from Django backend
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
    <div className="App">
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
      <div className="bg-animation"></div>
    </div>
  )
}

export default App
