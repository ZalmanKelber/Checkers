import React from "react";
import axios from "axios";
import Header from "../sections/Header";
import Main from "./Main";

function Home() {

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
        // if (changed === false) {
        //   setChanged(true);
        // }
      } else {
        console.log("response: ");
        console.log(response);
      }
    });
  }

  return (
    <div className="home-container">
      <Header />
      <Main game={false} userObject={userObject}/>
    </div>
)
}

export default Home;
