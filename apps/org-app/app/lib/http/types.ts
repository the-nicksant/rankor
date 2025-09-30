// src/shared/api/types.ts

import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  details?: string | object; // Detalhes adicionais do erro (ex: erros de validação)
  code?: string; // Um código de erro específico da API
}

export enum CustomErrorCodes {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  CANCELED_REQUEST = 'CANCELED_REQUEST', // Para quando a requisição é cancelada
}

export interface CustomAxiosError {
  code: CustomErrorCodes; // Nosso código de erro interno
  message: string;        // Mensagem amigável para o usuário
  statusCode?: number;    // Código de status HTTP (se disponível)
  originalError?: AxiosError; // Referência ao erro original do Axios para depuração detalhada
  // Você pode adicionar mais campos aqui se precisar de dados extras na UI (ex: validationErrors: Record<string, string>)
}