import React from "react";
import NavContent from "../menuItems/NavContent";

function NavMenu(props) {

  return (
    <NavContent
      game={props.game}
      isLoggedIn={props.isLoggedIn}
      redirectHome={props.redirectHome}
      redirectAbout={props.redirectAbout}
      redirectStatistics={props.redirectStatistics}
      redirectLogin={props.redirectLogin}
      redirectLogout={props.redirectLogout}
      redirectRegister={props.redirectRegister}
    />
  );
}

export default NavMenu;
