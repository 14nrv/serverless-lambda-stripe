const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.handler = (req, context, callback) => {
  console.log('createCharge');

  const { stripeEmail, stripeToken, stripeAmt } = JSON.parse(req.body);

  if (
    req.body &&
    stripeEmail &&
    stripeToken &&
    stripeAmt
  ) {
    return stripe.customers
      .create({
        email: stripeEmail,
        source: stripeToken
      })
      .then(customer => {
        console.log('starting the stripe charges');
        stripe.charges.create({
          amount: stripeAmt,
          description: 'Sample Charge',
          currency: 'usd',
          customer: customer.id
        });
      })
      .then(charge => {
        const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: `Charge processed succesfully!`,
            charge: charge,
          }),
        };
        callback(null, response);
      })
      .catch(err => {
        const response = {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: err.message,
          }),
        };
        callback(null, response);
      });
  } else {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: "We're missing something",
      }),
    };
    return callback(null, response);
  }
};
