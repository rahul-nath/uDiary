import React from 'react'
import moment from 'moment'
import './App.css'
import RaisedButton from 'material-ui/RaisedButton'
//import FlatButton from 'material-ui/FlatButton'
import { Link } from 'react-router-dom'
//import {convertFromRaw, convertToRaw} from 'draft-js'


class BlogEntries extends React.Component {
  constructor(props) {
    super(props)
    const { entries, rahul, match } = this.props
    this.state = {
      entries: entries,
      rahul: rahul,
      category: match ? match.params.category : ''
    }
  }

  componentWillReceiveProps(newProps)  {
    const { entries, match } = newProps
    this.setState({
      entries: (entries ? entries : []),
      category: match ? match.params.category : ''  
    })
  }

  displayPosts = (posts) => posts && posts.map((post, i) => {
    const newBody = post.body.split('<p><br></p>').join(' ')
    return (
      <div className="editor" key={i}>
        <div className="date">{moment(post.date_added).format("MM/DD/YYYY")}</div>
        <div dangerouslySetInnerHTML={{ __html: post.title }} />
        <div dangerouslySetInnerHTML={{ __html: newBody }} />
        { this.state.rahul &&
          (<RaisedButton
            label="Edit"
            containerElement={
              <Link to={{ pathname: `/edit-post/${post.id}`, state: { post: post }}}/>
            }
          />)
        }
        <hr/>
      </div>
    )
  })


  render() {
    const { rahul, entries, category } = this.state
    return (
      <div>
        { rahul &&
          (<div className="button">
            <RaisedButton
              label="Create Post"
              containerElement={<Link to={{ pathname: "/new-post", category }}/>}
            />
          </div>)
        }
         <div>
          {this.displayPosts(entries)}
        </div>
      </div>
     )
  }
}

export default BlogEntries
