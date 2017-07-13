import React from 'react'
import { connect } from 'react-redux'

import OrderDetail from '../../components/orders/OrderDetail'

const OrderDetailPage = ({ isFetching, order }) => (
  !isFetching && <div><br/><OrderDetail order={order} /></div>
)

const mapStateToProps = ({
  orders: { items, isFetching }
}, {
  params: { orderId }
}) => ({
  isFetching,
  order: items.find(item => item._id === orderId)
})


export default connect(mapStateToProps)(OrderDetailPage)
