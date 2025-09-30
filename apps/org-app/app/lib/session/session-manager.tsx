import useAuthStore from "~/features/authentication/stores/auth"

export namespace SessionManager {
  export const getAccessToken = (): string | null => {
    const token = useAuthStore.getState()?.accessToken

    return token
  }

  export const clearSession = () => {
    useAuthStore.getState().clearAuth()
  }
}