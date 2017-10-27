import { ObjectID } from 'mongodb'

import Address from '../models/Address'
import User from '../models/User'
import Order from '../models/Order'
import sendGmail from '../utils/sendGmail'

const formatPrice = (cents) => `$${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`

export const add = (req, res, next) => {
  const { _id } = req.user
  const {
    stripeToken,
    fullAddress,
    name,
    phone,
    street,
    city,
    state,
    zip,
    cart
  } = req.body
  if (fullAddress === 'newAddress') {
    const newAddress = new Address({
      user: ObjectID(_id),
      values: {
        name,
        phone,
        street,
        city,
        zip,
        state
      }
    })
    newAddress.save()
    .then(address => {
      return User.findOneAndUpdate(
        { _id },
        { $push: { addresses: address._id }},
        { new: true }
      )
      .then(user => createCharge({
        address,
        cart,
        stripeToken,
        res,
        req,
        user
      }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  } else {
    return Address.findOne({ _id: fullAddress })
    .then(address => {
      return User.findOne({ _id })
      .then(user => createCharge({
        address,
        cart,
        stripeToken,
        res,
        req,
        user
      }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  }
}

const createCharge = ({
  address,
  cart,
  stripeToken,
  res,
  req,
  user
}) => {
  const { _id, values: { firstName, lastName, email }} = user
  const rootUrl = req.get('host')
  const stripe = require("stripe")(process.env.STRIPE_SK_TEST)
  return stripe.charges.create({
    amount: Math.round(cart.total),
    currency: "usd",
    source: stripeToken,
    description: `${rootUrl} Order`
  })
  .then(charge => {
    const newOrder = new Order({
      user: _id,
      paymentId: charge.id,
      total: cart.total,
      firstName,
      lastName,
      email,
      address: address.values,
      cart
    })
    newOrder.save()
    .then(order => {
      res.send({ order, user })
      const { email, firstName, lastName, cart, address } = order
      const { name, phone, street, city, state, zip } = address

      const htmlOrder = `
        <div style="font-weight: 900">Order Summary</div>
        <div>Order: ${order._id}</div>
        <div>Total: ${formatPrice(order.cart.total)}</div>
        <div>Quantity: ${order.cart.quantity}</div>
        <div>Items:</div>
        <ol>
          ${order.cart.items.map(item => (
            `<li style="display:flex;flex-flow:row wrap;align-items:center;font-family:inherit;">
              ${item.productQty} of <img src=${item.image.src} alt="order item" height="32px" width="auto" style="margin-left:8px;margin-right:8px"/> ${item.name} ${item.productId}
            </li>`
          ))}
        </ol>
        <div style="font-weight: 900">Delivery Summary</div>
        <div>${name}</div>
        <div>${phone}</div>
        <div>${street}</div>
        <div>${city}, ${state} ${zip}</div>
      `
      sendGmail({
        to: email,
        toSubject: 'Thank you for your order!',
        toBody: `
          <p>Hi ${firstName},</p>
          <p>Thank you for your recent order ${order._id}.  We are preparing your order for delivery and will send you a confirmation once it has shipped.  Please don't hesitate to reach out regarding anything we can with in the interim.</p>
          ${htmlOrder}
        `,
        fromSubject: `New order received!`,
        fromBody: `
          <p>${firstName} ${lastName} just placed order an order!</p>
          ${htmlOrder}
          <p>Once shipped, you can mark the item as shipped in at <a href="${rootUrl}/admin/orders">${rootUrl}/admin/orders</a> to send confirmation to ${firstName}.</p>
        `
      })
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}


export const get = (req, res) => {
  Order.find({ user: req.user._id })
  .then(orders => res.send(orders))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const getAdmin = (req, res) => {
  Order.find({})
  .then(orders => res.send(orders))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const update = (req, res) => {
  const { _id } = req.params
  if (!ObjectID.isValid(_id)) return res.status(404).send({ error: 'Invalid id'})
  const { type } = req.body
  switch (type) {
    case 'SHIPPED':
      Order.findOneAndUpdate(
        { _id },
        { $set: { shipped: true, shipDate: new Date() }},
        { new: true }
      )
      .then(order => {
        const { email, firstName, lastName, cart, address } = order
        const { name, phone, street, city, state, zip } = address
        res.send(order)
        sendGmail({
          to: email,
          toSubject: 'Your order has shipped!',
          toBody: `
            <p>Hi ${firstName},</p>
            <p>Order ${order._id} is on it's way!</p>
          `,
          fromSubject: `Order shipped!`,
          fromBody: `
            <p>Order ${order._id} has been changed to shipped!</p>
            <div>Order: ${order._id}</div>
            <div>Total: ${formatPrice(order.cart.total)}</div>
            <div>Quantity: ${order.cart.quantity}</div>
            <div>Items:</div>
            <ul>
              ${order.cart.items.map(item => `<li>${item.productQty} of ${item.name} ${item.productId}</li>`)}
            </ul>
            <div>Address:</div>
            <div>${name}</div>
            <div>${phone}</div>
            <div>${street}</div>
            <div>${city}, ${state} ${zip}</div>
          `})
        })
        .catch(error => { console.error(error); res.status(400).send({ error })})
      break
    default:
      return
  }
}
