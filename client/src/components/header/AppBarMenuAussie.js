import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { push } from 'react-router-redux'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import muiThemeable from 'material-ui/styles/muiThemeable'

import SearchBar from '../search/SearchBar'
import SigninSignout from '../users/SigninSignout'
import CartIcon from '../carts/CartIcon'

import './AppBarMenuAussie.css'


class AppBarMenuAussie extends Component {
  state = {
    searching: false,
    openMenu: false,
    color: this.props.muiTheme.palette.textColor
  }
  handleOpen = (e) => {
    e.preventDefault()
    this.setState({
      openMenu: true,
      anchorEl: e.currentTarget,
    })
  }
  handleSearch = () => this.setState({ searching: !this.state.searching })
  handleClose = () => this.setState({ openMenu: false })
  render() {
    const { dispatch, user, handleDrawer, pages, brand: { business }, muiTheme, path, hasProducts } = this.props
    const { textColor, primary1Color } = muiTheme.palette
    console
    const styles = {
      nav: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
      },
      brand: {
        cursor: 'pointer',
      },
      search: {
        color: textColor
      }
    }
    return (
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        {this.state.searching ?
          <nav style={styles.nav} key={1}>
            <SearchBar handleSearch={this.handleSearch()}/>
          </nav>

        :

          <nav style={styles.nav} key={2}>
            <div style={styles.brand} onTouchTap={() => dispatch(push('/'))}>
              {brand.image ? <img src={brand.image} style={{ maxHeight: 200, maxWidth: 200, position: 'absolute' }} className="brandImage" alt=""/> : brand.values.name || 'Brand'}
            </div>
            <span style={{ display: 'flex', flexFlow: 'column' }}>
              <span style={{ alignSelf: 'flex-end', color: primary1Color }} className="phone">
                <a href={`tel:${brand.values.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>{brand.values.phone}</a>
              </span>
              <span style={{ alignSelf: 'flex-end' }}>
                <span className="appbar-nav">
                  {pages.filter(page => page.slug !== 'home').map(page => (
                    <FlatButton
                      key={page._id}
                      style={{ color: path === `/${page.slug}` ? primary1Color : textColor }}
                      onTouchTap={() => dispatch(push(`/${page.slug}`))}
                      label={page.name}
                      hoverColor="none"
                    />
                  ))}
                  <FlatButton
                    style={{ color: path === `/contact` ? primary1Color : textColor }}
                    onTouchTap={() => dispatch(push(`/contact`))}
                    label="Contact"
                    hoverColor="none"
                  />
                </span>
                {!hasProducts ? null :
                <IconButton
                  iconClassName="fa fa-search"
                  iconStyle={{ fontSize: 18}}
                  style={styles.search}
                  onTouchTap={() => this.setState({ searching: !this.state.searching })}
                />
                }
                <FlatButton
                  style={styles.user}
                  className="appbar-nav"
                  onTouchTap={this.handleOpen}
                  label={user.values.firstName ? `Hello, ${user.values.firstName}`: `SIGN IN`}
                  hoverColor="none"
                />
                <Popover
                  open={this.state.openMenu}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={this.handleClose}
                  animation={PopoverAnimationVertical}
                >
                  <Menu>
                    <SigninSignout user={user} handleClose={this.handleClose} />
                  </Menu>
                </Popover>
                { !hasProducts ? null :
                <IconButton
                  children={<CartIcon  />}
                  onTouchTap={() => dispatch(push('/user/cart'))}
                  style={{ padding: '12px 0' }}
                />
                }

              </span>
            </span>
          </nav>
        }
      </CSSTransitionGroup>
    )
  }
}

AppBarMenuAussie = compose(connect(), muiThemeable())(AppBarMenuAussie)

export default AppBarMenuAussie