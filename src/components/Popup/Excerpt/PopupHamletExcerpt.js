import React from "react";

let $A = window.AccDC;

class PopupHamletExcerpt extends React.Component {
  handleClose(ev) {
    $A(this).unmount();
    ev.preventDefault();
  }
  render() {
    return (
      <div id="popup-info">
        <h4>Hamlet: Act 3, Scene 2</h4>
        <p className="close">
          <a
            onClick={ev => this.handleClose(ev)}
            href="#close"
            className="popupClose"
          >
            <img
              src={require("../../../img/ic_close.svg")}
              alt="Close Popup"
              title="Close Popup"
            />
          </a>
        </p>
        <dl>
          <dt>HAMLET</dt>
          <dd>Do you see yonder cloud that's almost in shape of a camel?</dd>
          <dt>POLONIUS</dt>
          <dd>By th' mass, and 'tis like a camel indeed.</dd>
          <dt>HAMLET</dt>
          <dd>Methinks it is like a weasel.</dd>
          <dt>POLONIUS</dt>
          <dd>It is backed like a weasel.</dd>
          <dt>HAMLET</dt>
          <dd>Or like a whale.</dd>
          <dt>POLONIUS</dt>
          <dd>Very like a whale.</dd>
        </dl>
      </div>
    );
  }
}

export default PopupHamletExcerpt;
