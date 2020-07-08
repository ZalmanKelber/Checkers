import React from "react";
import NavMenu from "./NavMenu";
import NavMenuDrop from "./NavMenuDrop";
import {Redirect} from "react-router-dom";

function Navbar(props) {

  //create a media query to determine whether to use the normal menu or the dropdown menu
  const mediaQueryListener = window.matchMedia("(max-width: 600px)");
  const [isMobile, setIsMobile] = React.useState(mediaQueryListener.matches);
  mediaQueryListener.addListener(updateIsMobile);
  function updateIsMobile() {
    setIsMobile(mediaQueryListener.matches);
  }

  //initialize the redirect path to an empty string
  const [redirectRoute, setRedirectRoute] = React.useState("");

  //define the functions that set the redirect routes to the specified urls.  Updating the redirect route
  //will automatically trigger the redirect
  function redirectHome() {
    setRedirectRoute("/");
  }

  function redirectAbout() {
    setRedirectRoute("/about");
  }

  function redirectStatistics() {
    setRedirectRoute("/statistics");
  }

  function redirectLogin() {
    setRedirectRoute("/login");
  }

  function redirectLogout() {
    setRedirectRoute("/logout");
  }

  function redirectRegister() {
    setRedirectRoute("/register");
  }
  return (
    <nav className="navbar navbar-expand-sm custom-navbar">
    {
      redirectRoute &&
      <Redirect
            to={{
              pathname: redirectRoute
            }}
          />
        }
        <div className="user-display">Signed in as {props.username}</div>
    {
      isMobile?
        <NavMenuDrop
          isLoggedIn={props.isLoggedIn}
          game={props.game}
          redirectHome={redirectHome}
          redirectAbout={redirectAbout}
          redirectStatistics={redirectStatistics}
          redirectLogin={redirectLogin}
          redirectLogout={redirectLogout}
          redirectRegister={redirectRegister}
        />
        :
        <NavMenu
          isLoggedIn={props.isLoggedIn}
          game={props.game}
          redirectHome={redirectHome}
          redirectAbout={redirectAbout}
          redirectStatistics={redirectStatistics}
          redirectLogin={redirectLogin}
          redirectLogout={redirectLogout}
          redirectRegister={redirectRegister}
        />
    }
    </nav>
  );
}

export default Navbar;
