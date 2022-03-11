import _ from "lodash";
import React, { useState } from "react";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import CenteredModal from "../CenteredModal";


const Takeofftypes = (props) => {
    const [type, setType] = useState("");
    const [amount, setAmount] = useState("");
    const [months, setMonths] = useState("");
    const [typeID, setTypeID] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [modalTakeofftype, setModalTakeofftype] = useState();
    const [modalTakeofftypeID, setModalTakeofftypeID] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [buttonText, setButtonText] = useState("Hinzufügen");


    // ********************************************************
    // Quelle: https://react-bootstrap.netlify.app/forms/validation/
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        setValidated(true);
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            //lodash cloneDeep idee kommt hierher (2. Antwort): https://stackoverflow.com/questions/69749850/typeerror-cant-define-array-index-property-past-the-end-of-an-array-with-non-w
            const temp = _.cloneDeep(props.takeoffTypes);
            if (isEditing) {
                let indexOfTakeofftype = null;
                //lodash cloneDeep idee kommt hierher (2. Antwort): https://stackoverflow.com/questions/69749850/typeerror-cant-define-array-index-property-past-the-end-of-an-array-with-non-w
                const takeoffTypesArray = _.cloneDeep(props.takeoffTypes);
                takeoffTypesArray.map(takeoffType => {
                    if (takeoffType.id === typeID) {
                        indexOfTakeofftype = takeoffTypesArray.indexOf(takeoffType);
                    }
                    return "";
                });
                temp[indexOfTakeofftype] = { "takeoffType": type, "amount": amount, "months": months, "id": typeID }
                setIsEditing(false);
                setButtonText("Hinzufügen");
            } else {
                temp.push({ "takeoffType": type, "amount": amount, "months": months, "id": uuidv4() })
            }
            props.setTakeoffTypes(temp);
            setType("");
            setAmount("");
            setMonths("");
            setTypeID("");
            setValidated(false);
        }
    }
    // ********************************************************

    const handleChange = (event, action) => {
        action(event.target.value);
    }

    const handleDelete = (id) => {
        let indexOfTakeofftype = null;
        //lodash cloneDeep idee kommt hierher (2. Antwort): https://stackoverflow.com/questions/69749850/typeerror-cant-define-array-index-property-past-the-end-of-an-array-with-non-w
        const takeoffTypesArray = _.cloneDeep(props.takeoffTypes);
        takeoffTypesArray.map(takeoffType => {
            if (takeoffType.id === id) {
                indexOfTakeofftype = takeoffTypesArray.indexOf(takeoffType);
            }
            return "";
        });
        takeoffTypesArray.splice(indexOfTakeofftype, 1);
        props.setTakeoffTypes(takeoffTypesArray);
        setModalShow(false);
    }

    const handleEdit = (takeoffType) => {
        setIsEditing(true);
        setButtonText("Ändern");
        setType(takeoffType.takeoffType);
        setAmount(takeoffType.amount);
        setMonths(takeoffType.months);
        setTypeID(takeoffType.id);
    }

    const renderActions = (id) => {
        return (
            <>
                <Button variant="primary" onClick={() => setModalShow(false)}>Cancel</Button>
                <Button variant="danger" onClick={() => handleDelete(id)}>Delete</Button>
            </>
        );
    }

    const renderTypesTable = () => {
        return props.takeoffTypes.map(takeoffType => {
            return (
                <ListGroup.Item key={takeoffType.id} >
                    <div className="d-flex justify-content-between" style={{ fontSize: 20 }}>
                        <span >{takeoffType.takeoffType}</span>
                        <div className="ml-auto">
                            <Button className="mx-2" onClick={() => handleEdit(takeoffType)} variant="primary" size="sm">Bearbeiten</Button>
                            <Button onClick={() => {setModalShow(true); setModalTakeofftype(takeoffType.takeoffType); setModalTakeofftypeID(takeoffType.id);}} variant="danger" size="sm">Löschen</Button>
                        </div>
                    </div>
                    <CenteredModal show={modalShow} onHide={() => setModalShow(false)} title="Startart löschen" bodyTitle={modalTakeofftype} bodyText="Möchten Sie diese Startart wirklich löschen?" actions={renderActions(modalTakeofftypeID)} />
                </ListGroup.Item>
            );
        });
    }

    const renderTypeEditing = () => {
        if (isEditing) {
            return <Form.Control required disabled onChange={(event) => handleChange(event, setType)} type="text" name="takeoffType" value={type} placeholder="Windenstart" />
        } else {
            return <Form.Control required onChange={(event) => handleChange(event, setType)} type="text" name="takeoffType" value={type} placeholder="Windenstart" />
        }
    }

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Form.Group as={Col} md="4" controlId="takeoffType" className="mb-3">
                        <Form.Label>Startart</Form.Label>
                        {renderTypeEditing()}
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie eine Bezeichnung an.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="amount" className="mb-3">
                        <Form.Label>benötigte Anzahl</Form.Label>
                        <Form.Control required onChange={(event) => handleChange(event, setAmount)} type="number" min="0" name="amount" value={amount} placeholder="5" />
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie die benötigte Anzahl an. Hinweis: Diese kann nicht kleiner als "0" sein.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="months" className="mb-3">
                        <Form.Label>in "x" Monaten</Form.Label>
                        <Form.Control required onChange={(event) => handleChange(event, setMonths)} type="number" min="0" name="months" value={months} placeholder="24" />
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie den Zeitraum in Monaten an. Hinweis: Dieser kann nicht kleiner als "0" sein.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button className="mx-auto w-25" type="submit" variant="primary">{buttonText}</Button>
                </Row>
            </Form>
            <hr />
            <ListGroup variant="flush">
                {renderTypesTable()}
            </ListGroup>
        </div>
    )
}

export default Takeofftypes;