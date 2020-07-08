import React from "react";
import Header from "../sections/Header";
import TitleArea from "../sections/TitleArea";
import Footer from "../sections/Footer";

function Error(props) {
  console.log("props in Error component: ");
  console.log(props);
  return (
    <div className="authenticate-container">
      <Header />
      <div className="authenticate-area">
        <TitleArea game={true}/>
        <div className="authenticate-title">
          <div className="authenticate-title-wrapper">
             <h1 className="text-center">Error</h1>
             <p className="text-center text-danger" >{props.match.params.error}</p>
          </div>
        </div>
        <Footer authenticatePage={true}/>
      </div>
    </div>
  )
}

export default Error;
