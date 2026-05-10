// API Service - v1.0.3 - Standardized Paths
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL.replace(/\/$/, '');
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

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userFirstName', data.user.first_name || '');
        localStorage.setItem('userLastName', data.user.last_name || '');
        if (data.user.password_last_changed) {
          localStorage.setItem('passwordLastChanged', data.user.password_last_changed);
        }
        if (data.user.image) {
          localStorage.setItem('userImage', data.user.image);
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
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async resetPassword(email) {
    try {
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
      return await response.json();
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
      if (!response.ok) throw new Error(data.error || 'Failed to fetch current user');

      if (data.user) {
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userFirstName', data.user.first_name || '');
        localStorage.setItem('userLastName', data.user.last_name || '');
        if (data.user.password_last_changed) {
          localStorage.setItem('passwordLastChanged', data.user.password_last_changed);
        }
        if (data.user.image) {
          localStorage.setItem('userImage', data.user.image);
        } else {
          localStorage.removeItem('userImage');
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
    localStorage.removeItem('userImage');
  }

  getAuthToken() { return localStorage.getItem('authToken'); }
  getUserRole() { return localStorage.getItem('userRole'); }
  getUserEmail() { return localStorage.getItem('userEmail'); }
  getUserFirstName() { return localStorage.getItem('userFirstName') || ''; }
  getUserLastName() { return localStorage.getItem('userLastName') || ''; }
  getPasswordLastChanged() { return localStorage.getItem('passwordLastChanged'); }
  getUserImage() { return localStorage.getItem('userImage'); }
  setUserImage(url) {
    if (url) localStorage.setItem('userImage', url);
    else localStorage.removeItem('userImage');
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

  isAuthenticated() { return !!this.getAuthToken(); }

  // --- Doctor Routes ---
  async changePassword(current_password, new_password) {
    return this._authorizedRequest('/doctor/change-password/', 'POST', { current_password, new_password });
  }

  async deleteAccount() {
    return this._authorizedRequest('/doctor/delete-account/', 'DELETE');
  }

  async fetchProfile() {
    return this._authorizedRequest('/doctor/profile/');
  }

  async fetchAnalytics() {
    return this._authorizedRequest('/doctor/analytics/');
  }

  async updateProfile(formData) {
    return this._authorizedRequest('/doctor/profile/', 'PUT', formData);
  }

  async deleteProfileImage() {
    return this._authorizedRequest('/doctor/profile/', 'DELETE');
  }

  async fetchPatients() {
    return this._authorizedRequest('/doctor/patients/');
  }

  async createPatient(patientData) {
    return this._authorizedRequest('/doctor/patients/', 'POST', patientData);
  }

  async updatePatient(id, patientData) {
    return this._authorizedRequest(`/doctor/patients/${id}/`, 'PUT', patientData);
  }

  async deletePatient(id) {
    return this._authorizedRequest(`/doctor/patients/${id}/`, 'DELETE');
  }

  async fetchAppointments() {
    return this._authorizedRequest('/doctor/appointments/');
  }

  async createAppointment(data) {
    return this._authorizedRequest('/doctor/appointments/', 'POST', data);
  }

  async deleteAppointment(id) {
    return this._authorizedRequest(`/doctor/appointments/${id}/`, 'DELETE');
  }

  async fetchAvailabilities() {
    return this._authorizedRequest('/doctor/availabilities/');
  }

  async updateAvailability(id, data) {
    return this._authorizedRequest(`/doctor/availabilities/${id}/`, 'PUT', data);
  }

  async createAvailability(data) {
    return this._authorizedRequest('/doctor/availabilities/', 'POST', data);
  }

  async fetchStats() {
    return this._authorizedRequest('/stats/');
  }

  async fetchActivities() {
    return this._authorizedRequest('/doctor/activities/');
  }

  async createActivity(action, details = "", type = "info") {
    return this._authorizedRequest('/doctor/activities/', 'POST', { action, details, type });
  }

  async deleteActivity(id) {
    return this._authorizedRequest(`/doctor/activities/${id}/`, 'DELETE');
  }

  // --- Helper for authorized requests ---
  async _authorizedRequest(endpoint, method = 'GET', body = null) {
    const token = this.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const headers = {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
    };
    const options = { method, headers };

    if (body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, options);
    
    if (response.status === 204) return true;
    
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
      return data;
    } else {
      const text = await response.text();
      if (!response.ok) throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}...`);
      return text;
    }
  }
}

export default new ApiService();