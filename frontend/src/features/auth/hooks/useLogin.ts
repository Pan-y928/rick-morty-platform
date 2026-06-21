import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tokenStorage } from '../../../lib/tokenStorage'
import { login } from '../api/authApi'
import { authKeys } from './authKeys'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      tokenStorage.set(response.accessToken)
      queryClient.setQueryData(authKeys.currentUser(), response.user)
    },
  })
}
