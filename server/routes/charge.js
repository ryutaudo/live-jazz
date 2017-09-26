const express = require('express');
const JsonWebToken = require('jsonwebtoken');
const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');

const router = express.Router();
const knex = require('knex');
const knexConfig = require('../../knexfile');

const db = knex(knexConfig);

const JWT_KEY = process.env.JWT_KEY || 'TEST_KEY';
const JWT_APP = process.env.JWT_APP || 'TEST_APP';

function verifyJwt(jwtString) {
  return JsonWebToken.verify(jwtString, JWT_KEY, {
    issuer: JWT_APP,
  });
}

router.get('/', async (req, res) => {
  try {
    const decodedJWT = verifyJwt(req.query.jwtString);
    console.log('jwt', req.query.jwtString);
    console.log('userID', req.query.user_id);
    console.log('verified jwt', verifyJwt(req.query.jwtString));
    const result = await db('transaction')
      .leftJoin('user', 'transaction.user_id', 'user.id')
      .leftJoin('event', 'transaction.event_id', 'event.id')
      .where({email: decodedJWT.email});

    console.log(result);

  res.status(200).json(result);
  } catch (err){
    res.status(500);
    console.log(err);
  }
});

router.post('/', (req, res) => {
  const tokenID = req.body.stripeToken.id;
  const eventID = req.body.eventID;
  // const jwt = req.header

  // Charge the user's card:
  stripe.charges.create({
    amount: 1000,
    currency: 'jpy',
    description: 'Example charge',
    source: tokenID,
  }, async (err, charge) => {
    let response;
    if (err) {
      response = {
        OK: false,
      };
    } else {
      const result = await db('transaction')
        .returning('id')
        .insert({
          event_id: eventID,
          total: charge.amount,
          charge_id: charge.id,
          // user_id: 
        });
      response = {
        OK: true,
        order_id: result[0],
      };
    }
    res.status(200).json(response);
  });
});

module.exports = router;
