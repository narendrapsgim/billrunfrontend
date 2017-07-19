import React from 'react';


class TextEditor extends React.Component {

  static defaultProps = {
    fields: [],
    value: '',
    configName: '',
    editorHeight: 250,
  };

  static propTypes = {
    fields: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    editorName: React.PropTypes.string.isRequired,
    configName: React.PropTypes.string,
    editorHeight: React.PropTypes.number,
  };

  state = {
    showWYSIWYG: false,
  }

  componentDidMount() {
    this.initEditor();
  }

  shouldComponentUpdate(nextProps, nextState) {  // eslint-disable-line no-unused-vars
    const { value } = this.props;
    return value !== nextProps.value;
  }

  componentDidUpdate(prevProps, prevState) { // eslint-disable-line no-unused-vars
    this.initEditor();
  }

  componentWillUnmount() {
    const { editorName } = this.props;
    const editor = CKEDITOR && CKEDITOR.instances[editorName];
    if (editor) {
      editor.destroy(true);
    }
  }

  toggleEditor = (editor, editorName, configPath) => {
    console.log(configPath);
    const { fields, editorHeight } = this.props;
    if (editor) {
      editor.destroy(true);
    }
    const ckeditorConfig = {
      customConfig: configPath,
      toolbar: 'Basic',
      // width: 870,
      height: editorHeight,
      placeholder_select: {
        placeholders: fields,
      },
    };

    window.CKEDITOR.replace(editorName, ckeditorConfig);
    window.CKEDITOR.dtd.$removeEmpty.i = 0;
    window.CKEDITOR.dtd.$removeEmpty.span = false;

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
    const { configName, editorName } = this.props;
    const editor = CKEDITOR && CKEDITOR.instances[editorName];

    const configPath = (configName.length) ? `br/config/${configName}.js` : '';
    if (!this.state.showWYSIWYG) {
      window.setTimeout(() => this.toggleEditor(editor, editorName, configPath), 100);
    } else if (editor) {
      const editorData = window.CKEDITOR.instances[editorName].getData();
      if (editorData !== unescape(this.props.value)) {
        window.setTimeout(() => this.toggleEditor(editor, editorName, configPath), 100);
      }
    }
  }

  render() {
    const { value, editorName } = this.props;
    const editorContent = unescape(value || '');

    return (
      <div className="TextEditor">
        <textarea name={editorName} cols="100" rows="6" value={editorContent} />
      </div>
    );
  }
}

export default TextEditor;
