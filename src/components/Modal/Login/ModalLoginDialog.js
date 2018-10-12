import React from "react";

let $A = window.AccDC;

class ModalLoginDialog extends React.Component {
  handleClose(ev) {
    $A(this).unmount();
    ev.stopPropagation();
    ev.preventDefault();
  }
  handleSubmit(ev) {
    let form = ev.target;
    if (!form.uname.value) {
      alert("Woops! You forgot your username...");
      form.uname.focus();
    } else if (!form.pass.value) {
      alert("Woops! You forgot your password...");
      form.pass.focus();
    } else {
      alert("WOW!");
      $A(this).unmount();
    }
    ev.preventDefault();
  }
  render() {
    return (
      <div>
        <div onClick={ev => this.handleClose(ev)} className="modalBackdrop">
          &nbsp;
        </div>
        <div className="modal">
          <div id="modal-login">
            <form onSubmit={ev => this.handleSubmit(ev)} id="lbForm">
              <p id="loginDescriptionId">
                Enter your login credentials to proceed.
              </p>
              <p>
                <label htmlFor="uname">Username:</label>
                <input
                  data-first="true"
                  data-focusfirst="true"
                  type="text"
                  id="uname"
                  name="uname"
                />
              </p>
              <p>
                <label htmlFor="pass">Password:</label>
                <input type="password" id="pass" name="pass" />
              </p>
              <p className="buttons-bar">
                <input type="submit" id="lbSubmit" defaultValue="OK" />
                <input
                  type="reset"
                  data-last="true"
                  className="CloseModal"
                  id="lbCancel"
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

export default ModalLoginDialog;
