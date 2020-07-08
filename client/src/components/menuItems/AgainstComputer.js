import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

function AgainstComputer(props) {
  return (
    <ToggleButtonGroup name="againstComputer" className="button-group-layout" toggle>
      <ToggleButton className="panel-button panel-button-header" variant="dark" type="radio" name="againstComputer" disabled>
        Choose game type:
      </ToggleButton>
      <ToggleButton onChange={props.handleChange} className="panel-button" variant="outline-dark" type="radio" name="againstComputer" defaultChecked value="true">
        Play against computer
      </ToggleButton>
      <ToggleButton onChange={props.handleChange} className="panel-button" variant="outline-dark" type="radio" name="againstComputer" value="false">
        Play against user (must be logged in)
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default AgainstComputer;
