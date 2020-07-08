import React from "react";

function NavContent(props) {
  return (
    <ul className="navbar-nav ml-auto custom-nav-ul">
      {
        props.game && (
          <li className="nav-item">
            <a className="nav-link custom-nav-link" href="" onClick={props.redirectHome}>Home</a>
          </li>
        )
      }
      <li className="nav-item">
        <a className="nav-link custom-nav-link" href="" onClick={props.redirectAbout}>About</a>
      </li>
      <li className="nav-item">
        <a className="nav-link custom-nav-link" href="" onClick={props.redirectStatistics}>Current Games</a>
      </li>
      {
        props.isLoggedIn && (
          <li className="nav-item">
            <a className="nav-link custom-nav-link" href="" onClick={props.redirectLogout}>Logout</a>
          </li>
        )
      }
      {
        !props.isLoggedIn && (
          <li className="nav-item">
            <a className="nav-link custom-nav-link" href="" onClick={props.redirectLogin}>Login</a>
          </li>
        )
      }
      {
        !props.isLoggedIn && (
          <li className="nav-item">
            <a className="nav-link custom-nav-link" href="" onClick={props.redirectRegister}>Sign Up</a>
          </li>
        )
      }
    </ul>
  )
}

export default NavContent;
