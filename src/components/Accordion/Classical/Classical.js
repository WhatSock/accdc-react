import React from "react";

class Classical extends React.Component {
  render() {
    return (
      <div id="accordion-sect2" className="content-panel">
        <p>
          <img
            src={require("../../../img/music/c_ba.jpg")}
            alt="Bach"
            title="Bach"
          />
        </p>
        <p>
          <img
            src={require("../../../img/music/c_be.jpg")}
            alt="Beethoven"
            title="Beethoven"
          />
        </p>
        <p>
          <img
            src={require("../../../img/music/c_c.jpg")}
            alt="Chopin"
            title="Chopin"
          />
        </p>
      </div>
    );
  }
}

export default Classical;
