import createCharge from './index'

jest
  .mock('stripe', () => args => ({
    customers: {
      create: jest.fn(({ source }) =>
        source === 'badToken'
          ? Promise.reject({ message: 'error msg' })
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

const setRequest = (stripeEmail, stripeToken, stripeAmt) => ({
  body: JSON.stringify({ stripeEmail, stripeToken, stripeAmt })
})

describe('createCharge', () => {
  const expect400 = (error, { statusCode }) => {
    expect(statusCode).toEqual(400)
  }

  describe('> bad request', () => {
    it('fail with no json format', async () => {
      const request = { body: 'plop' }
      await createCharge(request, null, expect400)
    })

    it('fail without email', async () => {
      const request = setRequest(undefined, VALID_TOKEN, VALID_AMOUNT)
      await createCharge(request, null, expect400)
    })

    it('fail with bad email', async () => {
      const request = setRequest('plop', VALID_TOKEN, VALID_AMOUNT)
      await createCharge(request, null, expect400)
    })

    it('fail without token', async () => {
      const request = setRequest(VALID_EMAIL, undefined, VALID_AMOUNT)
      await createCharge(request, null, expect400)
    })

    it('fail without amount', async () => {
      const request = setRequest(VALID_EMAIL, VALID_TOKEN, undefined)
      await createCharge(request, null, expect400)
    })

    it('fail with amount under 100', async () => {
      const request = setRequest(VALID_EMAIL, VALID_TOKEN, 99)
      await createCharge(request, null, expect400)
    })

    it('fail if amount is not an integer', async () => {
      const request = setRequest(VALID_EMAIL, VALID_TOKEN, 100.5)
      await createCharge(request, null, expect400)
    })

    it('fail if amount is not a number', async () => {
      const request = setRequest(VALID_EMAIL, VALID_TOKEN, 'amount')
      await createCharge(request, null, expect400)
    })

    it('fail if bad token', async () => {
      const request = setRequest(VALID_EMAIL, BAD_TOKEN, VALID_AMOUNT)
      const cb = (error, { statusCode, body }) => {
        expect(statusCode).toEqual(400)
        expect(JSON.parse(body).error).toBeTruthy()
      }

      await createCharge(request, null, cb)
    })
  })

  it('have allow origin header', async () => {
    const request = setRequest('', '', '')
    const cb = (error, { headers }) => {
      expect(headers['Access-Control-Allow-Origin']).toBeTruthy()
    }

    await createCharge(request, null, cb)
  })

  it('success with a message', async () => {
    const request = setRequest(VALID_EMAIL, VALID_TOKEN, VALID_AMOUNT)

    const cb = (error, { statusCode, body}) => {
      expect(statusCode).toEqual(200)
      expect(typeof body).toBe('string')
      expect(JSON.parse(body).message).toBeTruthy()
    }

    await createCharge(request, null, cb)
  })
})
