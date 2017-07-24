import React from 'react'
import { connect } from 'react-redux'
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card'

import ProductItem from './ProductItem'

const ProductItemContainer = ({ item, isFetching }) => {
  return (
    !isFetching && item ?
    <ProductItem item={item} />
    :
    <Card className="section page">
      <CardTitle title="That product is no longer "/>
    </Card>
  )
}



const mapStateToProps = ({ products: { items, isFetching } }, { componentId }) => {
  console.log(componentId)
  console.log(items.find(item => item._id === componentId))
  return {
    item: items.find(item => item._id === componentId),
    isFetching
  }
}

export default connect(mapStateToProps)(ProductItemContainer)
