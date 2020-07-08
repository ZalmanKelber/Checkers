import React from "react";
import Header from "../sections/Header";
import TitleArea from "../sections/TitleArea";
import Footer from "../sections/Footer";
import axios from "axios";
import renderUserInfo from "../../utils/renderUserInfo";

function Statistics() {

  //define the variable where we will store the user's game data
  const [tableData, setTableData] = React.useState([{
    gameId: "",
    gameStatus: "",
    redPlayer: "",
    blackPlayer: "",
    winner: ""
  }]);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);


  const [userObject, setUserObject] = React.useState({
                                  authenticated: false,
                                  username: "guest user",
                                  userId: "0"
                                });

  React.useEffect(() => {
    getUserObject();
  },[]);

  //function either retrieves the game object or else redirects to another page
  function getUserObject() {
    //initialize axios call
    const transport = axios.create({
      withCredentials: true
    });

    //send the post request, including the user input data, and depending on the response, either
    //redirect (home is the default redirect if there is no redirect given in props) or
    //render the error message by calling handleError
    transport.get("/server/authenticate/").catch(err => {
      console.log(err);
    }).then(response => {
      if (response && response.data) {
        const userObjectCopy = {
          authenticated: response.data.authenticated,
          username: response.data.username,
          userId: response.data.userId
        }
        setUserObject(userObjectCopy);
        if (userObjectCopy.userId !== "0") {
          fetchUserInfo(userObjectCopy.userId);
        }
        // if (changed === false) {
        //   setChanged(true);
        // }
      } else {
        console.log("response: ");
        console.log(response);
      }
    });
  }

  React.useEffect(() => {
    if (userObject.authenticated) {
      setIsLoggedIn(true);
    }
  },[userObject]);

  function fetchUserInfo(userurl) {
    //initialize axios call
    const transport = axios.create({
      withCredentials: true
    });

    //send the get request, including the move, and print the response
    transport.get("/server/user/" + userurl).catch(err => {
    console.log(err);
    }).then(response => {
      console.log("response from axios call for user info: ");
      console.log(response);
      if (response.data && response.data.lookupWasSuccess) {
        const gamesInfoCopy = response.data.gamesInfo;
        renderUserInfo(gamesInfoCopy);
      }
    });
  }
  return (
    <div className="authenticate-container">
      <Header />
      <div className="authenticate-area">
        <TitleArea game={true} username={userObject.username}  />
          <div className="authenticate-title">
            <div className="authenticate-title-wrapper">
               <h1 className="text-center">My games</h1>
               {!isLoggedIn && <p className="text-center text-danger" >"Log in to view"</p> }
            </div>
          </div>
          <div className="table-container-outer">
            <div id="user-info-table" className="table-container-inner">
            </div>
          </div>
        <Footer authenticatePage={true}/>
      </div>
    </div>
  );
}

export default Statistics;
