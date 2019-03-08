import React from "react";

let $A = window.AccDC;

class ModalSessionTimeoutDialog extends React.Component {
  handleClose(ev) {
    $A(this).unmount();
    ev.stopPropagation();
    ev.preventDefault();
  }
  handleSubmit(ev) {
    $A(this).unmount();
    $A("GlobalLoginDialog").mount();
    ev.preventDefault();
  }
  render() {
    return (
      <div>
        <div onClick={ev => this.handleClose(ev)} className="modalBackdrop">
          &nbsp;
        </div>
        <div className="modal">
          <div id="modal-timeout">
            <form onSubmit={ev => this.handleSubmit(ev)}>
              <p id="timeoutDescriptionId">
                Your session has expired.
                <br />
                <br />
                Would you like to enter your login credentials to proceed?
              </p>
              <p className="buttons-bar">
                <input
                  data-first="true"
                  data-focusfirst="true"
                  type="submit"
                  id="lbSubmitTimeout"
                  defaultValue="OK"
                />
                <input
                  type="reset"
                  data-last="true"
                  className="CloseModal"
                  id="lbCancelTimeout"
                  defaultValue="Cancel"
                  onClick={ev => this.handleClose(ev)}
                />
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalSessionTimeoutDialog;
