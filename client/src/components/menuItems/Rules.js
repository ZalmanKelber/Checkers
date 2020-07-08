import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

function Rules(props) {
  return(
    <ToggleButtonGroup className="button-group-layout" name="rules" toggle>
      <ToggleButton className="panel-button panel-button-header" variant="dark" type="radio" name="rules" disabled>
        Select rules:
      </ToggleButton>
      <ToggleButton onChange={props.handleChange} className="panel-button" variant="outline-dark" type="radio" name="rules" defaultChecked value="0">
        Move freely
      </ToggleButton>
      <ToggleButton onChange={props.handleChange} className="panel-button" variant="outline-dark" type="radio" name="rules" value="1">
        Must jump when possible
      </ToggleButton>
      <ToggleButton onChange={props.handleChange} className="panel-button" variant="outline-dark" type="radio" name="rules" value="2">
        Must jump until end of path
      </ToggleButton>
      <ToggleButton onChange={props.handleChange} className="panel-button" variant="outline-dark" type="radio" name="rules" value="3">
        Must jump longest path
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default Rules;
