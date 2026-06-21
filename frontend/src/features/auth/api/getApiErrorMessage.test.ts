import { describe, expect, it } from 'vitest'
import { getApiErrorMessage } from './getApiErrorMessage'

function axiosError(response?: { data?: unknown }) {
  return Object.assign(new Error('Request failed'), {
    isAxiosError: true,
    response,
  })
}

describe('getApiErrorMessage', () => {
  it('returns the first validation error', () => {
    const error = axiosError({
      data: { errors: { Username: ['Username is already taken.'] } },
    })

    expect(getApiErrorMessage(error)).toBe('Username is already taken.')
  })

  it('returns the problem detail when present', () => {
    const error = axiosError({ data: { detail: 'Invalid credentials.' } })

    expect(getApiErrorMessage(error)).toBe('Invalid credentials.')
  })

  it('explains when the backend cannot be reached', () => {
    expect(getApiErrorMessage(axiosError())).toBe(
      'Unable to reach the API. Make sure the backend is running.',
    )
  })

  it('uses a safe fallback for unknown errors', () => {
    expect(getApiErrorMessage(new Error('secret internal error'))).toBe(
      'Something went wrong. Please try again.',
    )
  })
})
