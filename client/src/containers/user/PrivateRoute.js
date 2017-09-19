import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import history from '../routers/history'
import userContainer from './userContainer'

class PrivateRoute extends Component {
  hasRoles = (roles, requiredRoles) => {
    if (roles) return requiredRoles.some(v => roles.indexOf(v) >= 0)
    return false
  }
  render() {
    const {
      component: Component,
      requiredRoles,
      user,
      ...rest,
    } = this.props
    return (
      <Route {...rest} component={(props) => (
        this.hasRoles(user.roles, requiredRoles) ? (
          <Component {...this.props} />
        ) : (
          <Redirect to="/user/signin" />
        )
      )}/>
    )
  }
}
PrivateRoute.propTypes = {
  user: PropTypes.object.isRequired,
}

export default userContainer(PrivateRoute)