import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import YouTube from 'react-youtube';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import AvPlay from 'material-ui/svg-icons/av/play-arrow';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import TimeAgo from 'react-timeago';

import Editor from './Editor';
import SocialIcons from './SocialIcons';

import * as colors from 'material-ui/styles/colors';

import MyTheme from './theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import history from './history';

const myTheme = getMuiTheme(MyTheme);

try { // to avoid Hot Reload error
  injectTapEventPlugin();
} catch(e) {}

const getYouTubeVideoId = function(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

const random = parseInt(Math.random() * 2);
const contributors = [
  <a style={{color: colors.grey500}} href="https://twitter.com/YoruNoHikage">YoruNoHikage</a>,
  <a style={{color: colors.grey500}} href="https://twitter.com/Brindesable">Brindesable</a>
];

export default class Page extends Component {
  constructor() {
    super();
    this.state = {
      videoId: null,
      video: null,
      videoDataLoaded: false,
      isLoading: false,
      start: 0,
      end: 0,
      breakpoints: [],
    };
  }

  fetchVideo(id) {
    this.setState({isLoading: true});

    fetch(`${process.env.YOUSHOW_API}/get.php?id=${id}`, {
      headers: {'Accept': 'application/json'},
    }).then((response) => {
      if(response.ok) {
        return response;
      }

      if(response.status === 404) {
        history.replace('/404');
      }

      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }).then(r => r.json()).then(({ src, minTime, maxTime, buttons = [], createdAt }) => {
      const createdAtDate = new Date(createdAt);
      createdAtDate.setDate(createdAtDate.getDate() + 2);

      this.setState({
        isLoading: false,
        videoId: src,
        start: parseInt(minTime),
        end: parseInt(maxTime),
        breakpoints: buttons.map(({ buttonTitle, buttonTime }) => ({title: buttonTitle, time: buttonTime})),
        expirationDate: createdAtDate,
      });
    }).catch(() => this.setState({
      isLoading: false,
      isSending: false,
      sendingError: true,
    }));
  }

  onPasteVideo(e) {
    const videoId = getYouTubeVideoId(e.target.value);
    this.setState({
      id: null,
      video: null,
      videoId,
    });
    this.forceUpdate();
  }

  onVideoDataLoaded() {
    this.setState({videoDataLoaded: true});
  }

  componentDidUpdate() {
    if(this.state.videoDataLoaded) {
      document.title = this.state.video.getVideoData().title + ' - ' + document.title;
      return;
    }
    document.title = 'YouShow';
  }

  componentWillReceiveProps({ route, params }) {
    if(params.id && params.id != this.props.params.id) {
      this.fetchVideo(params.id);
    }
    if(route === '404') {
      this.setState({
        videoId: 'dQw4w9WgXcQ',
        start: 0,
        end: 0,
        breakpoints: [
          {title: "Never Gonna Give You Up", time: 43},
          {title: "Never Gonna Let You Down", time: 45},
          {title: "Never Gonna Run Around", time: 47},
          {title: "Never Gonna Make You Cry", time: 51},
          {title: "Never Gonna Say Goodbye", time: 53},
          {title: "Never Gonna Tell A Lie", time: 56},
        ]
      });
    } else if(route === 'home') {
      this.setState({
        videoId: null,
        video: null,
        videoDataLoaded: false,
        isLoading: false,
        start: 0,
        end: 0,
        breakpoints: [],
      });
    }
  }

  render() {
    const { route, params } = this.props;
    const { videoId, isLoading } = this.state;

    const id = this.state.id || params.id;
    const url = this.state.url || (params.id && window.location.toString()); // :/

    return (
      <MuiThemeProvider muiTheme={myTheme}>
        <div style={{background: colors.grey900, minHeight: '100%', overflow: 'auto', fontFamily: 'Roboto, sans-serif', color: 'white'}}>
          <div style={{
              minHeight: videoId && !isLoading ? '0' : '100vh',
              minWidth: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: route === 'video' && !isLoading ? 'none' : colors.red500,
              boxShadow: route === 'video' && !isLoading ? 'none' : '0px 1px 6px rgba(0, 0, 0, 0.12), 0px 1px 4px rgba(0, 0, 0, 0.12)',
              transition: 'min-height 1.5s ease, background-color 300ms ease',
              transitionDelay: route === 'video' && !isLoading ? '0s, 1.5s' : '300ms, 0s',
              padding: '15px'}}>
            <div style={{textAlign: 'center', maxWidth: '640px', width: '100%'}}>
              <h1 style={{
                  transition: 'all 1.5s ease',
                  transitionDelay: route === 'video' && !isLoading ? '0s' : '300ms',
                  textAlign: 'center',
                  fontSize: route === 'home' || isLoading ? '5em' : '3em',
                  margin: route === 'home' || isLoading ? '' : '0'}}>
                <a style={{
                    textDecoration: 'none',
                    color: route === 'video' && !isLoading ? colors.grey600 : 'white',
                    transition: 'color 300ms ease',
                    transitionDelay: route === 'video' && !isLoading ? '1.5s' : '0s',
                }} href="/" onClick={(e) => {e.preventDefault(); history.push('/'); return false;}}>
                  You
                  <span style={{
                    color: route === 'video' && !isLoading ? colors.grey900 : colors.red500,
                    background: route === 'video' && !isLoading ? colors.grey600 : 'white',
                    transition: 'color 300ms ease, background-color 300ms ease',
                    transitionDelay: route === 'video' && !isLoading ? '1.5s' : '0s',
                    borderRadius: '.5em',
                    marginLeft: '5px',
                    padding: '5px',
                  }}>Show</span>
                </a>
              </h1>
              {route === 'home' &&
                <Paper style={{margin: 'auto', display: 'flex'}}>
                  <IconButton>
                    <AvPlay />
                  </IconButton>
                  <TextField style={{flex: '1'}} underlineShow={false} fullWidth={true} onChange={this.onPasteVideo.bind(this)} hintText="http://youtube.com/watch?v=" />
                  {videoId && !this.state.video ?
                    <CircularProgress size={0.5} />
                    :
                    null
                  }
                </Paper>
              }
              {route === 'video' && isLoading &&
                <CircularProgress color="white" />
              }
              {route === '404' && <p>404</p>}
            </div>
          </div>
          {videoId &&
            <div style={{minWidth: '280px', maxWidth: '800px', textAlign: 'center', margin: 'auto', marginTop: '1.5em', padding: '0 12px'}}>
              <div className="responsive-iframe" style={{marginLeft: '-12px', marginRight: '-12px'}}>
                <YouTube
                  className="block"
                  videoId={videoId}
                  onReady={({ target : video }) => {
                    video.getVideoData(); // load the data asynchronously
                    this.setState({video});
                  }}
                  onStateChange={({ target : video }) => !this.state.videoDataLoaded && video.getVideoData().title && this.onVideoDataLoaded()}
                  opts={{
                    playerVars: {
                      autoplay: 1,
                      start: this.state.start,
                      end: this.state.end,
                    }
                  }} />
              </div>
              {this.state.video && route === 'home' && <Editor video={this.state.video} videoId={videoId} onVideoSent={(id, url) => this.setState({id, url})} />}
              {this.state.video && (route === 'video' || route === '404') && this.state.breakpoints.length > 0 && (
                <div style={{margin: '1.5em 0'}}>
                  Go to :
                  {this.state.breakpoints.map(
                    b => <RaisedButton primary={true} label={b.title} style={{margin: '5px'}} onTouchTap={() => this.state.video.seekTo(b.time)} />
                  )}
                </div>
              )}
              {id && (this.state.videoDataLoaded ? <SocialIcons title={`${this.state.video.getVideoData().title} via #YouShow`} shareUrl={url} /> : <CircularProgress size={0.5} />)}
              {id && this.state.expirationDate && <p>Expires within <TimeAgo date={this.state.expirationDate} formatter={(value, unit) => `${value} ${unit}${value > 1 ? 's': ''}`} /></p>}
              <div style={{color: colors.grey800, marginTop: '50px', marginBottom: '50px'}}>
                {route === 'video' && !isLoading ?
                  <RaisedButton
                    label="Make my own show"
                    labelStyle={{color: colors.grey500}}
                    onTouchTap={() => history.push('/')}
                  />
                  :
                  <p>
                    Made like this {'╰(•̀ 3 •́)━☆ﾟ.*･｡ﾟ'} by {contributors[random]} and {contributors[(random +1) % 2]}
                  </p>
                }
              </div>
            </div>
          }
        </div>
      </MuiThemeProvider>
    );
  }
}
