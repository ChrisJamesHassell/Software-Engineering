import React from 'react';
import {
  Button, Grid, Row, Col, Alert, Modal,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Route, Redirect } from 'react-router-dom';
import LoginForm from '../Forms/LoginForm';
import SignupForm from '../Forms/SignupForm';
import logo from '../../../images/icons/icon_circle_white.svg';
// import { setUserData, CategoryFilters, setCategoryFilter } from '../../actions/actions';

const LoginMobileContent = props => (
  <Col id="login-logo" smHidden mdHidden lgHidden xs={12}>
    <div>
      <img src={props.logoUrl} id="logo-hidden" alt="white logo" />
    </div>
    <div id="login-logo-brand">
      <span id="brand-platy">platy</span>
      <span id="brand-pus">pus</span>
    </div>
  </Col>
);

const LoadingModal = props => (
  <Modal show={props.loading}>
    <Modal.Body>
      <b>Loading...</b>
    </Modal.Body>
  </Modal>
);

const LoginLargeContent = () => (
  <Col id="login-extra" xsHidden md={8}>
    <div>
      <h1>Organize.</h1>
      <h1>Plan.</h1>
      <h1>Live.</h1>
      <p>
        Hey, adulting is hard. We get it. That's why Platypus provides a sleek, modern interface to
        help you adult at maximum efficiency.
      </p>
      <p>
        <Button bsStyle="success" bsSize="large">
          Learn More
        </Button>
      </p>
    </div>
  </Col>
);

const RowSpacer = () => <Row id="row-space" />;

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: '',
      loading: false,
    };
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    this.setState({ error: '' })
  }

  login(route, data) {
    this.setState({ loading: true });
    const opts = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    fetch(route, opts)
      // If not valid, skips rest and goes to catch
      .then(response => this.validateResponse(response))
      .then(validResponse => validResponse.json())
      .then(jsonResponse => this.handleJsonResponse(jsonResponse))
      .catch(error => this.logError(error));
  }

  validateResponse = (result) => {
    if (!result.ok) throw Error(result.statusText);
    return result;
  };

  handleJsonResponse(response) {
    this.setState({ loading: false });
    const isSuccess = response.status === 'SUCCESS';

    if (isSuccess) {
      const data = Object.assign({}, response.data);
      Object.keys(data).forEach((key) => {
        const value = JSON.stringify(data[key]);
        localStorage.setItem(key, value);
      });
      this.setState({ redirect: true });
      const {
        data: { documents, events, tasks },
      } = response;

      this.props.dispatch({
        type: 'ADD_DOCUMENTS',
        payload: documents,
      });
      this.props.dispatch({
        type: 'ADD_EVENTS',
        payload: events,
      });
      this.props.dispatch({
        type: 'ADD_TASKS',
        payload: tasks,
      });
    }
    else this.logError(response.message);
  }

  logError(error) {
    this.setState({ loading: false });
    let err = error.toString();
    if (err.includes('Failed to fetch')) err = 'There was a problem connecting to the server. Please contact the service administrator.';
    this.setState({ error: err });
  }

  clearErrorAlert() {
    this.setState({ error: '' });
  }

  render() {
    const isLogin = this.props.location.pathname === '/login';
    const { redirect } = this.state;

    if (redirect) {
      window.location.reload();
      return <Redirect to="/dashboard" />;
    }
    return (
      <div id="login-container">
        <LoadingModal loading={this.state.loading} />
        <Grid id="row-container">
          <RowSpacer />
          <Row id="login">
            <LoginLargeContent />
            <LoginMobileContent logoUrl={`${window.location.origin}/${logo}`} />
            <Col id="login-creds" xs={12} md={4}>
              <div>
                <Route
                  exact
                  path="/login"
                  render={props => (
                    <LoginForm
                      {...props}
                      login={this.login}
                      clearErrorAlert={this.clearErrorAlert.bind(this)}
                    />
                  )}
                />
                <Route
                  path="/login/signup"
                  render={props => (
                    <SignupForm
                      {...props}
                      login={this.login}
                      clearErrorAlert={this.clearErrorAlert.bind(this)}
                    />
                  )}
                />
                <Alert bsStyle="danger" hidden={!this.state.error}>
                  {this.state.error}
                </Alert>
                <div id="login-links">
                  <LinkContainer to="/login">
                    <Button bsStyle="link" disabled={isLogin}>
                      Login
                    </Button>
                  </LinkContainer>{' '}
                  or
                  <LinkContainer to="/login/signup">
                    <Button bsStyle="link" disabled={!isLogin}>
                      {' '}
                      Sign Up
                    </Button>
                  </LinkContainer>
                </div>
                <div />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default connect()(Login);
