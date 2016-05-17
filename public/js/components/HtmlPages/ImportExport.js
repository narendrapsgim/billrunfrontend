import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

const styles = {
  button: {
    margin: 12,
  },
  content:{
    textAlign: 'center',
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};


export default class ImportExport extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="jumbotron hero-unit">
        <h3>Import / Export Rates</h3>
        <Paper zDepth={1} style={styles.content}>
          <RaisedButton
            label="Import Rates"
            labelPosition="after"
            primary={true}
            style={styles.button}
            icon={<UploadIcon />}
          >
            <input type="file" style={styles.exampleImageInput} />
          </RaisedButton>

           <Divider />
          <RaisedButton
            label="Export Rates"
            labelPosition="after"
            primary={true}
            icon={<DownloadIcon />}
            style={styles.button}
          />
        </Paper>
     </div>
    );
  }
}


/*

*/
