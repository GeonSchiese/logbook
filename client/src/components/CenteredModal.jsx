import React from "react";
import { Modal } from "react-bootstrap";

const CenteredModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.bodyTitle}</h4>
                <p>
                    {props.bodyText}
                </p>
            </Modal.Body>
            <Modal.Footer>
                {props.actions}
            </Modal.Footer>
        </Modal>
    );
}

export default CenteredModal;