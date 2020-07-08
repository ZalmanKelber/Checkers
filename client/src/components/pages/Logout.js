import React from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";

function Logout() {

  const [redirectRoute, setRedirectRoute] = React.useState("");

  React.useEffect(() => {
    const transport = axios.create({
      withCredentials: true
    });

    transport.post("/server/logout/").catch(err => {
      console.log(err);
    }).then(response => {
      console.log(response && response.data);
      setRedirectRoute("/");
    });
  });

  return (
    <div>
    {
      redirectRoute && <Redirect to={{pathname: redirectRoute}} />
    }
    Logging out...
    </div>
  )
}

export default Logout;
