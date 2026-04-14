import axios from 'axios';

const API = axios.create({
    baseURL: 'https://internsphere-1.onrender.com/api'
});

export const authAPI = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    updateProfile: (data) => API.put('/auth/profile', data)
};

export const jobAPI = {
    getAll: () => API.get('/jobs'),
    getById: (id) => API.get(`/jobs/${id}`),
    getByHirer: (hirerId) => API.get(`/jobs/hirer/${hirerId}`),
    create: (data) => API.post('/jobs', data)
};

export const applicationAPI = {
    apply: (data) => API.post('/applications', data),
    getForSeeker: (seekerId) => API.get(`/applications/seeker/${seekerId}`),
    getForJob: (jobId) => API.get(`/applications/job/${jobId}`),
    updateStatus: (id, data) => API.patch(`/applications/${id}`, data)
};

export const adminAPI = {
    getPending: () => API.get('/admin/pending'),
    verify: (id, action) => API.post(`/admin/verify/${id}`, { action }),
    getUsers: () => API.get('/admin/users')
};

export const fileAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return API.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
