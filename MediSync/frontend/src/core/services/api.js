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
        localStorage.setItem('userFirstName', data.user.first_name || '');
        localStorage.setItem('userLastName', data.user.last_name || '');
        if (data.user.password_last_changed) {
          localStorage.setItem('passwordLastChanged', data.user.password_last_changed);
        }
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

  async fetchCurrentUser() {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${this.baseURL}/current-user/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch current user');
      }

      if (data.user) {
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userFirstName', data.user.first_name || '');
        localStorage.setItem('userLastName', data.user.last_name || '');
        if (data.user.password_last_changed) {
          localStorage.setItem('passwordLastChanged', data.user.password_last_changed);
        }
      }

      return data.user;
    } catch (error) {
      console.error('Fetch current user error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('passwordLastChanged');
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

  getUserFirstName() {
    return localStorage.getItem('userFirstName') || '';
  }

  getUserLastName() {
    return localStorage.getItem('userLastName') || '';
  }

  getPasswordLastChanged() {
    return localStorage.getItem('passwordLastChanged');
  }

  getUserFullName() {
    const firstName = this.getUserFirstName();
    const lastName = this.getUserLastName();
    return `${firstName}${firstName && lastName ? ' ' : ''}${lastName}`.trim();
  }

  getUserDisplayName() {
    const fullName = this.getUserFullName();
    if (fullName) return fullName;
    const email = this.getUserEmail();
    return email ? email.split('@')[0] : '';
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // --- Patients ---
  async fetchPatients() {
    return this._authorizedRequest('/patients/');
  }

  async createPatient(patientData) {
    return this._authorizedRequest('/patients/', 'POST', patientData);
  }

  async updatePatient(id, patientData) {
    return this._authorizedRequest(`/patients/${id}/`, 'PUT', patientData);
  }

  async deletePatient(id) {
    return this._authorizedRequest(`/patients/${id}/`, 'DELETE');
  }

  // --- Appointments ---
  async fetchAppointments() {
    return this._authorizedRequest('/appointments/');
  }

  async createAppointment(data) {
    return this._authorizedRequest('/appointments/', 'POST', data);
  }

  // --- Stats ---
  async fetchStats() {
    return this._authorizedRequest('/stats/');
  }

  // --- Activities ---
  async fetchActivities() {
    return this._authorizedRequest('/activities/');
  }

  async createActivity(action, details = "", type = "info") {
    return this._authorizedRequest('/activities/', 'POST', { action, details, type });
  }

  async deleteActivity(id) {
    return this._authorizedRequest(`/activities/${id}/`, 'DELETE');
  }

  // --- Helper for authorized requests ---
  async _authorizedRequest(endpoint, method = 'GET', body = null) {
    const token = this.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${this.baseURL}${endpoint}`, options);
    
    if (response.status === 204) return true;
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  }
}

export default new ApiService();