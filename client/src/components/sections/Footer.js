import React from "react";

function Footer(props) {
  const year = new Date().getFullYear();
  return (
      <p className={props.authenticatePage? "authenticate-footer text-center" : "footer"}>Zalman Kelber,  {year}</p>
  );
}

export default Footer;
