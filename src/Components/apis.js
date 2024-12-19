import axios from 'axios';

const BASE_URL = 'https://ottadmin.imboxocinema.com/api';

// Create Axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor for Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API Calls
export const loginUser = async (values) => {
  const response = await apiClient.post('/login',values);
  // console.log('response', response)
  return response.data;
};

export const signupUser = async (formData) => {
  const response = await apiClient.post('/signup', formData);
  return response.data;
};

export const verifyEmailOtp = async (email, otp) => {
  const response = await apiClient.post('/email-verify', { email, otp });
  return response.data;
};

// Fetch user details by ID
export const fetchUserDetails = async (userId) => {
  const response = await apiClient.get(`/user-details/${userId}`);
  return response.data;
};

// Update user details by ID
export const updateUserDetails = async (userData) => {
  try {
    const response = await apiClient.post(`/user-update`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.error('Error in updating user details:', error);
    throw error; // Rethrow error to handle it in the calling function
  }
};


// Fetch all countries
export const fetchCountries = async () => {
  const response = await apiClient.get('/country');
  return response.data;
};

// Fetch states by country ID
export const fetchStates = async (countryId) => {
  const response = await apiClient.get(`/state/${countryId}`);
  return response.data;
};

// Fetch cities by state ID
export const fetchCities = async (stateId) => {
  const response = await apiClient.get(`/city/${stateId}`);
  return response.data;
};

export const logout = ()=>{
    localStorage.removeItem('token');
    window.location.href = '/login';
}