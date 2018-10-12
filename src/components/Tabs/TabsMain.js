import React from "react";
import strap from "../../AccDC/DC";

/* Directions for Accessible Tabs

1. Import AccDC/DC.

2. Import or create named React components to render tab content.

3. Ensure that all Tab triggering elements include role="tab", and that the container element for these grouped controls includes role="tablist". Never nest role="tablist" containers.

4. Ensure all triggering elements include a unique ID attribute, as well as all DOM container elements where each tab component will be rendered.

5. Add a data-insert attribute to each triggering element, and ensure its value matches the ID attribute of the associated container element.

6. Add a data-defaultopen="true" attribute to the triggering element of any tab that is meant to open when first loaded.

7. Add a data-controls attribute to each triggering element and make sure the name of the attribute matches the object property name of the related React component as submitted to setTabList().

IMPORTANT: To ensure proper functionality when creating ARIA Tabs, enable Visual ARIA and then use the keyboard to verify that all roles and focus handling is done correctly in accordance with the ARIA spec.
*/

// Import all React component TabPanels controlled by this Tablist
import Grapes from "./Grapes/TabPanelGrapes";
import Sculpture from "./Sculpture/TabPanelSculpture";
import Surfer from "./Surfer/TabPanelSurfer";
import Trees from "./Trees/TabPanelTrees";

class TabsMain extends React.Component {
  componentDidMount() {
    strap.setTabList(
      this,
      {
        Grapes: <Grapes />,
        Sculpture: <Sculpture />,
        Surfer: <Surfer />,
        Trees: <Trees />
      },
      {
        // callback: function(DC, isOpen) {
        // if (isOpen) window.AccDC.beep();
        // },

        overrides: {
          toggleClassName: "active"
        }
      }
    );
  }
  render() {
    return (
      <div id="pg-tabs">
        <div className="hd">
          <h3>
            <span>Accessible Tabs</span>
          </h3>
        </div>
        <div className="intro highlight">
          <p>
            A tab control is a selection mechanism that conditionally renders
            dynamic content.
          </p>
        </div>
        <div className="demo-block">
          <ul className="tabs ARIA" role="tablist" aria-level="2">
            <li
              id="tab1id"
              className="accTab tab tab1"
              role="tab"
              data-controls="Surfer"
              data-defaultopen="true"
              data-insert="tabInsertId"
            >
              <span>Surfer</span>
            </li>
            <li
              id="tab2id"
              className="accTab tab tab2"
              role="tab"
              data-controls="Grapes"
              data-insert="tabInsertId"
            >
              <span>Grapes</span>
            </li>
            <li
              id="tab3id"
              className="accTab tab tab3"
              role="tab"
              data-controls="Trees"
              data-insert="tabInsertId"
            >
              <span>Trees</span>
            </li>
            <li
              id="tab4id"
              className="accTab tab tab4"
              role="tab"
              data-controls="Sculpture"
              data-insert="tabInsertId"
            >
              <span>Sculpture</span>
            </li>
          </ul>
          <div className="content" id="tabInsertId" />
        </div>
        <div className="intro tal keyboard">
          <p> The tab controls are keyboard accessible:</p>
          <ul>
            <li>Set focus on the tab control.</li>
            <li>Press the Arrow keys to move focus between tabs.</li>
            <li>
              Press <kbd className="home">Home</kbd> or{" "}
              <kbd className="end">End</kbd> to move to the first or last tab.
            </li>
            <li>
              Press any letter or number to jump to a tab starting with that
              character or digit.
            </li>
            <li>
              Press the <kbd>Spacebar</kbd> to open (or optionally toggle if
              configured) the selected tab.
            </li>
            <li>Mouse users can click the desired tab as usual.</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default TabsMain;
