import 'draft-js/dist/Draft.css';

import React from 'react';
import { EditorState } from 'draft-js';
import {convertFromRaw, convertToRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import basicTextStylePlugin from './plugins/basicTextStylePlugin';
import addLinkPlugin from './plugins/addLinkPlugin';

class TextEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty(),
    }

    this.plugins = [
      addLinkPlugin,
      basicTextStylePlugin,
    ]
  }

  componentDidMount() {
    this.focus()
  }

  onChange = (editorState) => {
    if (editorState.getDecorator() !== null) {
      this.setState({
        editorState,
      });
    }
  }

  focus = () => {
    this.editor.focus()
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="editor" onClick={this.focus}>
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          plugins={this.plugins}
          ref={(element) => { this.editor = element }}
          placeholder="What's on your mind? "
          spellCheck
        />
      </div>
    )
  }
}

export default TextEditor
