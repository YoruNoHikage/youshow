import React, { Component } from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
import IconButton from 'material-ui/lib/icon-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ActionAutoRenew from 'material-ui/lib/svg-icons/action/autorenew';
import ContentCopy from 'material-ui/lib/svg-icons/content/content-copy';
import CircularProgress from 'material-ui/lib/circular-progress';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import SocialIcons from './SocialIcons';

import * as colors from 'material-ui/lib/styles/colors';

import history from './history';

// thanks http://stackoverflow.com/a/6313008
function toHHMMSS(seconds) {
    var sec_num = parseInt(seconds, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return hours + ':' + minutes + ':' + seconds;
}

export default class Editor extends Component {
  constructor() {
    super();
    this.state = {
      isSending: false,
      sendingError: false,
      start: 0,
      end: 0,
      breakpoints: [],
      justCopied: false,
    };
  }

  addBreakpoint(time) {
    if(time > this.state.start && (time < this.state.end || this.state.end === 0)) {
      this.setState({
        breakpoints: [
          ...this.state.breakpoints,
          {title: toHHMMSS(time), time}
        ].sort((a, b) => b.time < a.time),
      });
    }
  }

  changeBreakpointTitle({ time, title }, newTitle) {
    this.setState({
      breakpoints: [
        ...this.state.breakpoints.filter(b => b.time !== time),
        {title: newTitle, time}
      ].sort((a, b) => b.time < a.time),
    });
  }

  setStart(time) {
    if(this.state.end >= time || this.state.end === 0) {
      this.setState({
        start: time,
        breakpoints: this.state.breakpoints.filter(b => b.time > time),
      });
    }
  }

  setEnd(time) {
    if(this.state.start <= time) {
      this.setState({
        end: time,
        breakpoints: this.state.breakpoints.filter(b => b.time < time),
      });
    }
  }

  sendVideo() {
    this.setState({
      isSending: true,
      sendingError: false,
    });
    fetch('http://api.youshow.yorunohikage.fr/post.php', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        src: this.props.videoId,
        title: "No title for now",
        minTime: this.state.start,
        maxTime: this.state.end || null,
        buttons: this.state.breakpoints.map(b => ({
          buttonTitle: b.title,
          buttonTime: b.time,
        })),
      }),
    }).then((response) => {
      console.log(response);
      if(response.ok) {
        return response;
      }

      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }).then(r => r.json()).then(({ id }) => {
      const url = window.location.origin + history.createPath('/watch/' + id);
      this.setState({url, isSending: false});
      this.props.onVideoSent(id, url);
    }).catch(() => this.setState({
      isSending: false,
      sendingError: true,
    }));
  }

  render() {
    const { video } = this.props;

    const duration = video.getDuration() || 1,
          start = this.state.start / duration * 100,
          end = (this.state.end / duration * 100) || 100,
          diffStartToEnd = end - start;

    const buttonStyle = {
      margin: 12,
    };

    const removeBreakpointFromState = (time) => {
      this.setState({
        breakpoints: this.state.breakpoints.filter(b => b.time !== time),
      });
    };

    const renderPoint = (time, color, removable = true) => {
      const left = time / duration * 100;
      return (
        <span key={time} style={{position: 'absolute', top: '-100%', left: `${left}%`, width: 10, transform: 'translate(-50%)', cursor: 'pointer'}}>
          <span
            onTouchTap={() => video.seekTo(time)}
            style={{position: 'absolute', left: '0', right: '0', bottom: '0', top: '0'}} />
          <span style={{display: 'block', background: color, height: 15, width: '50%', margin: 'auto'}} />
          {removable && <span
            onTouchTap={() => removeBreakpointFromState(time)}
            style={{position: 'absolute', color: 'white', transform: 'translate(-50%)', fontSize: '1.5rem', lineHeight: '.8'}}>
            &times;
          </span>}
        </span>
      );
    };

    if(this.state.isSending) {
      return <CircularProgress size={0.5} />;
    }

    if(this.state.sendingError) {
      return (
        <div style={{fontFamily: 'Roboto, sans-serif', color: 'white'}}>
          <p>Oh no! Something's wrong... Try resending it!</p>
          <FloatingActionButton onTouchTap={this.sendVideo.bind(this)}>
            <ActionAutoRenew />
          </FloatingActionButton>
        </div>
      );
    }

    if(this.state.url) {
      return (
        <div>
          <Paper style={{display: 'flex', margin: '20px auto'}}>
            <IconButton onClick={() => {
                this.refs.url.input.select();
                document.execCommand("copy");
                this.setState({justCopied: true});
              }}>
              <ContentCopy />
            </IconButton>
            <TextField onBlur={() => this.setState({justCopied: false})} ref="url" onClick={() => this.refs.url.input.select()} underlineShow={false} fullWidth={true} value={this.state.url} />
            {this.state.justCopied && <span style={{padding: 12, color: colors.grey500}}>Copied!</span>}
            {this.state.id && <SocialIcons shareUrl={this.state.url} />}
          </Paper>
        </div>
      );
    }

    return (
      <div>
        <div style={{padding: '5px 0'}}>
          <div style={{height: 5, position: 'relative', background: 'rgba(0,0,0,0.5)', margin: 12}}>
            <div style={{height: 5, position: 'absolute', background: colors.red600, left: `${start}%`, width: `${diffStartToEnd}%`}} />
            {renderPoint(this.state.start, colors.grey400, false)}
            {renderPoint(this.state.end || duration, colors.grey400, false)}
            {this.state.breakpoints.map(b => renderPoint(b.time, colors.red500))}
          </div>
        </div>
        <div>
          <RaisedButton secondary={true} label="Set Start" style={buttonStyle} onTouchTap={() => this.setStart(parseInt(video.getCurrentTime()))} />
          <RaisedButton secondary={true} label="Set End" style={buttonStyle} onTouchTap={() => this.setEnd(parseInt(video.getCurrentTime()))} />
          <RaisedButton secondary={true} label="Add Breakpoint" style={buttonStyle} onTouchTap={() => this.addBreakpoint(parseInt(video.getCurrentTime()))} />
        </div>
        {this.state.breakpoints.map(b => (
          <div>
            <TextField
              inputStyle={{color: 'white'}}
              hint="Breakpoint Title"
              defaultValue={b.title}
              key={parseInt(b.time * 100) / 100}
              onChange={(e) => this.changeBreakpointTitle(b, e.target.value)} />
          </div>
        ))}
        <div style={{margin: '25px 0'}}><Divider /></div>
        <RaisedButton primary={true} label="Send My Show" onTouchTap={this.sendVideo.bind(this)} />
      </div>
    );
  }
}
