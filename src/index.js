import React, { Component } from 'react';
import { render } from 'react-dom';

import history from './history';

import Page from './Page';

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: 'home',
      location: null,
      params: {},
    };

    this.setRoute = this.setRoute.bind(this);
  }

  componentDidMount() {
    this.setRoute(history.location);
    history.listen(this.setRoute);
  }

  setRoute(location) {
    let route = '404',
        id = null,
        params = {};

    if(/^\/watch\/([a-zA-Z0-9]+)$/.test(location.pathname)) {
      route = 'video';
      params.id = location.pathname.match(/^\/watch\/([a-zA-Z0-9]+)$/)[1];
    } else if(location.pathname === '' || location.pathname === '/') {
      route = 'home';
    }

    _paq.push(['trackPageView']);

    this.setState({location, route, params});
  }

  render() {
    return <Page route={this.state.route} params={this.state.params} />;
  }
}

render(
  <App />,
  document.getElementById('app')
);
