import { sum } from "./sum"

describe('Sum function:', () => {
    test('should return sum of 2 numbers', () => {
        expect(sum(5, 6)).toBe(11)
    })
})