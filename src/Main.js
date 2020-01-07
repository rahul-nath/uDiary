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


/* TODO:

***Fix category listing***
- on load fetch posts by category
- create fetch to get all categories
- when clicked, fetch posts by that cat id
******************************************
  TODO: refactor getEntries calls to accept an
  endpoint adn genraliz3ed this to an actual class that does all teh fetching


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


const titleStyle = {
  'color': 'black',
  'textAlign': 'center',
  'fontFamily': 'Palatino',
  'fontSize': 25,
}

class Main extends Component {

  constructor(props){
    super(props)
    const { rahul } = this.props
    this.state = {
      open: false,
      categories: [],
      categoryId: '',
      rahul
    }
  }

  componentDidMount() {
    this.getCategories()
  }

  // componentWillReceiveProps(nextProps){
  //   this.forceUpdate()
  // }

  getCategories = () => {
    const url = `https://urdiary-server.herokuapp.com/categories`
    fetch(url)
    .then((res) => res.json())
    .then((response) => {
      this.setState({
        categories: response,
      });
      console.log(`successfully retrieved categories`)
    })
  }

  handleOpen = () => this.setState({ open: !this.state.open})

  handleOpenCategory = (categoryId) => {
    this.setState({
      open: !this.state.open,
      categoryId
    })
  }

  listCategories = () => {
    // might need to fetch the posts here in order to get the categories
    let menuItems = [
      <MenuItem
        primaryText="highlights"
        key="favorites"
        onClick={this.handleOpen}
        containerElement={<Link to="/"/>}
      />
    ]
    const { categories } = this.state
    return [...menuItems, ...categories.map((category) => (
        <MenuItem
          primaryText={`${category.name}`}
          key={category.id}
          onClick={() => this.handleOpenCategory(category.id)}
          containerElement={
            <Link to={`/blog/${category.name}`}/>
          }
        />
    ))]
  }

  render() {
    const { categoryId, open, rahul } = this.state
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
              <IconButton aria-label="Menu">
                <MenuIcon/>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer open={open}>
            {this.listCategories()}
          </Drawer>
          <Route
            exact path="/"
            render={() => <BlogEntries rahul/>}
          />
          <Route
            path="/blog/:category"
            render={
              (props) =>
              <BlogEntries
                categoryId={categoryId}
                rahul={rahul}
                {...props}
              />}
          />
          <Route path="/new-post" component={TextEditor}/>
          <Route path="/edit-post/:id" component={TextEditor}/>
        </div>
      </Router>
    )
  }
}

export default Main
