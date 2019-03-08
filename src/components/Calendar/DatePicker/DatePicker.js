import React from "react";
import strap from "../../../AccDC/DC";
import "./css/style.css";

let $A = window.AccDC;

/* Accessible Date Pickers, General Template Design Pattern

Import this file as a DatePicker into any external page, and configure each calendar using the attribute overrides provided within the Markup Syntax template to set specific configuration options.

this.props.label
this.props.inputId
this.props.inputName
this.props.readOnly
this.props.disabled
this.props.required

this.props.triggerId
this.props.triggerAlt

this.props.config

*/

class DatePicker extends React.Component {
  componentDidMount() {
    // Save React object properties (this.props) for use within calendar DC object method callbacks.
    var props = this.props;
    // Set default properties to be set if not overridden using this.props.config
    var config = {
      inputDateFormat: "MM/DD/YYYY",

      // Specify if the calendar should open when the input field receives focus.
      // If true, the Down arrow must be pressed to move focus from the input field into the calendar for manual traversal, and Escape will collapse the calendar.
      // Tab will also move focus into the calendar when rendered to prevent confusion.
      openOnFocus: true,
      // Set help text for screen reader users for desktop keyboard usage. (Ignored on mobile using touch.)
      openOnFocusHelpText:
        "Press Down arrow to browse the calendar, or Escape to close.",

      // Display a Close button
      showEscBtn: true,
      escBtnName: "Close",
      escBtnIcon: "&times;",

      // Set default calendar state.
      // When true, the disabled attribute will automatically be applied to both the input element and the triggering element button.
      disabled: props.disabled ? true : false,

      overrides: {
        runAfter: function(DC) {
          // Perform action every time after calendar finishes rendering.
          $A.removeClass(
            $A.query('kbd[data-id="' + props.inputId + '"]')[0],
            "hidden"
          );
        },
        runAfterClose: function(DC) {
          // Perform action every time after calendar finishes closing.
          $A.addClass(
            $A.query('kbd[data-id="' + props.inputId + '"]')[0],
            "hidden"
          );
        }
      }
    };
    // Extend config properties with ones passed in using this.props.config as overrides
    $A.extend(true, config, this.props.config || {});
    strap.setCalendar(this, config);
  }
  render() {
    return (
      <span>
        <label htmlFor={this.props.inputId}>{this.props.label}</label>
        <input
          id={this.props.inputId}
          name={this.props.inputName}
          readonly={this.props.readOnly}
          required={this.props.required}
          aria-required={this.props.required ? "true" : "false"}
          type="text"
          placeholder="MM/DD/YYYY"
          className="input-date-field"
        />
        <kbd className="down hidden" data-id={this.props.inputId} />
        <a
          role="button"
          data-controls={this.props.inputId}
          aria-describedby={this.props.inputId}
          id={this.props.triggerId}
          href="#calendar"
          className="accCalendar datePicker"
          data-widget="calendar"
        >
          <img
            src={require("./img/calendar-button.svg")}
            alt={this.props.triggerAlt || "Calendar"}
            title={this.props.triggerAlt || "Calendar"}
          />
        </a>
      </span>
    );
  }
}

export default DatePicker;
