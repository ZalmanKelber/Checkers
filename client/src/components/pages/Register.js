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


function Register(props) {
  //keep track of whether or not there was an error in order to display the error message
  const [error, setError] = React.useState(false);

  //keep track of whether or not there was a password matching error
  const [passwordMatchError, setPasswordMatchError] = React.useState(false);

  //initialize the login input data using state
  const [inputData, setInputData] = React.useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  //initialize the redirect route to an empty string.  When the redirect route has a length
  //greater than zero, the redirect will be automatgicallt triggered
  const [redirectRoute, setRedirectRoute] = React.useState("");

  //keep track of changes to input
  const handleChange = (event) => {
    const changedKey = event.target.name;
    const changedValue = event.target.value;
    setPasswordMatchError(false);
    setInputData({
      ...inputData,
      [changedKey]: changedValue
    });
  }

  //handel the sign up button by making a POST call to the register route
  const handleSubmit = (event) => {
    console.log("handle submit called");
    event.preventDefault();

    //if passwords do not match, call the handlePasswordError function
    if (inputData.password !== inputData.passwordConfirm) {
      handlePasswordError();
      return;
    }

    //otherwise: initialize axios call
    const transport = axios.create({
      withCredentials: true
    });

    const params = {
      username: inputData.username,
      email: inputData.email,
      password: inputData.password
    }

    console.log("axios object created");

    //send the post request, including the user input data, and depending on the response, either
    //redirect (home is the default redirect if there is no redirect given in props) or
    //render the error message by calling handleError
    transport.post("/server/register/", queryString.stringify(params)).catch(err => {
      handleError();
    }).then(response => {
      console.log(response.data);
      if (!response.data.registerWasSuccess) {
        handleError();
      }
      else {
        setRedirectRoute(props.redirectUrl || "/");
      }
    });
  }

    //define the handleError function that simply renders the error message
    function handleError() {
      setError(true);
      setInputData({
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
      });
    }

    //define the handlePasswordError function that renders the password error message
    function handlePasswordError() {
      setPasswordMatchError(true);
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
             <h1 className="text-center">Register</h1>
             {error && <p className="text-center text-danger" >Error registering.  Please try again</p>}
          </div>
        </div>
        <div className="authenticate-content">
          <div className="authenticate-section normal-authenticate">
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" placeholder="Enter username" name="username" onChange={handleChange} value={inputData.username} />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} value={inputData.email} />
                <Form.Text className="text-muted">
                  (Feel free to use a fake email address for this demo)
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} value={inputData.password} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control type="password" placeholder="Password" name="passwordConfirm" onChange={handleChange} value={inputData.passwordConfirm} />
                {
                  passwordMatchError &&
                  <Form.Text className="text-danger">
                    Passwords do not match
                  </Form.Text>
                }
              </Form.Group>
              <Button onClick={handleSubmit} variant="primary">
                Sign up
              </Button>
            </Form>
          </div>
          <div className="authenticate-section social-authenticate">
            <Form>
              <p className="text-center">or:</p>
              <p className="text-center">Register with your social media account</p>
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

export default Register;
