import React from "react";
import DatePicker from "./DatePicker/DatePicker";

/* Accessible Date Pickers Markup Syntax
1. Import general DatePicker object from "./DatePicker/DatePicker.js".
2. Configure DatePicker property attributes to set calendar features as desired.

Note: Some property attributes are optional, others are required and must always be set.

Required Properties

label // Sets the visible label element text for the input field.
inputId // Sets the ID attribute for the input element, and explicitly associates this with the label element.
inputName // Sets the name attribute for the input field for form submission processing.
triggerId // Sets the ID attribute for the calendar active element button icon.

Optional Properties

triggerAlt // Sets the alt and title attributes for the calendar active element button image icon. Default: "Calendar".
readOnly // Sets the input element as readonly. Default: False.
disabled // Sets the initial disabled flag for the calendar. Default: False.
required // Sets the required state of the input element. Default: False.
config // Sets calendar functionality overrides if desired. Default: Null.

*/

class Calendar extends React.Component {
  render() {
    return (
      <DatePicker
        label="Visible Field Name:"
        inputId="uniqueID4Input"
        inputName="uniqueName4Input"
        triggerId="uniqueID4TriggerButton"
        triggerAlt="Accessible alt text for calendar button"
        readOnly="readonly"
        disabled="disabled"
        required="required"
        config={
          {
            // Config options to configure calendar functionality
          }
        }
      />
    );
  }
}

export default Calendar;
