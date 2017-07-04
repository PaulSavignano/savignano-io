import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { Card, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import renderTextField from '../forms/renderTextField'
import { fetchAdd } from '../../actions/pages'

const validate = values => {
  const errors = {}
  const requiredFields = [ 'name' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })
  return errors
}

class AdminPageNameAdd extends Component {
  render() {
    const { error, handleSubmit, dispatch } = this.props
    return (
      <Card className="cards">
        <form
          onSubmit={handleSubmit(values => {
            this.props.reset()
            dispatch(fetchAdd(values))
          })}
        >
          <CardText style={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 auto' }}>
              <Field
                name="name"
                label="Add Page Name"
                type="text"
                component={renderTextField}
                fullWidth={true}
                submissionError={error}
              />
            </div>
            <div style={{ margin: 8 }}>
              <RaisedButton type="submit" label="Add" primary={true}/>
            </div>
          </CardText>
        </form>
      </Card>
    )
  }
}

AdminPageNameAdd = reduxForm({
  form: 'AdminPageAdd',
  validate
})(AdminPageNameAdd)

export default AdminPageNameAdd