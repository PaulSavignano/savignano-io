import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { Card, CardTitle } from 'material-ui/Card'

import './brand.css'
import ImageForm from '../images/ImageForm'
import BrandFormField from './BrandFormField'
import SuccessableButton from '../../components/buttons/SuccessableButton'

import { fetchUpdate } from '../../actions/brand'

class BrandForm extends Component {
  state = {
    deleteImage: false,
    disabled: true,
    imageEdit: false,
    path: null
  }
  handleImageEdit = (bool) => {
    this.setState({ imageEdit: bool })
    setTimeout(() => window.dispatchEvent(new Event('resize')), 10)
  }
  handleImageRemove = () => {
    const { image } = this.props
    const deleteImage = image.src ? true : false
    this.setState({
      imageEdit: false,
      deleteImage,
      disabled: false
    })
  }
  handleFormSubmit = (values) => {
    const { deleteImage, imageEdit, path } = this.state
    const { dispatch, image } = this.props
    const oldImageSrc = image && image.src ? image.src : null
    const newImage = imageEdit ? this.imageEditor.handleSave() : null
    switch(true) {
      case (imageEdit):
        return dispatch(fetchUpdate(path, {
          type: 'UPDATE_IMAGE_AND_VALUES',
          image: newImage,
          oldImageSrc,
          values
        }))
      case (deleteImage):
        return dispatch(fetchUpdate(path, {
          type: 'DELETE_IMAGE_AND_UPDATE_VALUES',
          oldImageSrc,
          values
        }))
      default:
        return dispatch(fetchUpdate(path, {
          type: 'UPDATE_VALUES',
          values
        }))
    }
  }
  componentWillMount() {
    const { _id, form } = this.props
    const path = `${form.toLowerCase()}/${_id}`
    this.setState({ path })
  }
  componentWillReceiveProps({ pristine }) {
    if (pristine !== this.props.pristine) this.setState({ disabled: pristine })
  }
  setImageFormRef = (imageEditor) => this.imageEditor = imageEditor
  render() {
    const { disabled } = this.state
    const {
      backgroundColor,
      error,
      fields,
      fontFamily,
      form,
      handleSubmit,
      image,
      reset,
      submitSucceeded,
      submitting,
    } = this.props
    return (
      <Card
        className="brand-form"
        style={{ backgroundColor, fontFamily }}
      >
        <form
          onSubmit={handleSubmit(this.handleFormSubmit)}
        >
          <CardTitle title={`${form}`} />
          {image &&
            <ImageForm
              key={1}
              image={image}
              label="image"
              type="image/jpg"
              onImageEdit={this.handleImageEdit}
              onImageRemove={this.handleImageRemove}
              ref={this.setImageFormRef}
            />
          }
          <div className="field-container">
            {fields.map(({ max, min, name, options, type }) => (
              <BrandFormField
                fontFamily={fontFamily}
                key={name}
                max={max}
                min={min}
                name={name}
                options={options}
                type={type}
              />
            ))}
          </div>
          {error && <div className="error">{error}</div>}
          <div className="button-container">
            <SuccessableButton
              disabled={disabled}
              error={error}
              imageEdit={this.state.imageEdit}
              label={`update ${form}`}
              reset={reset}
              submitSucceeded={submitSucceeded}
              submitting={submitting}
              successLabel={`${form} updated!`}
            />
          </div>
        </form>
      </Card>
    )
  }
}

BrandForm.propTypes = {
  _id: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  fields: PropTypes.array.isRequired,
  fontFamily: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  image: PropTypes.object,
}

export default reduxForm({ enableReinitialize: true })(BrandForm)
