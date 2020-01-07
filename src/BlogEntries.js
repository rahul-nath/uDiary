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
    const { categoryId, rahul, match } = this.props
    this.state = {
      category: match ? match.params.category : '',
      entries: [],
      categoryId,
      rahul
    }
  }

  componentDidMount(){
    // TODO: combine the fetch calls into one
    this.fetchPosts(this.state.categoryId)
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState.categoryId !== this.props.categoryId){
      this.setState({ categoryId: this.props.categoryId})
      this.fetchPosts(this.props.categoryId)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { match } = nextProps
    return { category: match ? match.params.category : prevState.category }
  }

  fetchPosts = (categoryId) => {

    const url = (
      categoryId
      ? `${process.env.REACT_APP_API_URL}/categories/${categoryId}`
      : `${process.env.REACT_APP_API_URL}/posts?favorites=true`
    )

    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        const entries = (
          categoryId
          ? [].concat.apply([], response.map((pc) => pc.posts))
          : response
        )
        this.setState({ entries })
        console.log("successfully retrieved posts")
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
