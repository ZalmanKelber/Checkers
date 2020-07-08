import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import NavContent from "../menuItems/NavContent";

function NavMenuDrop(props) {

  return (
    <div className="ml-auto">
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
      Menu
      </Dropdown.Toggle>

      <Dropdown.Menu>
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
      </Dropdown.Menu>
    </Dropdown>
    </div>
  )
}

export default NavMenuDrop;
