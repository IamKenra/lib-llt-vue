import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  static init(): void {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }

  static setHeader(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeHeader(): void {
    axios.defaults.headers.common = {};
  }

  static get<T>(resource: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.get<T>(resource, config);
  }

  static post<T>(resource: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.post<T>(resource, data, config);
  }

  static put<T>(resource: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.put<T>(resource, data, config);
  }

  static delete<T>(resource: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.delete<T>(resource, config);
  }
}

export default ApiService;
