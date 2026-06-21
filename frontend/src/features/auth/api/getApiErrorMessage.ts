import axios from 'axios'

interface ApiProblem {
  title?: string
  detail?: string
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError<ApiProblem>(error)) {
    return 'Something went wrong. Please try again.'
  }

  if (!error.response) {
    return 'Unable to reach the API. Make sure the backend is running.'
  }

  const problem = error.response.data
  const firstValidationError = problem?.errors
    ? Object.values(problem.errors).flat()[0]
    : undefined

  return (
    firstValidationError ??
    problem?.detail ??
    problem?.title ??
    'The request could not be completed.'
  )
}
