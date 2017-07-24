import React from 'react'
import { connect } from 'react-redux'
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card'

import CartList from './CartList'
import CartTotal from './CartTotal'

const CartPage = ({ isFetching, cart, user }) => (
  !isFetching && !cart.items.length ?
  <Card zDepth={0} className="section page">
    <CardTitle title="Nothing in your cart yet" />
  </Card>
  :
  <section>
    <Card>
      <CardTitle title="Cart" />
      <CartList cart={cart} />
      <CartTotal cart={cart} user={user} />
    </Card>
  </section>
)

const mapStateToProps = ({ carts: { cart, isFetching }, user }) => ({
  isFetching,
  cart,
  user
})

export default connect(mapStateToProps)(CartPage)
