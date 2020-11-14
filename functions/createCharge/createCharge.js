import stripePackage from 'stripe'
import is from 'is_js'

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY)

const ALLOW_ORIGIN = { 'Access-Control-Allow-Origin': '*' }
const MIN_AMOUNT = 100 // in cent

const setResponse = (statusCode, body) => ({
  statusCode,
  headers: ALLOW_ORIGIN,
  body: JSON.stringify(body)
})

const setResponse400 = (message = "We're missing something") =>
  setResponse(400, { error: message })

const isRequestDataValid = ({ email, token, amount }) => {
  const isEmailValid = is.email(email)
  const amountNumber = Number(amount)
  const isAmountValid = is.integer(amountNumber) && amountNumber >= MIN_AMOUNT
  return !!token && isEmailValid && isAmountValid
}

export const handler = async (req, _context, cb) => {
  // eslint-disable-next-line no-console
  console.log('trying to create charge with body: ', req.body)

  let response = setResponse400()

  try {
    // eslint-disable-next-line no-var
    var {
      userData,
      stripeToken: token,
      stripeAmt: amount
    } = JSON.parse(req.body)
  } catch (err) {
    return cb(null, response)
  }

  const { email, shipping } = userData
  const shouldCreateCharges = isRequestDataValid({ email, token, amount })

  if (shouldCreateCharges) {
    try {
      const { id: customer } = await stripe.customers.create({
        ...userData,
        source: token
      })

      await stripe.charges.create({
        amount,
        currency: 'usd',
        customer,
        description: 'Sample Charge',
        shipping
      })

      response = setResponse(
        200,
        { message: 'Charge processed succesfully!' }
      )
    } catch ({ message }) {
      response = setResponse400(message)
    }
  }

  return cb(null, response)
}
