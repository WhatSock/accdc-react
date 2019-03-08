import React from "react";

class TabPanelSculpture extends React.Component {
  render() {
    return (
      <div id="tab4content">
        <figure>
          <img
            alt="Sculpture of a woman on treasure island with San Francisco skyline at night"
            title="Sculpture of a woman on treasure island with San Francisco skyline at night"
            src={require("../../../img/tabs/sculpture.jpg")}
          />
          <figcaption>(photography by C. Wallenstein Garaventa)</figcaption>
        </figure>
      </div>
    );
  }
}

export default TabPanelSculpture;
