import React from 'react'
import classNames from 'classnames';
import { Spinner } from './';

class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSelectorOpened: false,
      address: '',
      modeType: null,
    }
    this.updateSwitch = this.updateSwitch.bind(this)
    this.handleModeSelectorApplyButton = this.handleModeSelectorApplyButton.bind(this)
    this.handleAddressInputChange = this.handleAddressInputChange.bind(this)
    this.handleModeTypeChange = this.handleModeTypeChange.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isSelectorOpened && this.state.isSelectorOpened) {
      this.refs.serverAddressInput.focus()
    }
  }

  // TODO: Animation on mode selector
  updateSwitch(isSelectorOpened) {
    this.setState({ isSelectorOpened })
  }

  // TODO: Should be implemented
  handleModeSelectorApplyButton() {
    const { address, modeType } = this.state

    if (!address.length || !modeType.length) {
      alert('nop')
    }

    this.props.establishConnection(modeType, address)
  }

  handleAddressInputChange(e) {
    this.setState({ address: e.target.value })
  }

  handleModeTypeChange(e) {
    this.setState({ modeType: e.target.value })
  }

  render() {
    const { isSelectorOpened } = this.state
    const modeSelectorClass = classNames([
      'navbar__mode-selector',
      { 'navbar__mode-selector--active': isSelectorOpened },
    ])
    const appCoverClass = classNames(['app-cover', { 'app-cover--active': isSelectorOpened }])

    return (
      <div className="navbar">
        <h1 className="navbar__title">Jude</h1>
        <div className="material-switch navbar__switch">
          <input
            id="navbarSwitch"
            type="checkbox"
            checked={isSelectorOpened}
            onChange={() => this.updateSwitch(!isSelectorOpened)}
          />
          <label htmlFor="navbarSwitch" />
        </div>
        <div className={appCoverClass} onClick={() => this.updateSwitch(!isSelectorOpened)}/>
        <div
          className={modeSelectorClass}
          tabIndex="1"
          onKeyDown={(e) => {
            if (e.keyCode === 27) {
              this.updateSwitch(!isSelectorOpened)
            }
          }}
        >
          <p className="navbar__mode-selector-title">Change Mode</p>

          <div className="navbar__mode-selector-spinner">
            <Spinner active={this.props.loading} />
          </div>

          <div className="form-group form-group--text">
            <div className="form-group__title">
              Server Address
            </div>
            <div className="form-group__body">
              <input type="text" tabIndex="1" ref="serverAddressInput" onChange={this.handleAddressInputChange} />
            </div>
          </div>

          <div className="form-group form-group--type">
            <div className="form-group__title">
              Type
            </div>
            <div className="form-group__body" onChange={this.handleModeTypeChange}>
              <label className="radio-label" htmlFor="hostRadio">
                <input type="radio" name="toggle" value="host" id="hostRadio" tabIndex="2" />
                <span>Host</span>
              </label>
              <label className="radio-label" htmlFor="clientRadio">
                <input type="radio" name="toggle" value="client" id="clientRadio" tabIndex="3" />
                <span>Client</span>
              </label>
              <div className="clearfix"></div>
            </div>
          </div>

          <div className="buttons">
            <button
              className="button"
              tabIndex="5"
              onClick={() => this.updateSwitch(false)}
            >
              Cancel
            </button>
            <button
              className="button button--apply"
              tabIndex="4"
              onClick={this.handleModeSelectorApplyButton}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    )
  }
}

NavBar.propTypes = {}
NavBar.defaultProps = {}

export default NavBar
