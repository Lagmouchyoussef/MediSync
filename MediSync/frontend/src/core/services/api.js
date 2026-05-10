// API Service - v1.0.3 - Standardized Paths
// In development, use the Vite proxy at /api. In production, override with VITE_API_BASE_URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL.replace(/\/$/, '');
  }

  /**
   * Safely parse JSON response, handling empty or malformed responses
   */
  async safeParseResponse(response) {
    const responseText = await response.text();
    
    if (!responseText) {
      console.error('Empty response from server:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      throw new Error(`Server error: ${response.status} ${response.statusText} - Empty response body`);
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response text:', responseText.substring(0, 200));
      throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
    }
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

      const data = await this.safeParseResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.token) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('userRole', data.user.role);
        sessionStorage.setItem('userEmail', data.user.email);
        sessionStorage.setItem('userFirstName', data.user.first_name || '');
        sessionStorage.setItem('userLastName', data.user.last_name || '');
        if (data.user.password_last_changed) {
          sessionStorage.setItem('passwordLastChanged', data.user.password_last_changed);
        }
        if (data.user.image) {
          sessionStorage.setItem('userImage', data.user.image);
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

      const data = await this.safeParseResponse(response);
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      if (data.token) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('userRole', data.user.role);
        sessionStorage.setItem('userEmail', data.user.email);
        sessionStorage.setItem('userFirstName', data.user.first_name || '');
        sessionStorage.setItem('userLastName', data.user.last_name || '');
        if (data.user.image) {
          sessionStorage.setItem('userImage', data.user.image);
        }
      }

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
      return await this.safeParseResponse(response);
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
        sessionStorage.setItem('userRole', data.user.role);
        sessionStorage.setItem('userEmail', data.user.email);
        sessionStorage.setItem('userFirstName', data.user.first_name || '');
        sessionStorage.setItem('userLastName', data.user.last_name || '');
        if (data.user.password_last_changed) {
          sessionStorage.setItem('passwordLastChanged', data.user.password_last_changed);
        }
        if (data.user.image) {
          sessionStorage.setItem('userImage', data.user.image);
        } else {
          sessionStorage.removeItem('userImage');
        }
      }

      return data.user;
    } catch (error) {
      console.error('Fetch current user error:', error);
      throw error;
    }
  }

  logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userFirstName');
    sessionStorage.removeItem('userLastName');
    sessionStorage.removeItem('passwordLastChanged');
    sessionStorage.removeItem('userImage');
  }

  getAuthToken() { return sessionStorage.getItem('authToken'); }
  getUserRole() { return sessionStorage.getItem('userRole'); }
  getUserEmail() { return sessionStorage.getItem('userEmail'); }
  getUserFirstName() { return sessionStorage.getItem('userFirstName') || ''; }
  getUserLastName() { return sessionStorage.getItem('userLastName') || ''; }
  getPasswordLastChanged() { return sessionStorage.getItem('passwordLastChanged'); }
  getUserImage() { return sessionStorage.getItem('userImage'); }
  setUserImage(url) {
    if (url) sessionStorage.setItem('userImage', url);
    else sessionStorage.removeItem('userImage');
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

  // --- Profile & Auth Routes ---
  async changePassword(current_password, new_password) {
    return this._authorizedRequest('/change-password/', 'POST', { current_password, new_password });
  }

  async deleteAccount() {
    return this._authorizedRequest('/delete-account/', 'DELETE');
  }

  async fetchProfile() {
    return this._authorizedRequest('/profile/');
  }

  async updateProfile(formData) {
    return this._authorizedRequest('/profile/', 'PUT', formData);
  }

  async deleteProfileImage() {
    return this._authorizedRequest('/profile/', 'DELETE');
  }

  async fetchAnalytics() {
    return this._authorizedRequest('/doctor/analytics/');
  }

  // --- Doctor Routes ---
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

  async fetchDoctors() {
    return this._authorizedRequest('/patient/doctors/');
  }

  async updateAppointmentStatus(id, status) {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/appointments/${id}/`, 'PATCH', { status });
  }

  async deleteAppointment(id) {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/appointments/${id}/`, 'DELETE');
  }

  async fetchAppointments() {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/appointments/`);
  }

  async createAppointment(data) {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/appointments/`, 'POST', data);
  }

  async deleteAppointment(id) {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/appointments/${id}/`, 'DELETE');
  }

  async updateAppointmentStatus(id, status) {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/appointments/${id}/`, 'PATCH', { status });
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
    const role = this.getUserRole();
    if (role === 'doctor') return this.fetchAnalytics();
    return this._authorizedRequest('/patient/analytics/');
  }

  async fetchActivities() {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/activities/`);
  }

  async createActivity(action, details = "", type = "info") {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/activities/`, 'POST', { action, details, type });
  }

  async deleteActivity(id) {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/activities/${id}/`, 'DELETE');
  }

  // --- Notification Routes ---
  async fetchNotifications() {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/notifications/`);
  }

  async markNotificationRead(id) {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/notifications/${id}/`, 'PATCH', { read: true });
  }

  async markAllNotificationsRead() {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/notifications/mark_all_read/`, 'POST');
  }

  async deleteNotification(id) {
    const role = this.getUserRole();
    const prefix = role === 'doctor' ? '/doctor' : '/patient';
    return this._authorizedRequest(`${prefix}/notifications/${id}/`, 'DELETE');
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