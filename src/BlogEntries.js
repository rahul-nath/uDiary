import React from 'react'
import './App.css'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import { Redirect, Link } from 'react-router-dom'
import {convertFromRaw, convertToRaw} from 'draft-js'


class BlogEntries extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entries: this.props.entries
    }
  }

  componentWillReceiveProps(newProps)  {
    this.setState({ entries: (newProps.entries ? newProps.entries : [])})
  }

  displayPosts = (posts) => {
    if(posts){
      return posts.map((post) => {
        return (
          <div className="editor">
            <div dangerouslySetInnerHTML={{ __html: post.title }} />
            <div dangerouslySetInnerHTML={{ __html: post.body }} />          
            <RaisedButton 
              label="Edit"
              containerElement={
                <Link to={{ pathname: `/edit-post/${post.id}`, state: { post: post }}}/>
              }
            />
            <hr/>
          </div>          
        )
      })
    }
  }

  render() {
    return (
      <div>
        <div className="button">
          <RaisedButton label="Create Post" containerElement={<Link to="/new-post"/>}/>
        </div>
         <div>
          {this.displayPosts(this.state.entries)}      
        </div>        
      </div>        
     )
  }
}

export default BlogEntries
