import React from "react";
import Form from "react-bootstrap/Form";
import AgainstComputer from "../menuItems/AgainstComputer";
import IsRed from "../menuItems/IsRed";
import Rules from "../menuItems/Rules";

function HomePanel(props) {

  return (
      <Form className="home-panel" onSubmit={props.handleSubmit}>
      <br/>
        <AgainstComputer handleChange={props.handleChange} />
        <br />
        <IsRed handleChange={props.handleChange} />
        <br />
        <Rules handleChange={props.handleChange} />
        <br />
        <button className="panel-button-submit" type="submit">START NEW GAME</button>
      </Form>
  );
}

export default HomePanel;
