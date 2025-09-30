import axios, { AxiosError } from 'axios'
import { CustomErrorCodes, type CustomAxiosError } from './types';
import { SessionManager } from '../session/session-manager';
import { errorMap } from './error-map';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});

apiClient.interceptors.request.use(
  (config) => {
    const authToken = SessionManager.getAccessToken()

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    const customError: CustomAxiosError = {
      code: CustomErrorCodes.UNKNOWN_ERROR,
      message: 'Não foi possível preparar a requisição. Verifique sua configuração.',
      originalError: error,
    };
    return Promise.reject(customError);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    let customError: CustomAxiosError;

    if (error.response) {
      const statusCode = error.response.status;
      const apiMessage = error.response.data?.message

      customError = errorMap[statusCode] || 
        {
          code: CustomErrorCodes.UNKNOWN_ERROR,
          message: apiMessage || 'Ocorreu um erro inesperado',
          statusCode,
          originalError: error,
        }
        
    } else if (error.request) {
      customError = {
        code: CustomErrorCodes.NETWORK_ERROR,
        message: 'Erro de conexão: Não foi possível alcançar o servidor. Verifique sua internet.',
        originalError: error,
      };

      if (axios.isCancel(error)) {
        customError.code = CustomErrorCodes.CANCELED_REQUEST;
        customError.message = 'A requisição foi cancelada.';
      }

    } else {
      customError = {
        code: CustomErrorCodes.UNKNOWN_ERROR,
        message: `Ocorreu um erro inesperado: ${error.message}`,
        originalError: error,
      };
    }

    return Promise.reject(customError);
  }
);


export { apiClient }