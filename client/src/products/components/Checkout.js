/* global Stripe */
import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import Payment from 'payment'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card'
import { startCheckout } from '../actions/checkout'
import './CreditCard.css'

const validate = values => {
  const errors = {}
  const requiredFields = [ 'firstName', 'lastName', 'email', 'address', 'zip', 'state' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (values.number) {
    const type = Payment.fns.cardType(values.number);
    const cards = document.querySelectorAll('[data-brand]');

    [].forEach.call(cards, (element) => {
      if (element.getAttribute('data-brand') === type) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    })
  }
  return errors
}

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)


let Checkout = (props) => {
  const { dispatch, handleSubmit, pristine, reset, submitting } = props
  return (
    <Card>
      <form onSubmit={handleSubmit((values) => dispatch(startCheckout(values)))}>
        <CardText>
          <Field name="firstName" component={renderTextField} label="First Name" fullWidth={true} />
          <Field name="lastName" component={renderTextField} label="Last Name" fullWidth={true} />
          <Field name="email" component={renderTextField} label="Email" fullWidth={true} />
          <Field name="address" component={renderTextField} label="Address" fullWidth={true} />
          <Field name="zip" component={renderTextField} label="Zip" fullWidth={true} />
          <Field name="state" component={renderTextField} label="State" fullWidth={true} />
        </CardText>
        <CardText>
          <ul className="credit-card-list">
            <li><i data-brand="visa" className="fa fa-cc-visa"></i></li>
            <li><i data-brand="amex" className="fa fa-cc-amex"></i></li>
            <li><i data-brand="mastercard" className="fa fa-cc-mastercard"></i></li>
            <li><i data-brand="jcb" className="fa fa-cc-jcb"></i></li>
            <li><i data-brand="discover" className="fa fa-cc-discover"></i></li>
            <li><i data-brand="dinersclub" className="fa fa-cc-diners-club"></i></li>
          </ul>
          <div>
            <Field
              name="number"
              component={renderTextField}
              label="Card Number"
              fullWidth={true}
              onFocus={e => Payment.formatCardNumber(e.target)}
            />
          </div>
          <div>
            <Field
              name="exp"
              component={renderTextField}
              label="Card Expiration"
              onFocus={e => Payment.formatCardExpiry(e.target)}
            />
          </div>
          <div>
            <Field
              name="cvc"
              component={renderTextField}
              label="Card CVC"
              onFocus={e => Payment.formatCardCVC(e.target)}
            />
          </div>
        </CardText>
        <CardActions>
          <RaisedButton type="submit" disabled={pristine || submitting}>
            Submit
          </RaisedButton>
          <RaisedButton type="button" disabled={pristine || submitting} onTouchTap={reset}>
            Clear Values
          </RaisedButton>
        </CardActions>
      </form>
    </Card>

  )
}

Checkout = reduxForm({
  form: 'CheckoutForm',  // a unique identifier for this form
  validate,
})(Checkout)

Checkout = connect()(Checkout)

export default Checkout
