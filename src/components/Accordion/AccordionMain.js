import React from "react";
import strap from "../../AccDC/DC";

/* Directions for Accessible Accordions

1. Import AccDC/DC.

2. Import or create named React components to render accordion content.

3. Using a native button or link as triggering elements, add a data-accordiongroup attribute to all shared accordion triggering elements.

4. Ensure all triggering elements include a unique ID attribute, as well as all DOM container elements where each accordion component will be rendered.

5. Add a data-insert attribute to each triggering element, and ensure its value matches the ID attribute of the associated container element.

6. Add a data-defaultopen="true" attribute to the triggering element of any accordion that is meant to open when first loaded.

7. Add a data-controls attribute to each triggering element and make sure the name of the attribute matches the object property name of the related React component as submitted to setAccordion().
*/

// Import all React component regions controlled by this accordion
import AlternativeRock from "./Alternative/AlternativeRock";
import Classical from "./Classical/Classical";
import ClassicRock from "./Rock/ClassicRock";

class AccordionMain extends React.Component {
  componentDidMount() {
    strap.setAccordion(
      this,
      {
        Alternative: <AlternativeRock />,
        Classical: <Classical />,
        Rock: <ClassicRock />
      },
      {
        // callback: function(DC, isOpen) {
        // if (isOpen) window.AccDC.beep();
        // },

        isToggle: false,
        allowMultiple: false,

        overrides: {
          toggleClassName: "open"
        }
      }
    );
  }
  render() {
    return (
      <div id="pg-accordion">
        <div className="hd">
          <h3>
            <span>Accessible Accordion</span>
          </h3>
        </div>
        <div className="intro highlight">
          <p>
            An accordion control groups related information within expandable
            and collapsable sections.
          </p>
        </div>
        <div className="intro tal viewport demo-block">
          <div className="accordionGroup">
            <h3>
              <button
                className="accAccordion"
                data-controls="Alternative"
                data-insert="sect1"
                data-defaultopen="true"
                data-accordiongroup="musicAccordion"
                id="accordion1id"
              >
                Alternative Rock
              </button>
            </h3>
            <div id="sect1" />
            <h3>
              <button
                className="accAccordion"
                data-controls="Classical"
                data-insert="sect2"
                data-accordiongroup="musicAccordion"
                id="accordion2id"
              >
                Classical Composers
              </button>
            </h3>
            <div id="sect2" />
            <h3>
              <button
                className="accAccordion"
                data-controls="Rock"
                data-insert="sect3"
                data-accordiongroup="musicAccordion"
                id="accordion3id"
              >
                Hard Rock
              </button>
            </h3>
            <div id="sect3" />
          </div>
        </div>
        <div className="intro tal keyboard">
          <p>The accordion controls are keyboard accessible:</p>
          <ul>
            <li>
              Press <kbd>Tab</kbd> to navigate between accordion controls.
            </li>
            <li>
              Press <kbd>Enter</kbd> to expand an accordion section.
            </li>
            <li>
              Mouse users can click the desired accordion as usual to activate.
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default AccordionMain;
