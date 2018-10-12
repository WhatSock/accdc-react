import React from "react";

class TabPanelGrapes extends React.Component {
  render() {
    return (
      <div id="tab2content">
        <figure>
          <img
            alt="Wine grapes on the vine, hopland, ca"
            title="Wine grapes on the vine, hopland, ca"
            src={require("../../../img/tabs/grapes.jpg")}
          />
          <figcaption>(photography by C. Wallenstein Garaventa)</figcaption>
        </figure>
      </div>
    );
  }
}

export default TabPanelGrapes;
