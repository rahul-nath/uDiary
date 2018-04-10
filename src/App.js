import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import MenuItem from 'material-ui/MenuItem'
import './App.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'
import Toc from 'material-ui/svg-icons/action/toc'
import styled from 'styled-components'
import TextEditor from './TextEditor'
import BlogEntries from './BlogEntries'


const titleStyle = {
  'color': 'black',
  'textAlign': 'center',
  'fontFamily': 'Palatino',
  'fontSize': 25,
  'marginTop': '-0.3cm'
}

const appBarStyle = {
  'background': 'white',
  'height': 40
}

const StyledToc = styled(Toc)`
  height: 60;
  width: 60;
`


const StyledLink = styled(Link)`
  color: #228EB6;
  cursor: pointer;
  text-decoration: none;
`

const About = () => (
  <div>
    <h3>This is a blog</h3>
  </div>
)

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      open: false,
      edit: false
    }
  }

  /*

    TODO:

    Create the data model for a Post
    - Each Post has a 
      -- Category
      -- Display Date
      -- Time Stamp of creation
      -- Title (maybe in the future)
      -- Content 
    
    When you click "save" button in the Text Editor
    - convert the editor content to HTML

    Create the blog display component (Default Component)
    - When a blog category is clicked, pull the posts that have to do with that subject
    - just clicking "Blog" will give all the posts, latest ones first
    - clicking one of the subcategories will only give posts of that category
    - convert the entry html to editor content/state
    - add a horizontal line between each entry

    Create New Post
    - Make a button in the AppBar to create a new Post
    - Basically have a switch statement here -> if state of "edit" is 'false'
      then show the "Create Post" button and also display BlogEntries
    - If the state of "edit" is true, then instead of BlogEntries, display the TextEditor
      and the "Create Post" button changes to "Save Post" and another button that says "Discard Post"
    - When "Save Post" is clicked, make a POST request to store the blog entry;
      if 'Discard Post' is clicked, then go back to all posts
  */


  handleOpen = () => this.setState({ open: !this.state.open})

  render() {
    return (
      <MuiThemeProvider>
      <Router>
        <div>
        <AppBar
          title="The New York Times"
          iconElementLeft={<StyledToc/>}
          titleStyle={titleStyle}
          style={appBarStyle}
          onClick={this.handleOpen}/>

        <Drawer
          open={this.state.open}
        >

          <MenuItem
            primaryText="Blog"
            rightIcon={<ArrowDropRight />}
            menuItems={[
              <MenuItem primaryText="All" onClick={this.handleOpen} containerElement={<Link to="/blog-entries"/>}/>,
              <MenuItem primaryText="Economics" onClick={this.handleOpen} />,
              <MenuItem primaryText="New Music" onClick={this.handleOpen} />,
              <MenuItem primaryText="Philosophy" onClick={this.handleOpen} />,
              <MenuItem primaryText="Politics" onClick={this.handleOpen} />,
              <MenuItem primaryText="History" onClick={this.handleOpen} />,
              <MenuItem primaryText="Culture" onClick={this.handleOpen} />,
              <MenuItem primaryText="Education" onClick={this.handleOpen} />, 
              <MenuItem primaryText="Random " onClick={this.handleOpen} />
            ]}/>
          <Divider />
          <MenuItem>Poems</MenuItem>
          <Divider />
          <MenuItem>Ideas</MenuItem>
          <Divider />
          <MenuItem>Music</MenuItem>
        </Drawer>
        <Route exact path="/" component={About}/>
        <Route path="/blog-entries" component={BlogEntries}/>
        <Route path="/new-post" component={TextEditor}/>
        </div>
      </Router>
      </MuiThemeProvider>
    )
  }
}

export default App
