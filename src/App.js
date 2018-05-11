import React, { Component } from 'react'
import './App.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Main from './Main'

class App extends Component {

  constructor(props){
    super(props)
    // change rahul and posted to false when you deploy
    this.state = {
      rahul: true,
      posted: true,
      password: ""
    }
  }

  postPasscode = () => {
    const login = {
      password: this.state.password
    }

    fetch('http://localhost:5000/login', {
      method: "post",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(login)
    })
    .then((res) => res.json())
    .then((response) => {
      this.setState({ 
        rahul: response["rahul"],
        posted: true
      });
    })
  }

  handleTextFieldChange = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  /* TODO: 

    - have multiple categories (just change the category check to a list)
      - add a redundant row for each category

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

  render() {
    return (
      <MuiThemeProvider>
        {
          this.state.posted ? 
          (
            this.state.rahul !== "" ?  <Main rahul={true}/> : <Main rahul={false}/>
          )
          : <div className="login">
            <TextField
              hintText="Answer"
              floatingLabelText="Are you Rahul?"
              value={this.state.password}
              onChange={this.handleTextFieldChange}
              type="password"
            />
            <FlatButton label="Send" onClick={this.postPasscode}/>
          </div>
        }
      </MuiThemeProvider>
    )
  }
}

export default App
