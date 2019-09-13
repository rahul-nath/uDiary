import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import MenuIcon from 'material-ui-icons/Menu'
import IconButton from 'material-ui/IconButton'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import './App.css'
import TextEditor from './TextEditor'
import BlogEntries from './BlogEntries'


const titleStyle = {
  'color': 'black',
  'textAlign': 'center',
  'fontFamily': 'Palatino',
  'fontSize': 25,
}


// const menuStyle = {
//   root: {
//      flexGrow: 1,
//    },
//    grow: {
//      flexGrow: 1,
//    },
//    menuButton: {
//      marginLeft: -12,
//      marginRight: 20,
//    },
// }


// const StyledLink = styled(Link)`
//   color: #228EB6;
//   cursor: pointer;
//   text-decoration: none;
// `

class Main extends Component {

  constructor(props){
    super(props)
    const { rahul } = this.props
    this.state = {
      open: false,
      entries: [],
      category_entries: [],
      favorite_entries: [],
      rahul: rahul
    }
  }

  componentDidMount() {
    // get the entries from the API
    this.getEntries()
    this.getFavoriteEntries()
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.location.state === 'newPost') {
      this.forceUpdate()
    }
  }

  getEntries = () => {
    fetch('http://localhost:5000/posts')
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          entries: response,
          category_entries: response
        });
        console.log("successfully retrieved blog entries")
      })
  }

  getFavoriteEntries = () => {
    fetch('http://localhost:5000/posts/favorites')
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          favorite_entries: response
        })
      })
  }


  /* TODO:

    - create a private view for sharing on twitter
      - move all the stuff currently in App.js to a seperate component
      - create an "are you Rahul?" form
      - just send to the backend. verify there the exact "password"
      - return just a true or false
      - if true, then just set the state for "rahul" to true
      - if not, then any time you list your posts, just check that condition
      - don't render the "Edit button"
      - optional: conditionally render the menu items if "rahul" is false
    - create google analytics for the site
    - host it on heroku

    BUGS:
      - if I change the title of the post, it adds a row instead of editing it

      NICE TO HAVE:
      - as you scroll through the page, the title of the current post is shown in AppBar
      - click on the title of an individual post to just view that post
      - organize backend to models, routes, and app
      - undo a link
      - provide a hover thing for links

    categories:
          "Economics", "New Music", "Philosophy", "Random"
          "Politics", "History", "Culture", "Education"
  */


  handleOpen = () => this.setState({ open: !this.state.open})
  // handleClose = () => this.setState({ open: false})

  handleOpenCategory = (posts) => {
    this.handleOpen()
    this.setState({
      category_entries: posts
    })
  }

  listCategories = () => {
    // might need to fetch the posts here in order to get the categories
    let menuItems = [<MenuItem primaryText="highlights" key="first" onClick={this.handleOpen} containerElement={<Link to="/"/>}/>]
    const { entries } = this.state
    if(entries.length){
      // collect categories
      let all_cats = entries.map((entry) => entry.category )
      const categories = all_cats.filter((v, i, a) => a.indexOf(v) === i)
      for(let i = 0; i < categories.length; i++){
        const posts = entries.filter((entry) => entry.category === categories[i])
        menuItems.push((
            <MenuItem
            primaryText={`${categories[i]}`}
            key={i.toString()}
            onClick={() => this.handleOpenCategory(posts)}
            containerElement={
              <Link to={`/blog/${categories[i]}`}/>
            }
          />
        ))}
      return menuItems
    }
  }

  render() {
    return (
      <Router>
        <div className="mb5 bg--white">
          <AppBar
            title="urDiary"
            titleStyle={titleStyle}
            onClick={this.handleOpen}
            style={{
              'background': 'white',
              'marginBottom': '20px'
            }}
          >
            <Toolbar
              style={{
                'background': 'white',
                'position': 'absolute',
                'padding': 0,
                'margin': 0,
                'top': 8
              }}
            >
              <IconButton
                aria-label="Menu"
              >
                <MenuIcon/>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            open={this.state.open}
          >
            {this.listCategories()}
          </Drawer>
          <Route exact path="/" render={() => <BlogEntries entries={this.state.favorite_entries} rahul={this.state.rahul}/>}/>
          <Route
            path="/blog/:category"
            render={(props) =>
              <BlogEntries
                entries={this.state.category_entries}
                rahul={this.state.rahul}
                {...props}
              />
            }
            />
          <Route path="/new-post" component={TextEditor}/>
          <Route path="/edit-post/:id" component={TextEditor}/>
        </div>
      </Router>
    )
  }
}

export default Main
