import React from "react";

class ClassicRock extends React.Component {
  render() {
    return (
      <div id="accordion-sect2" className="content-panel">
        <p>
        <img
          src={require('../../../img/accordion/r_gnr_uyi.jpg')} 
          alt="Guns N' Roses - Use Your Illusion 1"
          title="Guns N' Roses - Use Your Illusion 1"
        />
        </p>
        <p>
        <img
          src={require('../../../img/accordion/r_pj_t.jpg')} 
          alt="Pearl Jam - Ten"
          title="Pearl Jam - Ten"
        />
        </p>
        <p>
        <img
          src={require('../../../img/accordion/r_pf_dst.jpg')} 
          alt="Pink Floyd - Delicate Sound of Thunder"
          title="Pink Floyd - Delicate Sound of Thunder"
        />
        </p>
      </div>
    );
  }
}

export default ClassicRock;

