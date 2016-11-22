import React from 'react';
import { connect } from 'react-redux';

class MailEditorRich extends React.Component {

  static defaultProps = {
    fields: [],
    value: '',
    configPath: 'config-br-mails.js',
    editorHeight: 250,
  };

  static propTypes = {
    fields: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    editorName: React.PropTypes.string.isRequired,
    configPath: React.PropTypes.string,
    editorHeight: React.PropTypes.number,
  };

  state = {
    showWYSIWYG: false,
  }

  componentDidMount() {
    this.initEditor();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { value } = this.props;
    return value !== nextProps.value;
  }

  componentDidUpdate(prevProps, prevState) {
    this.initEditor();
  }


  toggleEditor = (editor, editorName, configPath) => {
    const { fields, editorHeight } = this.props;
    if (editor) {
      editor.destroy(true);
    }
    const ckeditorConfig = {
      customConfig: configPath,
      toolbar: 'Basic',
      // width: 870,
      height: editorHeight,
      extraPlugins: 'preview,placeholder,placeholder_select,tableresize,sourcedialog,btgrid',
      placeholder_select: {
        placeholders: fields,
      },
    };
    window.CKEDITOR.replace(editorName, ckeditorConfig);

/*    window.CKEDITOR.instances[editorName].on('blur', () => {
      const data = window.CKEDITOR.instances[editorName].getData();
      this.props.onChange(data, self.props.name);
    });
*/
    window.CKEDITOR.instances[editorName].on('change', () => {
      const data = window.CKEDITOR.instances[editorName].getData();
      this.props.onChange(data);
    });

    this.setState({ showWYSIWYG: true });
  }

  initEditor = () => {
    const { configPath, editorName } = this.props;
    const editor = CKEDITOR && CKEDITOR.instances[editorName];

    if (!this.state.showWYSIWYG) {
      window.setTimeout(() => this.toggleEditor(editor, editorName, configPath), 100);
    } else {
      if (editor) {
        const editorData = window.CKEDITOR.instances[editorName].getData();
        if (editorData !== unescape(this.props.value)) {
          window.setTimeout(() => this.toggleEditor(editor, editorName, configPath), 100);
        }
      }
    }
  }

  render() {
    const { value, editorName } = this.props;
    const editorContent = unescape(value || '');

    return (
      <div className="MailEditorRich">
        <textarea name={editorName} cols="100" rows="6" value={editorContent} />
      </div>
    );
  }
}

export default connect()(MailEditorRich);
