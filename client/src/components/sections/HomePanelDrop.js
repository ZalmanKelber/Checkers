import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import AgainstComputer from "../menuItems/AgainstComputer";
import IsRed from "../menuItems/IsRed";
import Rules from "../menuItems/Rules";

function HomePanelDrop(props) {
  return (
    <form className="home-panel">
    <div className="bottom-options-wrapper">
      <div className="menu-wrapper">
        <Dropdown>
          <Dropdown.Toggle className="panel-button panel-button-header" variant="dark" id="dropdown-basic" block>
          Choose game type:
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <AgainstComputer handleChange={props.handleChange} />
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle className="panel-button panel-button-header" variant="dark" id="dropdown-basic" block>
          Choose which color to play:
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <IsRed handleChange={props.handleChange} />
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle className="panel-button panel-button-header" variant="dark" id="dropdown-basic" block>
          Select rules:
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Rules handleChange={props.handleChange} />
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <button onClick={props.handleSubmit} className="panel-button-submit" type="submit">START NEW GAME</button>
    </div>
    </form>
  );
}

export default HomePanelDrop;
