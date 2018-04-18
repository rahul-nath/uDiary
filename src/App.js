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

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      open: false,
      entries: [],
      category_entries: []
    }
  }

  componentDidMount() {
    // get the entries from the API
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
      - organize backend to models, routes, and app
      - expand the length of a blog post title (look at the migration page)
        -- https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iv-database

      - order the posts by most recently edited -> need to set time stamps on POST
      
      - undo a link     

    BUGS:
      - if I change the title of the post, it adds a row instead of editing it

      NICE TO HAVE:
      - as you scroll through the page, the title of the current post is shown in AppBar
      - click on the title of an individual post to just view that post

    categories:
          "Economics", "New Music", "Philosophy", "Random"
          "Politics", "History", "Culture", "Education"
  */


  handleOpen = () => this.setState({ open: !this.state.open})

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
      <MuiThemeProvider>
      <Router>
        <div>
        <AppBar
          title="the new work times"
          iconElementLeft={<StyledToc/>}
          titleStyle={titleStyle}
          style={appBarStyle}
          onClick={this.handleOpen}/>

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
        <Route exact path="/" render={() => <BlogEntries entries={this.state.entries}/>}/>
        <Route path="/blog/:category" render={() => <BlogEntries entries={this.state.category_entries}/>}/>
        <Route path="/new-post" component={TextEditor}/>
        <Route path="/edit-post/:id" component={TextEditor}/>        
        </div>
      </Router>
      </MuiThemeProvider>
    )
  }
}

export default App
