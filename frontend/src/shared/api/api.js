import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  // baseURL: "https://final-project-speak-check-unit-2-production.up.railway.app",
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// Posts
export const postAPI = {
  getAll: () => api.get("/post"), // Add pagination
  getMyPosts: () => api.get("/post/me"), // Add pagination
  create: (data) => api.post("/post", data),
  update: (id, data) => api.put(`/post/${id}`, data),
  delete: (id) => api.delete(`/post/${id}`),
  like: (id) => api.post(`/post/${id}/like`),
  unlike: (id) => api.post(`/post/${id}/unlike`),
};
export const commentAPI = {
  getCommentsOfPost: (postId) => api.get(`comments/post/${postId}`),
  createCommentsForPost: (postId, data) =>
    api.post(`comments/post/${postId}`, data),

  delete: (id, postId) => api.delete(`/comments/${id}/posts/${postId}`),
  like: (id) => api.post(`/comments/${id}/like`),
  unlike: (id) => api.post(`/comments/${id}/unlike`),
};

// Storage
export const storageAPI = {
  generateUploadUrl: (data) => api.put("/storage/generate-upload-url", data),
  generateDownloadUrl: (data) =>
    api.get(`/storage/generate-download-url?key=${encodeURIComponent(data)}`),
};

export default api;
