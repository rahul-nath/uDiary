import React from 'react'
import './App.css'
import RaisedButton from 'material-ui/RaisedButton'
//import FlatButton from 'material-ui/FlatButton'
import { Link } from 'react-router-dom'
//import {convertFromRaw, convertToRaw} from 'draft-js'


class BlogEntries extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entries: this.props.entries,
      rahul: this.props.rahul
    }
  }

  componentWillReceiveProps(newProps)  {
    this.setState({ entries: (newProps.entries ? newProps.entries : [])})
  }

  displayPosts = (posts) => posts && posts.map((post, i) => {
    const newBody = post.body.split('<p><br></p>').join(' ')
    return (
      <div className="editor" key={i}>
        <div dangerouslySetInnerHTML={{ __html: post.title }} />
        <div dangerouslySetInnerHTML={{ __html: newBody }} />
        { this.state.rahul ?
          <RaisedButton
            label="Edit"
            containerElement={
              <Link to={{ pathname: `/edit-post/${post.id}`, state: { post: post }}}/>
            }
          />
          : null
        }
        <hr/>
      </div>
    )
  })


  render() {
    return (
      <div>
        { this.state.rahul ?
          <div className="button">
            <RaisedButton label="Create Post" containerElement={<Link to="/new-post"/>}/>
          </div>
          : null
        }
         <div>
          {this.displayPosts(this.state.entries)}
        </div>
      </div>
     )
  }
}

export default BlogEntries
