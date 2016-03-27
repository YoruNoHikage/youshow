import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import YouTube from 'react-youtube';
import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';
import IconButton from 'material-ui/lib/icon-button';
import AvPlay from 'material-ui/lib/svg-icons/av/play-arrow';
import CircularProgress from 'material-ui/lib/circular-progress';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';

import Editor from './Editor';
import SocialIcons from './SocialIcons';

import * as colors from 'material-ui/lib/styles/colors';

import MyTheme from './theme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

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

    fetch(`http://api.youshow.yorunohikage.fr/get.php?id=${id}`, {
      mode: 'cors',
      headers: {'Accept': 'application/json'},
    }).then((response) => {
      if(response.ok) {
        return response;
      }

      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }).then(r => r.json()).then(({ src, minTime, maxTime, buttons }) => {
      this.setState({
        isLoading: false,
        videoId: src,
        start: parseInt(minTime),
        end: parseInt(maxTime),
        breakpoints: buttons.map(({ buttonTitle, buttonTime }) => ({title: buttonTitle, time: buttonTime})),
      });
    }).catch(() => this.setState({
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
    document.title = this.state.video.getVideoData().title + ' - ' + document.title;

    this.setState({videoDataLoaded: true});
  }

  componentWillReceiveProps({ route, params }) {
    if(params.id && params.id != this.props.params.id) {
      this.fetchVideo(params.id);
    }
    if(route === '404') {
      this.setState({
        videoId: '_NXrTujMP50',
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
        <div style={{background: colors.grey900, minHeight: '100%', overflow: 'auto'}}>
          <div style={{
              minHeight: videoId && !isLoading ? '0' : '100vh',
              minWidth: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: colors.red500,
              boxShadow: '0px 1px 6px rgba(0, 0, 0, 0.12), 0px 1px 4px rgba(0, 0, 0, 0.12)',
              transition: 'min-height 1.5s ease 0s',
              padding: '15px'}}>
            <div style={{textAlign: 'center', maxWidth: '640px', width: '100%'}}>
              <h1 style={{
                  transition: 'all 1.5s ease 0s',
                  fontFamily: 'Roboto, sans-serif',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: route === 'home' || isLoading ? '5em' : '3em',
                  margin: route === 'home' || isLoading ? '' : '0'}}>
                <a style={{textDecoration: 'none', color: 'white'}} href="/">
                  You
                  <span style={{color: colors.red500, background: 'white', borderRadius: '.5em', marginLeft: '5px', padding: '5px'}}>Show</span>
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
              {route === '404' &&
                <p>404</p>/*Here with WTF breakpoints https://www.youtube.com/watch?v=_NXrTujMP50*/
              }
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
              {this.state.video && route === 'video' && (
                <div style={{fontFamily: 'Roboto, sans-serif', color: 'white', margin: '1.5em 0'}}>
                  Go to :
                  {this.state.breakpoints.map(
                    b => <RaisedButton primary={true} label={b.title} style={{margin: '5px'}} onTouchTap={() => this.state.video.seekTo(b.time)} />
                  )}
                </div>
              )}
              {id && (this.state.videoDataLoaded ? <SocialIcons title={`${this.state.video.getVideoData().title} via #YouShow`} shareUrl={url} /> : <CircularProgress size={0.5} />)}
              <div style={{fontFamily: 'Roboto, sans-serif', color: colors.grey800}}>
                <p>
                  Made like this {'╰(•̀ 3 •́)━☆ﾟ.*･｡ﾟ'} by {contributors[random]} and {contributors[(random +1) % 2]}
                </p>
              </div>
            </div>
          }
        </div>
      </MuiThemeProvider>
    );
  }
}
