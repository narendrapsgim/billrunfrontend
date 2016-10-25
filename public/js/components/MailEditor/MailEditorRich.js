import React from 'react';

export default class RichEditorExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showWYSIWYG: false
    };

    this.onChange = this.onChange.bind(this);
    this.initEditor = this.initEditor.bind(this);
  }

  onChange(editorContent) {
    this.props.onChange(editorContent);
  }

  initEditor() {
    var self = this;

    function toggle() {
      window.CKEDITOR.replace(self.props.editorName,
        {
          customConfig: 'config-br.js',
          toolbar: "Basic",
          // width: 870,
          height: 250,
          extraPlugins: 'placeholder,placeholder_select',
          placeholder_select: {
            placeholders: self.props.fields
          }

        });

      window.CKEDITOR.instances.editor.on('blur', function () {
        let data = window.CKEDITOR.instances.editor.getData();
        self.props.onChange(data);
      });

      self.setState({showWYSIWYG: true});
    }

    if (!this.state.showWYSIWYG) {
      window.setTimeout(toggle, 100);
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
