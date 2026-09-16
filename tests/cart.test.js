import { describe, expect, test } from 'vitest'

describe('Cart', () => {
  test('calculates the total price correctly', () => {
    const price = 500
    const quantity = 2

    const total = price * quantity

    expect(total).toBe(1000)
  })

  test('calculates zero total when quantity is zero', () => {
    const price = 500
    const quantity = 0

    const total = price * quantity

    expect(total).toBe(0)
  })
})