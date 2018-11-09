import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import MenuIcon from 'material-ui-icons/Menu'
import IconButton from 'material-ui/IconButton'
import Drawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import MenuItem from 'material-ui/MenuItem'
import './App.css'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'
import styled from 'styled-components'
import TextEditor from './TextEditor'
import BlogEntries from './BlogEntries'


const titleStyle = {
  'color': 'black',
  'textAlign': 'center',
  'fontFamily': 'Palatino',
  'fontSize': 25,
}

const toolBarStyle = {
  'background': 'white',
  'padding': 0
}

const menuStyle = {
  root: {
     flexGrow: 1,
   },
   grow: {
     flexGrow: 1,
   },
   menuButton: {
     marginLeft: -12,
     marginRight: 20,
   },
}


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
      rahul: rahul
    }
  }

  componentDidMount() {
    // get the entries from the API
    this.getEntries()
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
    let menuItems = [<MenuItem primaryText="all" onClick={this.handleOpen} containerElement={<Link to="/"/>}/>]
    let entries = this.state.entries
    if(entries){
      // collect categories
      let dup_cats = entries.map((entry) => { return entry.category })
      const categories = dup_cats.filter((v, i, a) => a.indexOf(v) === i)
      for(let i = 0; i < categories.length; i++){
        const posts = this.state.entries.filter((entry) => entry.category === categories[i])
        //console.log(`these are the posts for ${categories[i]}`, posts)
        menuItems.push(
          (<MenuItem primaryText={`${categories[i]}`}
                    onClick={() => this.handleOpenCategory(posts)}
                    containerElement={
                      <Link to={`/blog/${categories[i]}`}/>
                    }
          />)
        )
      }
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
              'background': 'white'
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
            <MenuItem
              primaryText="blog"
              rightIcon={<ArrowDropRight />}
              menuItems={this.listCategories()}
            />
            <Divider />
            <MenuItem>poems</MenuItem>
            <Divider />
            <MenuItem>ideas</MenuItem>
            <Divider />
            <MenuItem>music</MenuItem>
          </Drawer>
          <Route exact path="/" render={() => <BlogEntries entries={this.state.entries} rahul={this.state.rahul}/>}/>
          <Route path="/blog/:category" render={() => <BlogEntries entries={this.state.category_entries} rahul={this.state.rahul}/>}/>
          <Route path="/new-post" component={TextEditor}/>
          <Route path="/edit-post/:id" component={TextEditor}/>
        </div>
      </Router>
    )
  }
}

export default Main
