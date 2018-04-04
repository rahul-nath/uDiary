import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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

const titleStyle = {
  'color': 'black',
  'textAlign': 'center',
  'fontFamily': 'Palatino',
  'fontSize': '25',
  'marginTop': '-0.3cm'
}

const appBarStyle = {
  'background': 'white',
  'height': '40'
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

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      open: false
    }
  }

  /*

    TODO:
  
    Create the blog display component
    - When a blog category is clicked, pull the posts that have to do with that subject
    - just clicking "Blog" will give all the posts, latest ones first
    - clicking one of the subcategories will only give posts of that category

    Create the data model for a Post
    - Each Post has a 
      -- Category
      -- Display Date
      -- Time Stamp of creation
      -- Title
      -- Content 
    
  */


  handleOpen = () => this.setState({ open: !this.state.open})

  render() {
    return (
      <MuiThemeProvider>
      <div>
      <AppBar
        title="A blog"
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
            <MenuItem primaryText="Economics"/>,
            <MenuItem primaryText="New Music" />,
            <MenuItem primaryText="Philosophy" />,
            <MenuItem primaryText="Politics" />,
            <MenuItem primaryText="History" />,
            <MenuItem primaryText="Culture" />,
            <MenuItem primaryText="Education"/>, 
            <MenuItem primaryText="Random "/>
          ]}/>
        <Divider />
        <MenuItem>Applications</MenuItem>
        <Divider />
        <MenuItem>Poems</MenuItem>
        <Divider />
        <MenuItem>Ideas</MenuItem>
        <Divider />
        <MenuItem>Music</MenuItem>
      </Drawer>
      <TextEditor/>
      </div>
      </MuiThemeProvider>
    )
  }
}

export default App
