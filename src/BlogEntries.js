import React from 'react'
import './App.css'
import RaisedButton from 'material-ui/RaisedButton'
import { Redirect, Link } from 'react-router-dom'
import {convertFromRaw, convertToRaw} from 'draft-js'


class BlogEntries extends React.Component {
  constructor(props) {
    super(props)
    // needs to call backend to get Blog Entry objects
    this.state = {
      entries: []
    }
    // so backend returns Blog Entry objects
  }

  componentDidMount() {
    // get the entries from the API
    fetch('http://localhost:5000/posts')
      .then((res) => res.json())
      .then((response) => {
      this.setState({ entries: response });
    })
    
    
    // let res = fetch('http://localhost:5000/posts');
    // this.setState({ entries: res });
    
  }

  displayPosts = (posts) => {
    console.log("these are the posts in displayPosts", posts)
    if(posts.length){
      return posts.map((post) => {
        return (
          <div className="editor">
            <div dangerouslySetInnerHTML={{ __html: post.title }} />
            <div dangerouslySetInnerHTML={{ __html: post.body }} />          
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
