import api from './api';

const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;
