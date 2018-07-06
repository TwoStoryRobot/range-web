import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { SSO_LOGIN_ENDPOINT, SSO_IDIR_LOGIN_ENDPOINT, SSO_BCEID_LOGIN_ENDPOINT } from '../constants/API';
import { ELEMENT_ID, IMAGE_SRC } from '../constants/variables';
import { storeAuthData } from '../actions';

const propTypes = {
  storeAuthData: PropTypes.func.isRequired,
};

export class Login extends Component {
  // Sets up localstorage listener for cross-tab communication since spotify authentication requires the user to be redirected
  // to another page and then redirected back to a return URL with the token.
  componentDidMount() {
    window.addEventListener('storage', this.storageEventListener);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageEventListener);
  }

  storageEventListener = (event) => {
    const authData = JSON.parse(localStorage.getItem(event.key));
    // store the auth data in Redux store
    this.props.storeAuthData(authData);
  }

  openNewTab = link => window.open(link, '_black')
  onLoginBtnClick = () => this.openNewTab(SSO_LOGIN_ENDPOINT)
  onIdirLoginBtnClick = () => this.openNewTab(SSO_IDIR_LOGIN_ENDPOINT)
  onBceidLoginBtnClick = () => this.openNewTab(SSO_BCEID_LOGIN_ENDPOINT)

  render() {
    return (
      <section className="login">
        <img
          className="login__image"
          src={IMAGE_SRC.LOGIN_LOGO}
          alt="login-img"
        />

        <div className="login__title">
          My Range Application
        </div>

        <div className="login__button">
          <Button
            id={ELEMENT_ID.LOGIN_BUTTON}
            primary
            fluid
            onClick={this.onLoginBtnClick}
          >
            Login
          </Button>

          <Button
            id={ELEMENT_ID.LOGIN_IDIR_BUTTON}
            style={{ marginTop: '15px' }}
            primary
            fluid
            onClick={this.onIdirLoginBtnClick}
          >
            Login as Range Staff
          </Button>

          <Button
            id={ELEMENT_ID.LOGIN_BCEID_BUTTON}
            style={{ marginTop: '15px' }}
            primary
            fluid
            onClick={this.onBceidLoginBtnClick}
          >
            Login as Agreement Holder
          </Button>
        </div>
        <a
          className="login__change-link"
          href="https://summer.gov.bc.ca"
          target="_blank"
          rel="noopener noreferrer"
        >
          Is your password expired?
        </a>
      </section>
    );
  }
}

// const mapStateToProps = state => (
//   {
//   }
// );

Login.propTypes = propTypes;
export default connect(null, { storeAuthData })(Login);