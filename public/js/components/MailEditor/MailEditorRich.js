import React, {Component, PropTypes } from 'react';
import {Editor, EditorState, RichUtils, Modifier, Entity} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import 'draft-js/dist/Draft.css';
import { styleMap } from './helpers/EditorConst';
import {BlockStyleControls, getBlockStyle} from './helpers/EditorBlockTypes';
import {InlineStyleControls} from './helpers/InlineStyleControls';

export default class RichEditorExample extends React.Component {
    constructor(props) {
      super(props);

      let contentState = stateFromHTML('<h1>ttt</h1>');
      this.state = {
        editorState: EditorState.createWithContent(contentState)
      };

      this.focus = () => this.refs.editor.focus();
      this.onChange = this.onChange.bind(this);

      this.handleKeyCommand = (command) => this._handleKeyCommand(command);
      this.onTab = (e) => this._onTab(e);
      this.toggleBlockType = (type) => this._toggleBlockType(type);
      this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
      this.pushPlaceHolder = this.pushPlaceHolder.bind(this);
    }

    _handleKeyCommand(command){
      const {editorState} = this.state;
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return true;
      }
      return false;
    }

    _onTab(e){
      const maxDepth = 4;
      this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType){
      this.onChange(
        RichUtils.toggleBlockType(
          this.state.editorState,
          blockType
        )
      );
    }

    _toggleInlineStyle(inlineStyle){
      this.onChange(
        RichUtils.toggleInlineStyle(
          this.state.editorState,
          inlineStyle
        )
      );
    }

    pushPlaceHolder(event){
      let field = '{' + event.target.dataset.field + '}';
      let editorState = this.state.editorState;
      let currentContent = editorState.getCurrentContent();

      let currentSelectionState = editorState.getSelection();
      let start = currentSelectionState.getStartOffset();
      let end = currentSelectionState.getEndOffset();

      let mentionTextSelection = currentSelectionState.merge({
        anchorOffset: start,
        focusOffset: end
      });

      let entityKey = Entity.create('TOKEN', 'IMMUTABLE', {field: field});
      let mentionReplacedContent = Modifier.replaceText(currentContent, mentionTextSelection, field, null, entityKey);

      let newEditorState = EditorState.push(editorState, mentionReplacedContent, 'insert');

      this.setState({editorState: newEditorState});

      let htmlContent = stateToHTML(newEditorState.getCurrentContent());
      this.props.onChange(htmlContent);

    }

    onChange(editorState){
      this.setState({editorState});
      let htmlContent = stateToHTML(editorState.getCurrentContent());
      this.props.onChange(htmlContent);
    }

    render(){
      const {editorState} = this.state;

      // If the user changes block type before entering any text, we can
      // either style the placeholder or hide it. Let's just hide it now.
      let className = 'RichEditor-editor';
      let contentState = editorState.getCurrentContent();
      if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
          className += ' RichEditor-hidePlaceholder';
        }
      }
      let placeholderFields = this.props.fields;

      return (
        <div className="RichEditor-root">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType} />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle} />

          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              onTab={this.onTab}
              placeholder="Write your email"
              spellCheck={true}
              ref="editor" />
          </div>

          <div className={placeholderFields ? '' : 'hide' }>
            <hr />
            <div className="RichEditor-controls">
              {placeholderFields.map((field, i) =>(
                  <span key={'fields' + (i+1)} className="RichEditor-styleButton" onClick={this.pushPlaceHolder} data-field={field}>{field}</span>
                )
              )}
            </div>
          </div>
        </div>
      );
    }
  }
