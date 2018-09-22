import 'draft-js/dist/Draft.css'
import './App.css'
import _ from 'lodash'
import React from 'react'
import { EditorState, ContentState } from 'draft-js'
import  { Redirect } from 'react-router-dom'
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

    let post = this.props.location.state ? this.props.location.state.post : null
    let postState = null
    if(post){
      postState = stateFromHTML(post.title + post.body)
    }

    this.state = {
      editorState: postState
      ? EditorState.createWithContent(postState)
      : EditorState.createEmpty(),
      editing: !!postState,
      redirect: false,
      oldTitle: ""
    }

    this.plugins = [
      addLinkPlugin,
      basicTextStylePlugin,
    ]

    const saveTime = this.state.editorState.getCurrentContent().hasText() ? 2000 : 6000

    this._save = _.debounce(() => this.state.editing ? this._editPost() : this._savePost(), saveTime)
  }

  componentDidMount() {
    this.focus()
    if(this.state.editing){
      const content = this.state.editorState.getCurrentContent()
      this.setState({ oldTitle: this.getTitle(content) })
    }
  }

  getTitle = (content) => {
    let title = Object.assign({}, convertToRaw(content))
    title.blocks.splice(1, title.blocks.length-1)
    let title_html = stateToHTML(convertFromRaw(title))
    return title_html
  }

  onChange = (editorState) => {
    if (editorState.getDecorator() !== null) {
      this.setState({
        editorState,
      });

      if(editorState.getCurrentContent().hasText()){
        this._save()
      }
    }
  }

  focus = () => {
    this.editor.focus()
  }

  createPost = () => {
    let post = {}

    const { editorState, oldTitle } = this.state
    const content = editorState.getCurrentContent()
    const title = this.getTitle(content)

    let body = Object.assign({}, convertToRaw(content))
    body.blocks.splice(0, 1)
    let bodyHtml = stateToHTML(convertFromRaw(body))
    const newBody = bodyHtml ? bodyHtml : <br/>

    const reg = /#(\w+)/
    let category = reg.exec(bodyHtml)
    category = category ? category[0].substring(1) : "random"

    Object.assign(post, {
      'title': (title ? title : ""),
      'old_post_title': oldTitle,
      'body': newBody,
      'category': category
    })
    return post
  }

  _editPost = () => {

    const post = this.createPost()

    fetch('http://localhost:5000/posts/edit', {
      method: "put",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post)
    })
  }

  _savePost = () => {

    const post = this.createPost()
    this.setState({ editing: true })

    fetch('http://localhost:5000/posts/new', {
      method: "post",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post)
    }).catch((error) => {
      this.setState({ editing: false })
    })
  }

  deletePost = () => {
    const post = this.createPost()
    fetch('http://localhost:5000/posts/delete', {
      method: "delete",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post)
    }).then((response) => {
      this.setState({ redirect: true})
    })

  }

  render() {
    const { editorState } = this.state;

    if(this.state.redirect){
      window.location = "/"
    }

    return (
      <div>
        <div className="button">
          <div>
            <RaisedButton label="Save"
            onClick={
              this.state.editing ? this._editPost : this._savePost
            }/>
          </div>
          <div>
            <RaisedButton
              label="Back"
              onClick={() => this.setState({ redirect: true})}
            />
          </div>
          <div>
            <RaisedButton label="Delete" onClick={this.state.editing && this.deletePost}/>
          </div>
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
