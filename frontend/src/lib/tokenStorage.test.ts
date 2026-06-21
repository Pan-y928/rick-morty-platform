import { describe, expect, it } from 'vitest'
import { tokenStorage } from './tokenStorage'

describe('tokenStorage', () => {
  it('stores and retrieves an access token', () => {
    tokenStorage.set('test-token')

    expect(tokenStorage.get()).toBe('test-token')
  })

  it('clears the stored access token', () => {
    tokenStorage.set('test-token')

    tokenStorage.clear()

    expect(tokenStorage.get()).toBeNull()
  })
})
