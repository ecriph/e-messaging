import { useMemo } from 'react';
import { api, TransportFailure } from './use-main-axios'; // Import your Axios configuration

function useMainApi() {
  useMemo(() => {
    const getRequest = async (url: string) => {
      try {
        const response = await api.get(url);

        if (response.status === 200) {
          // Request was successful
          return { body: response.data };
        } else {
          // Handle unexpected responses
          if (
            response.status === 404 &&
            response.headers['X-Resource-Not-Found'] === 'true'
          ) {
            return { failure: TransportFailure.NotFound };
          } else if (response.status === 403) {
            return { failure: TransportFailure.Forbidden };
          } else if (response.status === 401) {
            // Handle unauthorized or token expiration
            return { failure: TransportFailure.AbortedAndDealtWith };
          } else {
            // Handle other unexpected responses
            return { failure: TransportFailure.UnexpectedResponse };
          }
        }
      } catch (error: any) {
        // Handle connection failure or other errors
        if (error.message === 'Network Error') {
          return { failure: TransportFailure.ConnectionFailure };
        } else {
          return { failure: error }; // Rethrow other unexpected errors
        }
      }
    };
    const postRequest = async (url: string, body: unknown) => {
      try {
        const response = await api.post(url, { body });

        if (response.status === 200) {
          // Request was successful
          return response.data;
        } else {
          // Handle unexpected responses
          if (
            response.status === 404 &&
            response.headers['X-Resource-Not-Found'] === 'true'
          ) {
            return { failure: TransportFailure.NotFound };
          } else if (response.status === 403) {
            return { failure: TransportFailure.Forbidden };
          } else if (response.status === 401) {
            // Handle unauthorized or token expiration
            return { failure: TransportFailure.AbortedAndDealtWith };
          } else {
            // Handle other unexpected responses
            return { failure: TransportFailure.UnexpectedResponse };
          }
        }
      } catch (error: any) {
        // Handle connection failure or other errors
        if (error.message === 'Network Error') {
          return { failure: TransportFailure.ConnectionFailure };
        } else {
          return { failure: error }; // Rethrow other unexpected errors
        }
      }
    };

    return { getRequest, postRequest };
  }, []);
}
