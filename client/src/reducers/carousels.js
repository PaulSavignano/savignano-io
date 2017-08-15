import { type } from '../actions/carousels'

const carousels = (state = {
  adminOpen: false,
  autoplay: true,
  editCarouselId: null,
  editSlideId: null,
  isFetching: true,
  items: [],
  open: false
}, action) => {
  switch (action.type) {
    case `START_EDIT_${type}`:
      return {
        ...state,
        autoplay: false,
        editCarouselId: action.editId
      }
    case `STOP_EDIT_${type}`:
      return {
        ...state,
        autoplay: true,
        editCarouselId: null
      }
    case `START_EDIT_CHILD_${type}`:
      return {
        ...state,
        autoplay: false,
        editSlideId: action.editId
      }
    case `STOP_EDIT_CHILD_${type}`:
      return {
        ...state,
        autoplay: true,
        editSlideId: null
      }
    case `REQUEST_${type}S`:
      return {
        ...state,
        isFetching: true
      }
    case `RECEIVE_${type}S`:
      return {
        ...state,
        isFetching: false,
        items: action.items,
      }
    case `ADD_${type}`:
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.carousel, editing: true }
        ],
        editSlideId: action.slideId
      }
    case `UPDATE_${type}`:
      return {
        ...state,
        autoplay: true,
        editCarouselId: null,
        editSlideId: null,
        items: state.items.map(item => item._id === action.item._id ?
          { ...item, ...action.item } :
          item
        )
      }
    case `DELETE_${type}`:
      return {
        ...state,
        autoplay: true,
        editCarouselId: null,
        editSlideId: null,
        items: state.items.filter(item => item._id !== action._id)
      }
    case `DELETE_${type}S`:
      return {
        ...state,
        autoplay: true,
        editCarouselId: null,
        editSlideId: null,
        items: state.items.filter(item => action.items.indexOf(item._id) === -1),
      }
    case `ERROR_${type}`:
      return {
        ...state,
        error: action.error
      }
    case `TOGGLE_${type}`:
      return {
        ...state,
        open: action.open
      }
    case `TOGGLE_ADMIN_${type}`:
      return {
        ...state,
        adminOpen: action.open
      }
    default:
      return state
  }
}

export default carousels