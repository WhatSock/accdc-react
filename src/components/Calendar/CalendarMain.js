import React from "react";
import DatePicker from "./DatePicker/DatePicker";

/* Directions for Accessible Date Pickers

1. Import the general DatePicker object from "./DatePicker/DatePicker.js".

2. Add a <DatePicker> element declaration, and make sure that all of the required attributes are properly set within that element.
*/

let $A = window.AccDC;

class CalendarMain extends React.Component {
  changeURL(id) {
    document.title = id;
    window.history.pushState(
      { html: document.html, pageTitle: id },
      "",
      "./#main-tab-" + id.toLowerCase()
    );
  }
  render() {
    this.changeURL("Calendar");
    return (
      <div id="pg-calendar">
        <div className="hd">
          <h3>
            <span> Accessible Calendar Picker</span>
          </h3>
        </div>
        <div className="intro highlight">
          <p>
            A calendar picker control simplifies the task of selecting dates by
            rendering a miniature calendar.
          </p>
        </div>
        <div className="intro tal demo-block">
          <div class="insertCalendar">
            <DatePicker
              label="Your Birthday:"
              inputId="date"
              inputName="bd"
              triggerId="dateLnk"
              readOnly="readonly"
              required="required"
              config={{
                openOnFocus: true,
                callback: function(event, DC, inputElement) {
                  // Perform a custom callback when a date is activated from the calendar instead of using the default module functionality.
                  // event is the event object that was passed to this callback, may be either from onClick or onKeyDown or onKeyUp.
                  // DC is the current calendar DC object instance in the AccDC API (window.AccDC).
                  // DC.date is the Date instance object for the activated date when chosen.

                  // inputElement is the intended target element for the date string.
                  inputElement.value = DC.formatDate(DC);
                  // Close the calendar after saving the formatted date string as desired.
                  DC.close();
                  // Set focus to the input field to ensure intuitive keyboard accessibility.
                  inputElement.focus();

                  // Now that a new date has been selected, clear the second input field so it can't include a stored value by mistake.
                  // Gets the input element with id="party"
                  $A.getElement("party").value = "";

                  // Now dynamically set a disabled date range for the second calendar using the newly saved date as the starting point.

                  // Get a reference to the second calendar's DC object using the 'triggerId' of that element as the reference within AccDC.
                  var partyDC = $A("partyLnk");

                  // Set a new initial Date instance for Calendar2 (Party Date)
                  // Starts with the initial reference to reflect the recently chosen date for Birthday.
                  partyDC.initialDate = new Date(
                    DC.date.getFullYear(),
                    DC.date.getMonth(),
                    DC.date.getDate()
                  );

                  // Now set a Date instance as the minimum to start a disabled date range, using partyDC.initialDate as the starting point with -7 days as the offset.
                  partyDC.minDate = new Date(
                    DC.date.getFullYear(),
                    DC.date.getMonth(),
                    DC.date.getDate() + -7
                  );

                  // Set a Date instance as the maximum to end a disabled date range, using partyDC.initialDate as the starting point with 7 days ahead as the offset.
                  partyDC.maxDate = new Date(
                    DC.date.getFullYear(),
                    DC.date.getMonth(),
                    DC.date.getDate() + 7
                  );

                  // Now, set all of these variables within Calendar2 to configure it without opening it.
                  partyDC.presetDate(partyDC);

                  // Now make the second calendar actionable since it was initially disabled when first initialized.
                  partyDC.setDisabled(false);
                }
              }}
            />
          </div>
          <div class="insertCalendar">
            <DatePicker
              label="Party Date:"
              inputId="party"
              inputName="pd"
              triggerId="partyLnk"
              readOnly="readonly"
              disabled="disabled"
            />
          </div>
        </div>
        <div className="intro tal keyboard">
          <p>The calendar is keyboard accessible:</p>
          <ul>
            <li>
              Set focus to the input field to automatically open the calendar,
              focus will remain on the input field.
            </li>
            <li>
              When the input has focus, press the
              <kbd className="down">Down</kbd> arrow to set focus on the current
              date within the calendar.
            </li>
            <li>
              Press the <kbd className="left">Left</kbd> and
              <kbd className="right">Right</kbd> arrow keys to navigate the row
              by week day.
            </li>
            <li>
              Press the <kbd className="home">Home</kbd> and
              <kbd className="end">End</kbd> keys to jump to the beginning or
              end of the current row.
            </li>
            <li>
              Press the <kbd className="up">Up</kbd> and
              <kbd className="down">Down</kbd> arrow keys to navigate between
              weeks on the same week day.
            </li>
            <li>
              Press the <kbd>PageDown</kbd> and <kbd>PageUp</kbd> keys to
              navigate backwards or forwards by month.
            </li>
            <li>
              Press
              <kbd>
                <kbd>Alt</kbd>+<kbd>PageDown</kbd>
              </kbd>
              and
              <kbd>
                <kbd>Alt</kbd>+<kbd>PageUp</kbd>
              </kbd>
              to navigate backwards or forwards by year.
            </li>
            <li>
              Press the <kbd>Enter</kbd> key to activate the selected date.
            </li>
            <li>
              Press <kbd>Escape</kbd> to close the calendar without making a
              selection.
            </li>
            <li>Mouse users can click the desired date buttons as usual.</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default CalendarMain;
