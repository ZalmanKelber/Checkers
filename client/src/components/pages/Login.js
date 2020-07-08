import React from "react";
import Header from "../sections/Header";
import TitleArea from "../sections/TitleArea";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Footer from "../sections/Footer";
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import axios from "axios";
import queryString from "query-string";
import {Redirect} from "react-router-dom";


function Login(props) {

  React.useEffect(() => {
    console.log("error param:");
    console.log(props.match.params.error);
    setErrorMessage(props.match.params.error);
    setError(props.match.params.error);
  },[props.match.params]);

  //keep track of whether or not there was an error in order to display the error message
  const [error, setError] = React.useState(props.match.params.error);

  //keep track of the error message
  const errorDefault = "Error logging in.  Please try again.";
  const [errorMessage, setErrorMessage] = React.useState(props.match.params.error);

  //initialize the login input data using state
  const [inputData, setInputData] = React.useState({
    username: "",
    password: ""
  });

  //initialize the redirect route to an empty string.  When the redirect route has a length
  //greater than zero, the redirect will be automatgicallt triggered
  const [redirectRoute, setRedirectRoute] = React.useState("");

  //keep track of changes to input
  const handleChange = (event) => {
    const changedKey = event.target.name;
    const changedValue = event.target.value;
    setInputData({
      ...inputData,
      [changedKey]: changedValue
    });
  }

  //handel the log in button by making a POST call to the login route
  const handleSubmit = (event) => {
    console.log("handle submit called");
    event.preventDefault();

    //initialize axios call
    const transport = axios.create({
      withCredentials: true
    });

    const params = {
      username: inputData.username,
      password: inputData.password
    }

    //send the post request, including the user input data, and depending on the response, either
    //redirect (home is the default redirect if there is no redirect given in props) or
    //render the error message by calling handleError
    transport.post("/server/login/", queryString.stringify(params)).catch(err => {
      handleError();
    }).then(response => {
      console.log(response && response.data);
      if (response && !response.data.loginWasSuccess) {
        handleError();
      }
      else {
        setRedirectRoute((props.location && props.location.state && props.location.state.redirectRoute) || "/");
      }
    });
    }

    //define the handleError function that simply renders the error message
    function handleError() {
      setError(true);
      setErrorMessage(errorDefault);
      setInputData({
        username: "",
        password: ""
      })
    }


  return (
    <div className="authenticate-container">
    {
      redirectRoute && <Redirect to={{pathname: redirectRoute}} />
    }
      <Header />
      <div className="authenticate-area">
        <TitleArea game={true} username="guest user" />
        <div className="authenticate-title">
          <div className="authenticate-title-wrapper">
             <h1 className="text-center">Login</h1>
             {<p className="text-center text-danger" >{error ? errorMessage : ""}</p> }
          </div>
        </div>
        <div className="authenticate-content">
          <div className="authenticate-section normal-authenticate">
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" name="username" placeholder="Username" onChange={handleChange} value={inputData.username} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} value={inputData.password} />
              </Form.Group>
              <Button onClick={handleSubmit} variant="primary">
                Log in
              </Button>
            </Form>
          </div>
          <div className="authenticate-section social-authenticate">
            <Form>
              <p className="text-center">or:</p>
              <p className="text-center">Log in with your social media account</p>
              <hr />
              <FacebookLoginButton />
              <Form.Text className="text-muted">
                (Not currently available... coming soon)
              </Form.Text>
              <hr/>
              <GoogleLoginButton />
              <Form.Text className="text-muted">
                (Not currently available... coming soon)
              </Form.Text>
            </Form>
          </div>
        </div>
        <Footer authenticatePage={true}/>
      </div>
    </div>
  )
}

export default Login;
