import createCharge from './index'

jest
  .mock('stripe', () => args => ({
    customers: {
      create: jest.fn(({ source }) =>
        source === 'badToken'
          ? Promise.reject(new Error('error msg'))
          : Promise.resolve({ customer: { id: '' } })
      )
    },
    charges: {
      create: jest.fn(() => Promise.resolve())
    }
  }))

const VALID_EMAIL = 'plop@aol.com'
const VALID_TOKEN = 'token'
const BAD_TOKEN = 'badToken'
const VALID_AMOUNT = 100

const setRequest = (stripeToken, stripeAmt, userData = {}) => ({
  body: JSON.stringify({ userData, stripeToken, stripeAmt })
})

describe('createCharge', () => {
  const expect400 = (error, { statusCode }) => {
    expect(error).toBeFalsy()
    expect(statusCode).toEqual(400)
  }

  describe('> bad request', () => {
    it('fail with no json format', async () => {
      const request = { body: 'plop' }
      await createCharge(request, null, expect400)
    })

    it('fail without email', async () => {
      const request = setRequest(VALID_TOKEN, VALID_AMOUNT, undefined)
      await createCharge(request, null, expect400)
    })

    it('fail with bad email', async () => {
      const request = setRequest(VALID_TOKEN, VALID_AMOUNT, 'plop')
      await createCharge(request, null, expect400)
    })

    it('fail without token', async () => {
      const request = setRequest(undefined, VALID_AMOUNT, { email: VALID_EMAIL })
      await createCharge(request, null, expect400)
    })

    it('fail without amount', async () => {
      const request = setRequest(VALID_TOKEN, undefined, { email: VALID_EMAIL })
      await createCharge(request, null, expect400)
    })

    it('fail with amount under 100', async () => {
      const request = setRequest(VALID_TOKEN, 99, { email: VALID_EMAIL })
      await createCharge(request, null, expect400)
    })

    it('fail if amount is not an integer', async () => {
      const request = setRequest(VALID_TOKEN, 100.5, { email: VALID_EMAIL })
      await createCharge(request, null, expect400)
    })

    it('fail if amount is not a number', async () => {
      const request = setRequest(VALID_TOKEN, 'amount', { email: VALID_EMAIL })
      await createCharge(request, null, expect400)
    })

    it('fail if bad token', async () => {
      const request = setRequest(BAD_TOKEN, VALID_AMOUNT, { email: VALID_EMAIL })
      const cb = (error, { statusCode, body }) => {
        expect(error).toBeFalsy()
        expect(statusCode).toEqual(400)
        expect(JSON.parse(body).error).toBeTruthy()
      }

      await createCharge(request, null, cb)
    })
  })

  it('have allow origin header', async () => {
    const request = setRequest('', '', '')
    const cb = (error, { headers }) => {
      expect(error).toBeFalsy()
      expect(headers['Access-Control-Allow-Origin']).toBeTruthy()
    }

    await createCharge(request, null, cb)
  })

  it('success with a message', async () => {
    const request = setRequest(VALID_TOKEN, VALID_AMOUNT, { email: VALID_EMAIL })

    const cb = (error, { statusCode, body }) => {
      expect(error).toBeFalsy()
      expect(statusCode).toEqual(200)
      expect(typeof body).toBe('string')
      expect(JSON.parse(body).message).toBeTruthy()
    }

    await createCharge(request, null, cb)
  })
})
