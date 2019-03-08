import React from "react";

let $A = window.AccDC;

class Banner extends React.Component {
  handleActivate(ev) {
    alert("Do something...");
    $A(this).unmount();
    ev.stopPropagation();
    ev.preventDefault();
  }
  render() {
    return (
      <div id="ad-2">
        <div className="h2">
          Lost
          <br />
          at
          <br />
          sea?
        </div>
        <ul id="boat">
          <li>
            <div id="question-mark" />
          </li>
        </ul>
        <ul id="water">
          <li id="water-back" />
          <li id="water-front" />
        </ul>
        <div id="content">
          <div className="h3">
            Relax.
            <br />
            We've got your rudder.
          </div>
          <a
            role="button"
            href="#activate"
            onClick={ev => this.handleActivate(ev)}
          >
            Guide me!
          </a>
        </div>
      </div>
    );
  }
}

export default Banner;
