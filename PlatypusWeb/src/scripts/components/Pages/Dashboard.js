import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import { deleteAllCookies } from '../../fetchHelpers';
import routes from '../../routes';

function Dashboard() {
  const mainHeight = `${(100 - (60 / (60 + window.screen.availHeight)) * 100).toString()}%`;
  return (
    <div id="content">
      <Grid id="main-grid">
        <Row id="main-grid-row">
          <LeftNav />
          <Main mainHeight={mainHeight} />
        </Row>
      </Grid>
    </div>
  );
}

const LeftNav = () => (
  <Col id="left-nav" xsHidden smHidden md={1}>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {routes.map(route => (
        <li key={route.name}>
          <Link key={route.name} to={route.path}>
            {route.name}
          </Link>
        </li>
      ))}
    </ul>
    <button
      onClick={() => {
        deleteAllCookies();
        window.location.reload();
      }}
    >
      Sign out
    </button>

    {routes.map((route, index) => (
      <Route key={index} path={route.path} exact={route.exact} component={route.sidebar} />
    ))}
  </Col>
);

const Main = props => (
  <Col
    xs={12}
    md={11}
    style={{
      height: props.mainHeight,
      padding: '20px',
      margin: '0px',
      overflowY: 'auto',
    }}
  >
    <div id="main-div">
      {routes.map((route, index) => (
        <Route key={index} path={route.path} exact={route.exact} component={route.main} />
      ))}
    </div>
  </Col>
);

export { Dashboard };
export default Dashboard;
