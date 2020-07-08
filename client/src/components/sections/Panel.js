import React from "react";
import axios from "axios";
import {Redirect} from "react-router-dom";
import Footer from "./Footer";
import GamePanel from "./GamePanel";
import HomePanel from "./HomePanel";
import HomePanelDrop from "./HomePanelDrop";
import queryString from "query-string";

function Panel(props) {

  //uses a media query to determine which version of the Home Panel to render
  const mediaQueryListener = window.matchMedia("(max-width: 900px)");
  const [isMobile, setIsMobile] = React.useState(mediaQueryListener.matches);
  mediaQueryListener.addListener(updateIsMobile);
  function updateIsMobile() {
    setIsMobile(mediaQueryListener.matches);
  }

  //initialize the home form input data using state
  const [inputData, setInputData] = React.useState({
    againstComputer: true,
    isRed: false,
    rules: 0
  });

  //initialize the redirect route to an empty string.  When the redirect route has a length
  //greater than zero, the redirect will be automatgicallt triggered
  const [redirectRoute, setRedirectRoute] = React.useState("");

  //keep track of changes to input
  const handleChange = (event) => {
    const changedKey = event.target.name;
    const changedValue = event.target.value;
    console.log(changedKey + " " + changedValue)
    setInputData({
      ...inputData,
      [changedKey]: changedValue
    });
  }

  //handel the create new game button by making a POST call to initialize the game and then redirecting to the game
  const handleSubmit = (event) => {
    event.preventDefault();

    //initialize axios call
    const transport = axios.create({
      withCredentials: true
    });

    const params = {
      againstComputer: (inputData.againstComputer === "true"),
      isRed: (inputData.isRed === "true"),
      rules: Number (inputData.rules)
    }


    //send the post request, including the user input data
    transport.post("/server/new/", queryString.stringify(params))
      .catch(err => {
        console.log(err);
        setRedirectRoute("/error");
      })
      .then((response) => {
        console.log("response:");
        console.log(response);
        if (response && response.data && response.data.gameId) {
          const gameurl = response.data.gameId;
          console.log(gameurl);
          setRedirectRoute("/game/" + gameurl); //changing the redirect route will automatically trigger the redirect
        }
        else {
          setRedirectRoute("/error");
        }
      }, (err) => {
        console.log("error from server: " + err);
        setRedirectRoute("/error");
      });
  }


  return (
    <div className="panel">
    {
      redirectRoute && <Redirect to={{pathname: redirectRoute}} />
    }
    {props.game? <GamePanel gameurl={props.gameurl} />
      : (isMobile? <HomePanelDrop handleChange={handleChange} handleSubmit={handleSubmit}/>
        : <HomePanel handleChange={handleChange} handleSubmit={handleSubmit}/>)}
    {isMobile && <Footer /> }
    </div>
  );
}

export default Panel;
