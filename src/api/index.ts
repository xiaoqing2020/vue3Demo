import axios from "axios";

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 支持跨域携带cookie
  timeout: 5000,
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
        console.error("请求参数错误");
        break;
      case 401:
        console.error("未授权，请登录");
        break;
      case 403:
        console.error("拒绝访问");
        break;
      case 404:
        console.error("请求地址不存在");
        break;
      case 500:
        console.error("服务器内部错误");
        break;
      default:
        console.error("网络错误");
    }

    return Promise.reject(error);
  }
);

// API接口
export const getServerInfo = () => api.get("/");
export const getCsrfCookie = () => api.get("/csrf-cookie");
export const login = (data: { email: string; password: string }) =>
  api.post("/login", data);
export const logout = () => api.post("/logout");
export const getUserInfo = () => api.get("/api/user");
