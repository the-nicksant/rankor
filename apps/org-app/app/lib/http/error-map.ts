import { CustomErrorCodes, type CustomAxiosError } from "./types";

export const errorMap: Record<number, CustomAxiosError> = {
  400: { code: CustomErrorCodes.BAD_REQUEST, message: 'Requisição inválida.' },
  401: { code: CustomErrorCodes.UNAUTHORIZED, message: 'Não autorizado' },
  403: { code: CustomErrorCodes.FORBIDDEN, message: 'Você não tem permissão para acessar este recurso.' },
  404: { code: CustomErrorCodes.NOT_FOUND, message: 'O recurso solicitado não foi encontrado.' },
  422: { code: CustomErrorCodes.VALIDATION_ERROR, message: 'Houve um problema com os dados enviados.' },
  500: { code: CustomErrorCodes.INTERNAL_SERVER_ERROR, message: 'Ocorreu um erro interno no servidor.' },
};