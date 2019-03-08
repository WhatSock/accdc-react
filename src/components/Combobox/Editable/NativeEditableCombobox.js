import React from "react";
import zenscroll from "zenscroll";
import strap from "../../../AccDC/DC";

/* Directions for Accessible Comboboxes

1. Import AccDC/DC.

2. Include a target edit field for use as a combobox field on the page, and ensure it has a unique ID plus a role="combobox" attribute. Also specify if it is meant to be read-only or not by adding or omitting the readonly attribute. The HTML5 required attribute can also be added to enhance functionality as needed.

3. Optionally add an image icon as a dropdown triggering element next to the edit field, make sure it has a unique ID attribute, ensure it includes a valid role and accessible label in accordance with the ARIA spec. This will be set during configuration using the myCombobox instance object after initialization. (View the Readonly Combobox for example.)

4. Populate the native hidden select element that is used to configure the available dropdown options when using the combobox. To create a Multiselect combobox, add the 'multiple' attribute to the hidden select element. View the external ReadMe file for related instructions for using this feature.
*/

import HiddenOptions from "./Options";
window.noZensmooth = true;

let $A = window.AccDC;

class NativeEditableCombobox extends React.Component {
  componentDidMount() {
    this.myCombobox = strap.setCombobox(this, {
      input: "#stt", // CSS selector or DOM node
      select: "#states", // CSS selector or DOM node
      overrides: {
        role: "States",
        className: "top-container clearfix",
        middleClass: "mid-container clearfix",
        listboxClass: "listbox clearfix",
        optionClass: "option clearfix",
        activeClass: "active",
        toggleClass: "pressed"
      }
    });

    // Normalize scrollIntoView functionality using a custom function.
    this.myCombobox.scrollIntoView = this.scrollIntoViewOverride;

    // Disable auto population of default value
    this.myCombobox.setDefault(false);

    // Force the highlighted value to be automatically saved when focus moves away from the Combobox
    this.myCombobox.setAutoComplete(true);

    // Logic to distinguish between touch screen devices
    if (!$A.isTouch()) {
      // For desktops, add screen reader accessible keyboard instructions
      this.myCombobox.setPromptText(
        "First type then press the down arrow to browse available matches"
      );
      // Set a default list option display size for standard desktop screens
      this.myCombobox.setSize(6);
    } else {
      // Otherwise, set a prompt for touch device users when using a screen reader like VoiceOver or TalkBack
      this.myCombobox.setPromptText(
        "First type then scroll through available matches"
      );

      // Set a default list option display size for touch screens, 3 for phones, 5 for tablets, 6 for others
      if ($A.device.type === "mobile") this.myCombobox.setSize(3);
      else if ($A.device.type === "tablet") this.myCombobox.setSize(5);
      else this.myCombobox.setSize(6);
    }

    // Optionally process after the suggestion listbox window is opened
    this.myCombobox.onOpen(function(dc) {
      // Do something
    });

    // Process after the suggestion listbox window is closed
    this.myCombobox.onClose(function(dc) {
      // Do something
    });

    // Now activate the configured combobox instance
    this.myCombobox.start();

    /* AJAX updating of dynamically loaded suggest values is supported.
Simply use a fetch request as shown within src/index.js by loading the desired options using JSON, XML, HTML, or text, then dynamically add or replace the newly loaded options within the hidden select element associated with this combobox.
After all of the new options are loaded within the select element, call the myCombobox.update() method to rebuild the combobox.
Example: this.myCombobox.update();
*/
  }
  scrollIntoViewOverride(optionNode, cbInstance) {
    // cbInstance.listboxNode is the parent role="listbox" container element
    if (cbInstance.listboxNode !== cbInstance.listboxNodeLast) {
      // Only create a new myScroller instance when a new listbox is rendered.
      cbInstance.listboxNodeLast = cbInstance.listboxNode;
      cbInstance.myScroller = zenscroll.createScroller(
        cbInstance.listboxNode,
        200,
        0
      );
    }
    if (cbInstance.myScroller)
      // optionNode is the newly highlighted role="option" node for scrolling into view.
      cbInstance.myScroller.center(optionNode);
  }
  render() {
    return (
      <p>
        <label htmlFor="stt">State or province:</label>
        <input
          role="combobox"
          aria-expanded="false"
          type="text"
          name="state-input-value"
          required
          id="stt"
        />
        <HiddenOptions />
      </p>
    );
  }
}

export default NativeEditableCombobox;
