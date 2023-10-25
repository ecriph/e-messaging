import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnvironmentVariables } from '../runtime/environment-vairables';
import { TransportFailure } from '../transport/transport-failure';

const api = axios.create({
  baseURL: EnvironmentVariables.MAIN_API_URL, // Replace with your API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api, TransportFailure };
