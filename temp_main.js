import React, { useState, useEffect } from 'react'
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

const Main = (props) => {

  const [rahul, setRahul] = useState(props.rahul)
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState([])
  const [categoryEntries, setCategoryEntries] = useState([])
  const [favoriteEntries, setFavoriteEntries] = useState([])

  // useEffect
  useEffect(() => {
    getEntries()
    getFavoriteEntries()
  })

  // useEffect ?
  // what happens to forceUpdate ?
  // componentWillReceiveProps(nextProps){
  //   if (nextProps.location.state === 'newPost') {
  //     this.forceUpdate()
  //   }
  // }

  // TODO: Add error promise handler here
  const getEntries = () => {
    fetch('http://localhost:5000/posts')
      .then((res) => res.json())
      .then((response) => {
        setEntries(response)
        setCategoryEntries(response)
        console.log("successfully retrieved blog entries")
      })
  }

  const getFavoriteEntries = () => {
    fetch('http://localhost:5000/posts/favorites')
      .then((res) => res.json())
      .then((response) => setFavoriteEntries(response))
  }

  const handleOpen = () => setOpen(!open)
  // handleClose = () => this.setState({ open: false})

  const handleOpenCategory = (posts) => {
    handleOpen()
    setCategoryEntries(posts)
  }

  const listCategories = () => {
    // might need to fetch the posts here in order to get the categories
    if(entries.length){
      // collect categories
      const menuItems = [
        <MenuItem
          primaryText="highlights"
          key="first"
          onClick={handleOpen}
          containerElement={<Link to="/"/>}
        />
      ]
      const categories = Array.from(new Set(entries.map((entry) => entry.category)))
      return [...menuItems, ...categories.map((category, i) => {
        const posts = entries.filter((entry) => entry.category === category)
        return (
          <MenuItem
            primaryText={`${category}`}
            key={i.toString()}
            onClick={() => handleOpenCategory(posts)}
            containerElement={
              <Link to={`/blog/${category}`}/>
            }
          />
        )
      })]
    }
  }

  return (
    <Router>
      <div className="mb5 bg--white">
        <AppBar
          title="urDiary"
          titleStyle={titleStyle}
          onClick={handleOpen}
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
        <Drawer open={open}>
          {listCategories()}
        </Drawer>
        <Route exact path="/" render={() => <BlogEntries entries={favoriteEntries} rahul={rahul}/>}/>
        <Route
          path="/blog/:category"
          render={(props) =>
            <BlogEntries
              entries={categoryEntries}
              rahul={rahul}
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

export default Main
