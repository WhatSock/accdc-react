import React from "react";
import strap from "../../AccDC/DC";

/* Directions for Accessible Date Pickers

1. Import AccDC/DC.

2. Include a target edit field for use as a date picker field on the page, and ensure it has a unique ID. Also specify if it is meant to be read-only or not by adding or omitting the readonly attribute. It is a best practice to always make such fields editable and then use a formatting script to ensure the correct format after focus moves out of the field.

3. Add a native link or button as a Calendar triggering element next to the edit field, make sure it has a unique ID attribute, ensure it includes the attribute data-widget="calendar", and include a data-controls attribute that references the ID attribute of the associated edit field in step 2.

4. Run the setCalendar(() function with custom overrides to create the date picker functionality.

5. To individualize different calendar types, break out the instructions above for use within separate React components so they can be configured seperatly.
*/

class CalendarMain extends React.Component {
  componentDidMount() {
    strap.setCalendar(this, {
      overrides: {
        inputDateFormat: "MM/DD/YYYY"

        /* Date constant values
                    YYYY: 4 digit year string
                    MMMM: Full month name
                    M: 1 or 2 digit month index value starts with 1
                    MM: 2 digit month index value starts at 01
                    dddd: Full weekday name
                    Do: String with string qualifier such as 1st, 2nd, 3rd, etc.
                    D: 1 or 2 digit day string starts with 1
                    DD: 2 digit date string starts with 01
*/

        /* Do extra stuff if you want
        runAfter: function(DC) {
          DC.css({
            top:
              DC.outerNode.offsetHeight /
                window.AccDC.getWindow().height *
                0.5 *
                100 +
              "%"
          });
        }
*/
      }
    });
  }
  render() {
    return (
      <div id="pg-calendar">
        <div className="hd">
          <h3>
            <span> Accessible Calendar Picker</span>
          </h3>
        </div>
        <div className="intro highlight">
          <p>
            {" "}
            A calendar picker control simplifies the task of selecting dates by
            rendering a miniature calendar.
          </p>
        </div>
        <div className="intro tal demo-block">
          <p>
            <label htmlFor="date">Set Birth Date:</label>
            <input id="date" type="text" name="bd" />
            <a
              role="button"
              aria-describedby="date"
              href="#date"
              id="dateLnk"
              className="accCalendar datePicker"
              data-widget="calendar"
              data-controls="date"
            >
              <img
                src={require("../../img/calendar/calendar-button.svg")}
                alt="Birth Date Calendar Picker"
                title="Birth Date Calendar Picker"
              />
            </a>
          </p>
          <p>
            <label htmlFor="party">Set Party Date:</label>
            <input id="party" type="text" name="pd" />
            <a
              role="button"
              aria-describedby="party"
              href="#date"
              id="partyLnk"
              className="accCalendar datePicker"
              data-widget="calendar"
              data-controls="party"
            >
              <img
                src={require("../../img/calendar/calendar-button.svg")}
                alt="Party Date Calendar Picker"
                title="Party Date Calendar Picker"
              />
            </a>
          </p>
        </div>
        <div className="intro tal keyboard">
          <p>The calendar is keyboard accessible:</p>
          <ul>
            <li>
              When the calendar is opened, focus is set on the current date.
            </li>
            <li>
              Press the <kbd className="left">Left</kbd> and{" "}
              <kbd className="right">Right</kbd> arrow keys to navigate the row
              by week day.
            </li>
            <li>
              Press the <kbd className="home">Home</kbd> and{" "}
              <kbd className="end">End</kbd> keys to jump to the beginning or
              end of the current row.
            </li>
            <li>
              Press the <kbd className="up">Up</kbd> and{" "}
              <kbd className="down">Down</kbd> arrow keys to navigate between
              weeks on the same week day.
            </li>
            <li>
              Press the <kbd>PageDown</kbd> and <kbd>PageUp</kbd> keys to
              navigate backwards or forwards by month.
            </li>
            <li>
              Press{" "}
              <kbd>
                <kbd>Alt</kbd>+<kbd>PageDown</kbd>
              </kbd>{" "}
              and{" "}
              <kbd>
                <kbd>Alt</kbd>+<kbd>PageUp</kbd>
              </kbd>{" "}
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
