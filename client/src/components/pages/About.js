import React from "react";
import Header from "../sections/Header";
import TitleArea from "../sections/TitleArea";
import Footer from "../sections/Footer";
import axios from "axios";

function About() {

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





  return (
    <div className="authenticate-container">
      <Header />
      <div className="about-area">
        <TitleArea game={true} username={userObject.username}  />
          <div className="authenticate-title">
            <div className="authenticate-title-wrapper">
               <h1 className="text-center">About</h1>
            </div>
          </div>
          <div className="text-center table-container-outer">
            <div className="about-container-inner">
              <p>
                Hello, and welcome to Checkers Project!
                On this website, users can play a game of Checkers against a very simply
                computer algorithm and choose several options for the precise parameters that
                define legal moves.  Users can also register for free (and, in this
                  demo, unverified) accounts and play against other users on different
                  computers in real time.  Users can also access any of the games they’ve,
                  initialized, started or completed on the “Current Games” page.
              </p>
              <p>
                I designed this website demo in May of 2020 as my first complete web application, using the
                MERN stack.  Not only did it provide an opportunity to practice just about every important
                concept, skill and technology I had encountered in my programming journey thus far—basic
                DOM manipulation, important javaScript concepts like closure, async programming and regexes,
                the basics of React hooks, responsive web design, database storage and schema with MongoDB and
                Mongoose, authentication with Passport js and Express-session, building RESTful API’s with
                Express and, (within the game logic itself), tricky algorithms, including recursion—but I also
                had to research and learn some important skills that I hadn’t encountered yet, including
                integrating Bootstrap with React, using routing and lifecycle functions within React, AJAX
                client-server communication as well as Server Sent Events and the basics of CORS, cookies and
                data encoding.
              </p>
              <p>
                As for the design of this website, the red and black color scheme was inspired both by the “red-black
                binary search trees” that computer scientists know from algorithms courses, as well as the red-
                and black-figure vases for classical and pre-classical Ancient Greece.
              </p>
            </div>
          </div>
        <Footer authenticatePage={true}/>
      </div>
    </div>
  );
}

export default About;
