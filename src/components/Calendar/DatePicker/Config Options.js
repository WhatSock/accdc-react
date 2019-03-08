config = {
  // Configure optional overrides

  // If not included, all of the below values are set by default

  // Short help text message that is automatically announced to screen reader users when the calendar first opens.
  helpTextShort: "Press H for help.",

  // Set screen reader text to automatically be announced when H is pressed.
  // This is also set within the data-helptext attribute in the top level div element of the calendar for CSS pseudo element referencing via attr(data-helptext) for sighted keyboard only users if desired.
  helpText:
    "Press the arrow keys to navigate by day, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year, or Escape to cancel.",

  // Set tooltip text
  tooltipTxt: "Press Escape to cancel",
  disabledTxt: "Disabled",
  markedTxt: "Selected",
  commentedTxt: "Has Comment",
  prevTxt: "Previous",
  nextTxt: "Next",
  monthTxt: "Month",
  yearTxt: "Year",

  // Set month names
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],

  // Set short and long weekday names
  days: [
    {
      s: "S",
      l: "Sunday"
    },
    {
      s: "M",
      l: "Monday"
    },
    {
      s: "T",
      l: "Tuesday"
    },
    {
      s: "W",
      l: "Wednesday"
    },
    {
      s: "T",
      l: "Thursday"
    },
    {
      s: "F",
      l: "Friday"
    },
    {
      s: "S",
      l: "Saturday"
    }
  ],

  // Switch the behaviour when the PageUp or PageDown keys are pressed to a "natural" behaviour
  // (PageUp goes to previous month, PageDown goes to next month)
  pageUpDownNatural: false,

  // Append a "dayToday" CSS class to the current day cell element - this allows styling to be targeted to this specific element
  highlightToday: true,

  // Fill in the day cells outside of the current month so that the calendar grid is always filled with day cells
  drawFullCalendar: true,

  // Run custom functions at the end of the code within the following component functions.
  // Receives a single parameter "dc", which provides access to the Datepicker object.
  runBefore: function(dc) {
    console.log("runBefore");
    console.log(dc);
  },
  runAfterClose: function(dc) {
    console.log("runAfterClose");
    console.log(dc);
  },

  // Override the character used on the month / year change buttons
  leftButtonYearText: "&lt;",
  rightButtonYearText: "&gt;",
  leftButtonMonthText: "&lt;",
  rightButtonMonthText: "&gt;",

  // Specify if the calendar should open when the input field receives focus.
  // If true, the Down arrow must be pressed to move focus from the input field into the calendar for manual traversal, and Escape will collapse the calendar.
  openOnFocus: false,
  openOnFocusHelpText:
    "Press Down arrow to browse the calendar, or Escape to close.",

  // Display a Close button
  showEscBtn: true,
  escBtnName: "Close",
  escBtnIcon: "&times;",

  // Set specific start / end boundaries of a date range. Can be Date objects (absolute boundaries), or positive/negative integers (relative boundaries).
  // If undefined, no date range will be enforced.
  minDate: undefined,
  maxDate: undefined,

  // Using a token system, set a specific date string format to be used when setting the selected value into the calendar input box
  // 'YYYY': 4 digit year, 2019
  // 'MMMM': Full name of month, January, etc.
  // 'dddd': Full name of weekday, Monday, etc.
  // 'MM': 2 digit month, 01, etc.
  // 'DD': 2 digit day, 01, etc.
  // 'Do': getDateOrdinalSuffix, 1st, 2nd, 3rd.
  // 'M': 1 or 2 digit month, 1 through 12
  // 'D': 1 or 2 digit day, 1 through 31.

  inputDateFormat: "MM/DD/YYYY",

  // Using a token system, set a specific date string format to be read out to screen reader users
  audibleDateFormat: "D, dddd MMMM YYYY",

  // Allow a date that isn't today to be set as the initial date. If unset, this value is initialised to today's date
  initialDate: new Date(),

  // Disable weekdays from selection
  disableWeekdays: false,

  // Disable weekends from selection
  disableWeekends: false,

  // Set positive or negative offset for differing column arrangements, or 0 for none
  wdOffset: 0,

  // Set CSS positioning calculation for the calendar
  // Set to 0 to disable auto positioning
  autoPosition: 9,

  // Customize with positive or negative offsets
  offsetTop: 0,
  offsetLeft: 0,

  // Set class for the calendar container
  className: "calendar",

  // Set custom CSS styling for the calendar container when rendered
  cssObj: {
    position: "absolute",
    zIndex: 1
  },

  // Choose a different insertion point in the DOM; must be a DOM node; defaults to the triggering element if not specified.
  targetObj: null,

  // Choose a different focus element in the DOM for CSS autoPositioning; may be a DOM node or CSS Selector; defaults to the triggering element if not specified.
  posAnchor: "",

  // Reset date to the current calendar date every time the date picker opens
  resetCurrent: false,

  // Configure the Comments tooltip pane
  comments: {
    role: "Comment",
    autoPosition: 1,
    offsetTop: 0,
    offsetLeft: 0,
    className: "commentTooltip"
  },

  // Configure the editor form pane
  editor: {
    // Choose to show the form, defaults to false
    show: false,
    // Set the section name, and the Edit button text
    role: "Edit",
    autoPosition: 6,
    offsetTop: 0,
    offsetLeft: 0,
    className: "commentAdd",
    // Set the Save button text
    action1: "Save"
  },

  // Condense the year display by removing the year nav buttons. Requires the Calendar Module version 1.25 or greater.
  condenseYear: false,

  // Manually configure the calendar using AJAX or a customization script
  ajax: function(dc, save) {
    // 'save' is true when closing the Editor, false otherwise for fetching content when the calendar is opened.

    // If save is false, execute load script

    if (!save) {
      // Optionally load custom values into the dc.range associative array.

      // And optionally prevent this script from running again
      // dc.stopAjax = true;

      // Then open the calendar after processing is finished
      dc.open();
    } else {
      // Otherwise do something with the newly saved values within the dc.range associative array.
    }
  }
};
