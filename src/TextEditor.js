import 'draft-js/dist/Draft.css'
import './App.css'
import _ from 'lodash'
import React, { Component } from 'react'
import { EditorState } from 'draft-js'
import {convertFromRaw, convertToRaw} from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import basicTextStylePlugin from './plugins/basicTextStylePlugin'
import addLinkPlugin from './plugins/addLinkPlugin'
import RaisedButton from 'material-ui/RaisedButton'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'

class TextEditor extends Component {
  constructor(props) {
    super(props)
    const { location, match } = this.props
    const post = location.state ? location.state.post : null
    const editorState = post
      ? EditorState.createWithContent(stateFromHTML(post.title + post.body))
      : (location.category
        ? EditorState.createWithContent(stateFromHTML(`<br/><br/>#${location.category}`))
        : EditorState.moveFocusToEnd(EditorState.createEmpty()))
    const { id } = match.params
    this.state = {
      id: id || 0,
      redirect: false,
      oldTitle: "",
      showDeleteModal: false,
      changesExist: false,
      editorState
    }

    // this cursor problem smh
    // https://stackoverflow.com/questions/43868815/how-to-stop-draftjs-cursor-jumping-to-beginning-of-text

    this.plugins = [
      addLinkPlugin,
      basicTextStylePlugin,
    ]

    const saveTime = this.state.editorState.getCurrentContent().hasText() ? 1000 : 3000
    // The debounce function delays the processing of the keyup event until the user
    // has stopped typing for a predetermined amount of time.
    // This prevents your UI code from needing to process every event
    this._save = _.debounce(() => this.state.id ? this._editPost(this.state.id) : this._savePost(), saveTime)
  }


  componentDidMount() {
    if(this.state.id){
      const content = this.state.editorState.getCurrentContent()
      this.setState({ oldTitle: this.getTitle(content) })
    }
  }

  getTitle = (content) => {
    let title = Object.assign({}, convertToRaw(content))
    // TODO: is splice in-place?
    title.blocks.splice(1, title.blocks.length-1)
    let title_html = stateToHTML(convertFromRaw(title))
    return title_html
  }

  onChange = (editorState) => {
    if (editorState.getDecorator()) {
      this.setState({
        editorState
      })

      if(editorState.getCurrentContent().hasText()){
        this._save()
      }
    }
  }

  createPost = () => {
    let post = {}

    const { editorState, oldTitle, id } = this.state
    const content = editorState.getCurrentContent()
    const title = this.getTitle(content)

    let oldBody = Object.assign({}, convertToRaw(content))
    oldBody.blocks.splice(0, 1)

    if(!oldBody.blocks.length) return post

    let bodyHtml = stateToHTML(convertFromRaw(oldBody))
    const body = bodyHtml ? bodyHtml : <br/>

    const reg = /#(\w+)/
    const fav_regex = /(\*\*\*)/
    let fav = fav_regex.exec(bodyHtml)
    const cat = reg.exec(bodyHtml)

    const favorite = !!fav

    // side: "while arr: arr.pop()" processes arr like a stack
    // ----: "for e in arr:" processes arr like a queue
    const categories = []

    let i = 0
    let newCategory

    while(bodyHtml.indexOf("#") > -1 && reg.exec(bodyHtml)){
      newCategory = reg.exec(bodyHtml)[0]
      bodyHtml = bodyHtml.replace(newCategory, `{${i++}}`)
      categories.push(newCategory.substring(1))
    }

    if(categories.length){
      categories.forEach((category, j) => {
        bodyHtml = bodyHtml.replace(`{${j}}`, `#${category}`)
      })
    } else{
      categories.push("random")
    }
    // 'categories': categories.join(","),
    Object.assign(post, {
      'old_post_title': oldTitle,
      body,
      favorite,
      categories,
      title
    })
    if(id){
      Object.assign(post, { id })
    }
    return post
  }

  _editPost = (postId) => {

    const post = this.createPost()
    fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
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

    fetch(`${process.env.REACT_APP_API_URL}/posts`, {
      method: "post",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post)
    })
    .then((response) => response.json())
    .then((result) => {
      this.state.changesExist
      ? this.setState({ redirect: true })
      : this.setState({ id: result.id })
    })
    .catch((error) => {
      this.setState({ id: 0 })
    })
  }



  deletePost = (postId) => {
    const post = this.createPost()
    fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
      method: "delete",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(post)
    })
    .then((res) => res.json())
    .then((result) => {
      this.setState({
        redirect: true,
        showDeleteModal: !this.state.showDeleteModal
      })
    })
  }

  // TODO: add key bindings for "shift+return" to save
  // https://draftjs.org/docs/advanced-topics-key-bindings
  // https://css-tricks.com/snippets/javascript/javascript-keycodes/
  handleSave = (id) => !!id ? this._editPost(id) : this._savePost()

  handleDeleteModal = () => this.setState({ showDeleteModal: !this.state.showDeleteModal })

  handleBackModal = () => {
    if(this.state.editorState.getCurrentContent().hasText()){
      this.setState({ changesExist: true })
    } else {
      this.setState({ redirect: true })
    }
  }


  handleBack = (save) => {
    if(save){
      this.handleSave(this.state.id)
    }
    this.setState({ redirect: true })
  }

  handleStay = () => this.setState({ showDeleteModal: false, changesExist: false })

  render() {
    const { editorState, id, redirect, showDeleteModal, changesExist } = this.state;

    // TODO: use something safer here
    if(redirect){
      window.location = "/"
    }

    return (
      <div>
        {
          !!id && (
            <div className="delete-button">
              <RaisedButton label="Delete" onClick={this.handleDeleteModal}/>
            </div>
          )
        }
        {
          showDeleteModal && (
            <div className="modal mb5">
              <p>Really? Delete this?</p>
              <RaisedButton className="modal-buttons" label="Ok" onClick={() => this.deletePost(id)}/>
              <RaisedButton label="Cancel" onClick={this.handleDeleteModal}/>
            </div>
          )
        }
        <div className="button">
          {
            changesExist ? (
              <div className="modal mb5 db">
                <p>Don't you want to save your changes?</p>
                <RaisedButton className="modal-buttons" label="Yes!" onClick={() => this.handleBack("save")}/>
                <RaisedButton className="modal-buttons" label="Lol no." onClick={() => this.handleBack(null)}/>
                <RaisedButton label="Keep me here" onClick={this.handleStay}/>
              </div>
            ) : (
              <RaisedButton
                label="Back"
                onClick={this.handleBackModal}
              />
            )
          }
        </div>
        <div className="editor" onClick={() => this.editor.focus()}>
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
