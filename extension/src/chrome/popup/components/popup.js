import moment from 'moment';
import React from 'react';

import { Card } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import FormHelperText from '@material-ui/core/FormHelperText';

import InfoBox from './infoBox';
import Settings from './settings';
import GetCSV from './getCSV';

import config from '../../../config';

// bo is the browser object, in chrome is named 'chrome', in firefox is 'browser'
const bo = chrome || browser;

const styles = {
    width: '400px',
    backgroundColor: 'black',
    color: 'white'
};

class Popup extends React.Component {
  constructor (props) {
      super(props);
      this.state = { status: 'fetching' };
      try {
        bo.runtime.sendMessage({ type: 'localLookup' }, (userSettings) => {
          console.log('here got', userSettings);
          if (userSettings && userSettings.publicKey) { this.setState({ status: 'done', data: userSettings }); } else { this.setState({ status: 'error', data: userSettings }); }
        });
      } catch (e) {
        console.log('catch error', e.message);
        this.state = { status: 'error', data: ''};
      }
    }

  render () {
      const version = config.VERSION;
      const timeago = moment.duration(moment() - moment(config.BUILDISODATE)).humanize() + ' ago';

      if (!this.state) { return (<div>Loading...</div>); };

      console.log('popup props status', this.props, this.state);

      if (this.state.status !== 'done') {
        console.log('Incomplete info before render');
        return (
          <div style={styles}>
            <Card>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Librevent isn't initialized you should access <a href="https://www.facebook.com" target="_blank">facebook.com</a>, also because this tool works only in Facebook events page.
                </Alert>
                <InfoBox />
            </Card>
          </div>
        );
      }

      return (
        <div style={styles}>
          <Card>
              <FormHelperText>This works only on events page, <a href='https://www.facebook.com/events/795277934295961' target='_blank'>like this</a>.</FormHelperText>
              <Settings active={this.state.data.active} />
              <FormHelperText>See, Review or Delete the data you sent</FormHelperText>
              <GetCSV publicKey={this.state.data.publicKey } />
              <FormHelperText>External Links</FormHelperText>
              <InfoBox />
          </Card>
          <small>version {version}, released {timeago}</small>
        </div>
      );
    }
}

export default Popup;
