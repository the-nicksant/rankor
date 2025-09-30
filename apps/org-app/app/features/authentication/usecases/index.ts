import { apiClient } from "~/lib/http/http-client";

import type { AccountCreationParams, LoginSchema } from "~/features/authentication/schemas";

export namespace AuthUseCase {
  export const createOrganization = async (params: AccountCreationParams): Promise<string> => {
    const res = await apiClient.post('/v1/organization', params)
    return res.data
  }

  export const login = async (params: LoginSchema) => {
    const res = await apiClient.post('/v1/login', params, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded'
      }
    })
    return res.data
  }

  export const createPassword = async (params: { password: string, userId: string }) => {
    const formData = new FormData()

    formData.append('password', params.password)

    const res = await apiClient.post(`/v1/organization/${params.userId}/user`, formData)
    return res.data
  }
}