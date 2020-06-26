import React from 'react';

const Modal = ({message = '', onConfirm}) => {

    return (
      <div className={`modal ${message ? 'show': ''}`}>
        <div className="background"></div>
        <div className="foreground">
          <span className="modal-message">{message}</span>
        </div>
      </div>
    );
  };
  
  export default Modal;