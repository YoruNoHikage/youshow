/* global _paq */
import React, { Component } from 'react';
import { render } from 'react-dom';
import firebase from 'firebase';
import history from './history';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

import Page from './Page';

firebase.initializeApp({
  apiKey: 'AIzaSyDsARAOy8nWQpyQbF79fT3tXezPvnGnj2A',
  databaseURL: 'https://youshow-5c5fa.firebaseio.com/',
});

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

    const reg = /^\/watch\/([a-zA-Z0-9\-_]+)$/;

    if(reg.test(location.pathname)) {
      route = 'video';
      params.id = location.pathname.match(reg)[1];
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

registerServiceWorker();

