import React from 'react';
import { connect } from 'react-redux';

class RichEditorExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showWYSIWYG: false
    };

    // this.onChange = this.onChange.bind(this);
    this.initEditor = this.initEditor.bind(this);
  }

  /*onChange(editorContent) {
    debugger;
    this.props.onChange(editorContent, this.props.name);
  }*/

  initEditor() {
    let self = this;
    let configPath = self.props.configPath || 'config-br-mails.js';
    let editorName = self.props.editorName;

    function toggleEditor() {
      window.CKEDITOR.replace(editorName,
        {
          customConfig: configPath,
          toolbar: "Basic",
          // width: 870,
          height: self.props.editorHeight || 250,
          extraPlugins: 'placeholder,placeholder_select',
          placeholder_select: {
            placeholders: self.props.fields
          }
        });

      window.CKEDITOR.instances[editorName].on('blur', function () {
        let data = window.CKEDITOR.instances[editorName].getData();
        self.props.onChange(data, self.props.name);
      });

      self.setState({showWYSIWYG: true});
    }

    if (!this.state.showWYSIWYG) {
      window.setTimeout(toggleEditor, 100);
    }
  }

  render() {
    this.initEditor();

    const editorContent = unescape(this.props.value || '');

    return (
      <div>
        <textarea name={this.props.editorName} cols="100" rows="6" defaultValue={editorContent}></textarea>
      </div>
    );
  }
}

export default connect()(RichEditorExample);
