import React from "react";

class AlternativeRock extends React.Component {
  render() {
    return (
      <div id="accordion-sect1" className="content-panel">
        <p>
          <img
            src={require("../../../img/music/ar_et_lts.jpg")}
            alt="Emiliana Torrini - Love in the Time of Science"
            title="Emiliana Torrini - Love in the Time of Science"
          />
        </p>
        <p>
          <img
            src={require("../../../img/music/ar_f_ll.jpg")}
            alt="Frente - Labour of Love"
            title="Frente - Labour of Love"
          />
        </p>
        <p>
          <img
            src={require("../../../img/music/ar_h_bwpm.jpg")}
            alt="Hooverphonic - Blue Wonder Power Milk"
            title="Hooverphonic - Blue Wonder Power Milk"
          />
        </p>
      </div>
    );
  }
}

export default AlternativeRock;
