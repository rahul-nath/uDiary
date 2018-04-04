import 'draft-js/dist/Draft.css';

import React from 'react';
import { EditorState } from 'draft-js';
import {convertFromRaw, convertToRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import RaisedButton from 'material-ui/RaisedButton';
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

  printContentToConsole = () => {
    const content = this.state.editorState.getCurrentContent()
    const results = convertToRaw(content)
    results.blocks.map((block) => {
      console.log(block.text)
    })
  }



  render() {
    const { editorState } = this.state;
    return (
      <div className="editor" onClick={this.focus}>
        <RaisedButton label="Print Contents" onClick={this.printContentToConsole}/>
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          plugins={this.plugins}
          ref={(element) => { this.editor = element }}
          placeholder="Tell your story"
          spellCheck
        />
      </div>
    )
  }
}

export default TextEditor
