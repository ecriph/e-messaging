import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnvironmentVariables } from '../runtime/environment-vairables';
import { TransportFailure } from '../transport/transport-failure';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../data/const';

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
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      if (!refreshToken) {
        return config;
      }
      const response = await axios.post(
        `${EnvironmentVariables.MAIN_API_URL}/auth/refresh-token`,
        { refreshToken }
      );
      config.headers.Authorization = `Bearer ${response.data.access_token}`;
      return config;
    } catch (error) {
      console.error('Error in request:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    }
    return Promise.resolve(response); // Don't forget to return the response for other status codes
  },
  (error) => {
    console.log(error.response);
    if (error.message === 'Network Error') {
      return Promise.reject(TransportFailure.ConnectionFailure);
    } else if (
      error.response &&
      error.response.status === 404 &&
      error.response.headers['X-Resource-Not-Found'] === 'true'
    ) {
      return Promise.reject(TransportFailure.NotFound);
    } else if (error.response && error.response.status === 403) {
      return Promise.reject(TransportFailure.Forbidden);
    } else if (error.response && error.response.status === 401) {
      return Promise.reject(TransportFailure.AbortedAndDealtWith);
    } else {
      return Promise.reject(TransportFailure.UnexpectedResponse);
    }
  }
);

export { api, TransportFailure };
