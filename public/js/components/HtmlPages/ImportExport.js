import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import DownloadIcon from 'material-ui/svg-icons/file/cloud-download';
import UploadIcon from 'material-ui/svg-icons/file/cloud-upload';
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
    this.onImportClick = this.onImportClick.bind(this);
    this.onExportClick = this.onExportClick.bind(this);
  }

  onImportClick(e){
    let form = this.refs['importForm'];
    if(e.target.files.length){
      console.log("form to submit: ", form);
      console.log("File to upload : ", e.target.files[0]);
    }
  }

  onExportClick(e){
    console.log("Export, e : ", e);
  }

  render() {
    return (
      <div className="jumbotron hero-unit">
        <h3>Import / Export</h3>
        <Paper zDepth={1} style={styles.content}>
          <RaisedButton
            label="Import"
            labelPosition="before"
            primary={true}
            style={styles.button}
            icon={<UploadIcon />}
          >
          <form ref="importForm" encType="multipart/form-data" action="http://billrunmt.local/" method="POST">
            <input type="file" style={styles.exampleImageInput} onChange={this.onImportClick}/>
          </form>
          </RaisedButton>

           <Divider />
          <RaisedButton
            label="Export"
            labelPosition="before"
            primary={true}
            icon={<DownloadIcon />}
            style={styles.button}
            onClick={this.onExportClick}
          />
        </Paper>
     </div>
    );
  }
}


/*

*/
