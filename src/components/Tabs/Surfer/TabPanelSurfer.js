import React from "react";

class TabPanelSurfer extends React.Component {
  render() {
    return (
      <div id="tab1content">
        <figure>
          <img
            alt="Older surfer coming in from the water carrying an orange and white surf board, Pacifica, ca"
            title="Older surfer coming in from the water carrying an orange and white surf board, Pacifica, ca"
            src={require("../../../img/tabs/surfer.jpg")}
          />
          <figcaption>(photography by C. Wallenstein Garaventa)</figcaption>
        </figure>
      </div>
    );
  }
}

export default TabPanelSurfer;
