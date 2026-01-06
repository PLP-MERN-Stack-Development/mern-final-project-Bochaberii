// api.js - API service for making requests to the backend

import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get Clerk token - will be called before each request
let getToken = null;

export const setGetToken = (tokenGetter) => {
  getToken = tokenGetter;
};

// Add request interceptor for Clerk authentication
api.interceptors.request.use(
  async (config) => {
    // Add user ID from Clerk
    try {
      const userId = window.Clerk?.user?.id;
      if (userId) {
        config.headers['x-user-id'] = userId;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Redirect to sign in page (Clerk will handle this)
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Post API services
export const postService = {
  // Get all posts with optional pagination, filters, and search
  getAllPosts: async (page = 1, limit = 10, category = null, search = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get post statistics
  getPostStats: async () => {
    const response = await api.get('/posts/stats');
    return response.data;
  },

  // Get a single post by ID
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create a new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update an existing post
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete a post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

// Category API services
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get a single category by ID
  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create a new category (admin only)
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update a category (admin only)
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete a category (admin only)
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// NOTE: Authentication is handled by Clerk
// No need for custom auth service when using Clerk
// Clerk provides: useAuth(), useUser(), useClerk() hooks
// Use those hooks in your components instead of this service

export default api; 