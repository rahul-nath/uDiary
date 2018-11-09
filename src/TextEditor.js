import 'draft-js/dist/Draft.css'
import './App.css'
import _ from 'lodash'
import React from 'react'
import { EditorState } from 'draft-js'
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

    const post = this.props.location.state ? this.props.location.state.post : null
    const { id } = this.props.match.params
    let postState
    if(post){
      postState = stateFromHTML(post.title + post.body)
    }
    this.state = {
      id: id ? id : 0,
      editorState: postState
      ? EditorState.createWithContent(postState)
      : EditorState.createEmpty(),
      redirect: false,
      oldTitle: ""
    }

    this.plugins = [
      addLinkPlugin,
      basicTextStylePlugin,
    ]

    const saveTime = this.state.editorState.getCurrentContent().hasText() ? 1000 : 3000

    this._save = _.debounce(() => this.state.id ? this._editPost(this.state.id) : this._savePost(), saveTime)
  }


  componentDidMount() {
    this.focus()
    if(this.state.id){
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

    const { editorState, oldTitle, id } = this.state
    const content = editorState.getCurrentContent()
    const title = this.getTitle(content)

    // if(title === "<p><br></p>") return post

    let body = Object.assign({}, convertToRaw(content))
    body.blocks.splice(0, 1)

    if(!body.blocks.length) return post

    let bodyHtml = stateToHTML(convertFromRaw(body))
    const newBody = bodyHtml ? bodyHtml : <br/>

    const reg = /#(\w+)/
    let category = reg.exec(bodyHtml)
    console.log("this is test category", category)
    category = category ? category[0].substring(1) : "random"

    // const reg = /#[\w-]+(?:\s+#[\w-]+)*/
    // let categories = reg.exec(bodyHtml)
    // if(categories.length){
    //   categories = categories[0].replace(' ', '').split('#')
    // }
    // categories = categories.length ? categories : ["random"]
    // categories = categories.filter((category) => category)

    Object.assign(post, {
      'title': title,
      'old_post_title': oldTitle,
      'body': newBody,
      'category': category
    })
    if(id){
      Object.assign(post, { id })
    }
    return post
  }

  _editPost = (postId) => {

    const post = this.createPost()
    fetch(`http://localhost:5000/post/${postId}`, {
      method: "put",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post)
    })
  }

  _savePost = async () => {

    const post = this.createPost()
    if(!Object.keys(post).length) return

    fetch('http://localhost:5000/posts', {
      method: "post",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post)
    })
    .then((response) => response.json())
    .then((result) => {
      this.setState({ id: result.id })
    })
    .catch((error) => {
      this.setState({ id: 0 })
    })
  }

  deletePost = (postId) => {
    const post = this.createPost()
    fetch(`http://localhost:5000/post/${postId}`, {
      method: "delete",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post)
    })
    .then((res) => res.json())
    .then((result) => {
      this.setState({ redirect: true})
    })
  }

  render() {
    const { editorState, id, redirect } = this.state;

    if(redirect){
      window.location = "/"
    }

    return (
      <div>
        <div className="button">
          <div>
            <RaisedButton label="Save"
            onClick={
              !!id ? () => this._editPost(id) : this._savePost
            }/>
          </div>
          <div>
            <RaisedButton
              label="Back"
              onClick={() => this.setState({ redirect: true})}
            />
          </div>
          {
            !!id && (
              <div>
                <RaisedButton label="Delete" onClick={() => this.deletePost(id)}/>
              </div>
            )
          }
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
