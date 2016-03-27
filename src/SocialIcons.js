import React from 'react';

import {
  ShareButtons,
  generateShareIcon
} from 'react-share';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook'),
      TwitterIcon = generateShareIcon('twitter'),
      GooglePlusIcon = generateShareIcon('google'),
      LinkedinIcon = generateShareIcon('linkedin');

const styles = {display: 'inline-block', margin: 10, cursor: 'pointer'};

const SocialIcons = ({ title, shareUrl }) => (
  <div>
    <FacebookShareButton style={styles} url={shareUrl} title={title}>
      <FacebookIcon size={32} round={true} />
    </FacebookShareButton>
    <TwitterShareButton style={styles} url={shareUrl} title={title}>
      <TwitterIcon size={32} round={true} />
    </TwitterShareButton>
    <GooglePlusShareButton style={styles} url={shareUrl}>
      <GooglePlusIcon size={32} round={true} />
    </GooglePlusShareButton>
    <LinkedinShareButton style={styles} url={shareUrl} title={title}>
      <LinkedinIcon size={32} round={true} />
    </LinkedinShareButton>
  </div>
);

export default SocialIcons;
