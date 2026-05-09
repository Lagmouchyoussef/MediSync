// API service for communicating with Django backend
const API_BASE_URL = 'http://localhost:8001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async resetPassword(email) {
    try {
      // Simulate API call for password reset
      console.log(`Password reset requested for: ${email}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Un email de réinitialisation a été envoyé.' });
        }, 1000);
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health/`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  getUserRole() {
    return localStorage.getItem('userRole');
  }

  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

export default new ApiService();