import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnvironmentVariables } from '../runtime/environment-vairables';
import { TransportFailure } from '../transport/transport-failure';
import JWT from 'expo-jwt';

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
      let token = await AsyncStorage.getItem('token');
      let refreshToken = await AsyncStorage.getItem('refresh_token');

      if (!token) {
        return config;
      }

      // const decode = JWT.decode(token, EnvironmentVariables.JWT_SECRET);
      // const jwtExpiry = decode?.exp as number;
      // const currentTimestamp = Math.floor(Date.now() / 1000);
      // const isExpired = jwtExpiry && jwtExpiry < currentTimestamp;

      // console.log('JWT Expiry:', jwtExpiry);
      // console.log('UserId:', decode?.id);
      // console.log('Role:', decode?.role);
      // console.log('token:', token);
      // console.log('timestamp:', currentTimestamp);
      // console.log('Is Token Expired:', isExpired);
      // console.log('refreshToken:', refreshToken);

      // if (!isExpired) {
      //   config.headers.Authorization = `Bearer ${token}`;
      //   return config;
      // }

      const response = await axios.post(
        `${EnvironmentVariables.MAIN_API_URL}/auth/refresh-token`,
        { refreshToken: refreshToken }
      );

      console.log('Refresh Token Response:', response.data);

      AsyncStorage.setItem('token', response.data.accessToken);
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
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

export { api, TransportFailure };
