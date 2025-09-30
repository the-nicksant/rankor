import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { CustomAxiosError } from "~/lib/http/types";
import { AuthUseCase } from "../usecases";
import type { AccountCreationParams, LoginSchema } from "../schemas";

type CreatePasswordParams = {
  accountId: string
  password: string,
}

type CreatePasswordMutationOptions = UseMutationOptions<void, CustomAxiosError, CreatePasswordParams>
type CreateAccountMutationOptions = UseMutationOptions<string, CustomAxiosError, AccountCreationParams>
type LoginMutationOptions = UseMutationOptions<string, CustomAxiosError, LoginSchema>

export const useCreatePassword = (options: CreatePasswordMutationOptions) => {
  return useMutation({
    mutationFn: async (values: CreatePasswordParams) => {
      if(!values.accountId) return;

      await AuthUseCase.createPassword({ 
        password: values.password, 
        userId: values.accountId
      })
    },
    ...options
  })
}

export const useCreateAccount = (options: CreateAccountMutationOptions) => {
  return useMutation({
    mutationFn: async (data: AccountCreationParams) => await AuthUseCase.createOrganization(data),
    ...options
  })
}

export const useLogin = (options: LoginMutationOptions) => {
  return useMutation({
    mutationFn: async (values: LoginSchema) => await AuthUseCase.login(values),
    ...options
  })
}