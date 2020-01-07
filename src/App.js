import React, { useState } from 'react'
import './App.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Main from './Main'

const App = (props) => {

  const [rahul, setRahul] = useState(true)
  const [posted, setPosted] = useState(true)
  const [password, setPassword] = useState("")

  const postPasscode = () => {
    const login = { password }

    fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "post",
      headers: {
        'Accept': 'application/x-www-form-urlencoded;',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(login)
    })
    .then((res) => res.json())
    .then((response) => {
      setRahul(response["rahul"])
      setPosted(true)
    })
  }

  const handleTextFieldChange = (e) => setPassword(e.target.value)

  return (
    <MuiThemeProvider>
      {
        posted ?
        (
          rahul !== "" ?  <Main rahul={true}/> : <Main rahul={false}/>
        )
        : <div className="login">
          <TextField
            hintText="Answer"
            floatingLabelText="Are you Rahul?"
            value={password}
            onChange={handleTextFieldChange}
            type="password"
          />
          <FlatButton label="Send" onClick={postPasscode}/>
        </div>
      }
    </MuiThemeProvider>
  )
}

export default App
