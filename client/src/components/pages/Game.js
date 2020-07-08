import React from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import Header from "../sections/Header";
import Main from "./Main";

function Game(props) {

  //before rendering, determine if user has access to game, and if not, redirect
  const [redirectRoute, setRedirectRoute] = React.useState("");
  const [gameObject, setGameObject] = React.useState({});
  const [userObject, setUserObject] = React.useState({
    authenticated: false,
    userId: "0",
    username: "guest user"
  });

  //define the variable that will change upon rendering, which we can use tu call useEffect only once
  const [changed, setChanged] = React.useState(false);

  //keep track of potential error messages to be rendered on redirect
  const [errorMessage, setErrorMessage] = React.useState("Error: you must be logged in to access this game");

  //this component will also need its own need its own local version of the isRed variable in order to listen to the correct
  //server side event
  const [isRed, setIsRed] = React.useState(false);

  //set up a subsequent redirect route for after a user is redirected to the login page
  const [nextRedirectRoute] = React.useState("/game/" + props.match.params.gameurl)

  //keep track of what turn it is
  const [currentTurn, setCurrentTurn] = React.useState(-2);


  React.useEffect(() => {
    console.log("useEffect called");
    getGameObject();
  },[]);

  //function either retrieves the game object or else redirects to another page
  function getGameObject(){
    console.log("getGameObject called");
    //initialize axios call
    const transport = axios.create({
      withCredentials: true
    });

    //send the post request, including the user input data, and depending on the response, either
    //redirect (home is the default redirect if there is no redirect given in props) or
    //render the error message by calling handleError
    transport.get("/server/game/" + props.match.params.gameurl).catch(err => {
      setRedirectRoute("/error");
    }).then(response => {
      console.log("response from axios:");
      console.log(response);
      if (response && response.data.gameObject) {
        console.log(Number(response.data.gameObject.numberOfMoves), Number(currentTurn));
        if (Number(response.data.gameObject.numberOfMoves) > Number(currentTurn) + 1) {
          console.log("setting turn: ", Number(response.data.gameObject.numberOfMoves));
          setCurrentTurn(Number(response.data.gameObject.numberOfMoves));
          const gameObjectCopy = response.data.gameObject;
          setGameObject(gameObjectCopy);
          const userObjectCopy = response.data.userObject;
          setUserObject(userObjectCopy);
          //we will need to define the isRed variable locally
          setIsRed(response.data.gameObject.user2 == response.data.userObject.userId);
          if (changed === false) {
            setChanged(true);
          }
        }
        else {
          setTimeout(() => {
            getGameObject();
          }, 1000)
        }
      }
      else {
        if (response && response.data.gameFound && !response.data.authenticationStatus) {
          const message = "Error: you must be logged in to access this game".split(" ").join("%20");
          setRedirectRoute("/login/" + message);
        }
        else if (response && response.data.gameFound === false) {
          const message = "Error: couldn't locate game".split(" ").join("%20");
          setRedirectRoute("/error/" + message);
        }
        else {
          const message = "Error: you don't have access to this game".split(" ").join("%20");
          setRedirectRoute("/error/" + message);
        }
      }
    });
  }

  //next, define the function that will send a completed game move back to the database.
  //this function will be passed down in props to the BoardArea component where it will be called once a turn is complete
  function sendMove(move) {
    console.log("PATH TO SEND: ");
    console.log(move);


    //initialize axios call
    const transport = axios.create({
      withCredentials: true
    });

    const params = {move: move};
    //send the post request, including the move, and print the response
    transport.post("/server/move/" + props.match.params.gameurl, queryString.stringify(params)).catch(err => {
    console.log(err);
    }).then(response => {
      getGameObject();
    });
  }


  //finally, define the function that will mark a completed game as complete:
  //initialize axios call
  function completeGame() {
    console.log("completeGame function called from within Game component");
    //initialize axios call
    const transport = axios.create({
      withCredentials: true
    });
    //send the post request, including the move, and print the response
    transport.post("/server/complete/" + props.match.params.gameurl).catch(err => {
    console.log(err);
  }).then(response => {
    console.log("response from axios call to complete game:");
    console.log(response.data);
  })
  }


  return (
    <div className="home-container">
      {
        redirectRoute &&
        <Redirect to={{
          pathname: redirectRoute,
          state: {redirectRoute: nextRedirectRoute}
        }} />
      }
      <Header />
      <Main
        completeGame={completeGame}
        game={true}
        gameurl={props.match.params.gameurl}
        userObject={userObject}
        gameObject={gameObject}
        sendMove={sendMove}
      />
    </div>
  );
}

export default Game;
