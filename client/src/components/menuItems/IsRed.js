import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

function IsRed(props) {
  return (
    <ToggleButtonGroup name="isRed" className="button-group-layout" toggle>
      <ToggleButton className="panel-button panel-button-header" variant="dark" type="radio" name="isRed" disabled>
        Choose which color to play:
      </ToggleButton>
      <ToggleButton onChange={props.handleChange} className="panel-button" variant="outline-dark" type="radio" name="isRed" defaultChecked value="false">
        Black (goes first)
      </ToggleButton>
      <ToggleButton onChange={props.handleChange} className="panel-button" variant="outline-dark" type="radio" name="isRed" value="true">
        Red (goes second)
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default IsRed;
