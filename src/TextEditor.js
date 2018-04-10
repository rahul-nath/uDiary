import 'draft-js/dist/Draft.css'
import './App.css'
import React from 'react'
import { EditorState } from 'draft-js'
import { Link } from 'react-router-dom'
import {convertFromRaw, convertToRaw} from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import basicTextStylePlugin from './plugins/basicTextStylePlugin'
import addLinkPlugin from './plugins/addLinkPlugin'
import RaisedButton from 'material-ui/RaisedButton'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'

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

  savePost = () => {
    let post = {}

    const editorState = this.state.editorState
    const content = editorState.getCurrentContent()

    let title = Object.assign({}, convertToRaw(content))
    title.blocks.splice(1, title.blocks.length-1)
    let title_html = stateToHTML(convertFromRaw(title))

    Object.assign(post, {'title': title_html})

    let body = Object.assign({}, convertToRaw(content))
    body.blocks.splice(0, 1)
    let body_html = stateToHTML(convertFromRaw(body))

    Object.assign(post, {'body': body_html})


    /* TODO: 
        - create an edit button that sends all the posts into the TextEditor
        - work on converting the returned blog post into an EditorState object
        - to reconvert the html after you get it from the DB use this:
        - convertToRaw(stateFromHTML(post.title + post.body))

        - expand the length of a blog post title (look at the migration page)
        - https://blog.miguelgrinberg.com/post/flask-migrate-alembic-database-migration-wrapper-for-flask
    */  

    fetch('http://localhost:5000/posts/new', {
      method: "post",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post)
    }).then((response) => response)
  }

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <div className="button">
          <RaisedButton label="Save Post" onClick={this.savePost}/>
        </div>
        <div className="button">
          <RaisedButton label="Discard Post" containerElement={<Link to="/blog-entries"/>}/>
        </div>
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            plugins={this.plugins}
            ref={(element) => { this.editor = element }}
            placeholder="What's on your mind?"
            spellCheck
          />
        </div>
      </div>      
    )
  }
}

export default TextEditor
