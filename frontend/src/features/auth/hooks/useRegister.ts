import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tokenStorage } from '../../../lib/tokenStorage'
import { register } from '../api/authApi'
import { authKeys } from './authKeys'

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      tokenStorage.set(response.accessToken)
      queryClient.setQueryData(authKeys.currentUser(), response.user)
    },
  })
}
