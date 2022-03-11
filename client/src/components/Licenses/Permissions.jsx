import _ from "lodash";
import React, { useState } from "react";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import CenteredModal from "../CenteredModal";


const Permissions = (props) => {
    const [permission, setPermission] = useState("");
    const [amount, setAmount] = useState("");
    const [hours, setHours] = useState("");
    const [months, setMonths] = useState("");
    const [permissionID, setPermissionID] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [modalPermission, setModalPermission] = useState();
    const [modalPermissionID, setModalPermissionID] = useState("");
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
            const temp = _.cloneDeep(props.permissions);
            if (isEditing) {
                let indexOfPermission = null;
                temp.map(permission => {
                    if (permission.id === permissionID) {
                        indexOfPermission = temp.indexOf(permission);
                    }
                    return "";
                });
                temp[indexOfPermission] = { "permission": permission, "amount": amount, "hours": hours, "months": months, "id": permissionID }
                setIsEditing(false);
                setButtonText("Hinzufügen");
            } else {
                temp.push({ "permission": permission, "amount": amount, "hours": hours, "months": months, "id": uuidv4() })
            }
            props.setPermissions(temp);
            setPermission("");
            setAmount("");
            setHours("");
            setMonths("");
            setPermissionID("");
            setValidated(false);
        }
    }
    // ********************************************************

    const handleChange = (event, action) => {
        action(event.target.value);
    }

    const handleDelete = (id) => {
        let indexOfPermission = null;
        const permissionsArray = _.cloneDeep(props.permissions);
        permissionsArray.map(permission => {
            if (permission.id === id) {
                indexOfPermission = permissionsArray.indexOf(permission);
            }
            return "";
        });
        permissionsArray.splice(indexOfPermission, 1);
        props.setPermissions(permissionsArray);
        setModalShow(false);
    }

    const handleEdit = (permission) => {
        setIsEditing(true);
        setButtonText("Ändern");
        setPermission(permission.permission);
        setAmount(permission.amount);
        setHours(permission.hours);
        setMonths(permission.months);
        setPermissionID(permission.id);
    }

    const renderActions = (id) => {
        return (
            <>
                <Button variant="primary" onClick={() => setModalShow(false)}>Cancel</Button>
                <Button variant="danger" onClick={() => handleDelete(id)}>Delete</Button>
            </>
        );
    }

    const renderPermissionsTable = () => {
        return props.permissions.map(permission => {
            return (
                <ListGroup.Item key={permission.id} >
                    <div className="d-flex justify-content-between" style={{ fontSize: 20 }}>
                        <span >{permission.permission}</span>
                        <div className="ml-auto">
                            <Button className="mx-2" onClick={() => handleEdit(permission)} variant="primary" size="sm">Bearbeiten</Button>
                            <Button onClick={() => {setModalShow(true); setModalPermission(permission.permission); setModalPermissionID(permission.id); }} variant="danger" size="sm">Löschen</Button>
                        </div>
                    </div>
                    <CenteredModal show={modalShow} onHide={() => setModalShow(false)} title="Startart löschen" bodyTitle={modalPermission} bodyText="Möchten Sie diese Berechtigung wirklich löschen?" actions={renderActions(modalPermissionID)} />
                </ListGroup.Item>
            );
        });
    }

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Form.Group as={Col} md="3" controlId="permission" className="mb-3">
                        <Form.Label>Berechtigung</Form.Label>
                        <Form.Control required onChange={(event) => handleChange(event, setPermission)} type="text" name="permission" value={permission} placeholder="Gastflug" />
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie einen Namen für die Berechtigung an.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="amount" className="mb-3">
                        <Form.Label>benötigte Starts</Form.Label>
                        <Form.Control required onChange={(event) => handleChange(event, setAmount)} type="number" min="0" name="amount" value={amount} placeholder="5" />
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie die benötigte Anzahl an Starts an. Hinweis: Diese kann nicht kleiner als "0" sein.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="flightHours" className="mb-3">
                        <Form.Label>benötigte Flugstunden</Form.Label>
                        <Form.Control required onChange={(event) => handleChange(event, setHours)} type="number" min="0" name="flightHours" value={hours} placeholder="5" />
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie die benötigte Anzahl an Flugstunden an. Hinweis: Diese kann nicht kleiner als "0" sein.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="months" className="mb-3">
                        <Form.Label>in "x" Monaten</Form.Label>
                        <Form.Control required onChange={(event) => handleChange(event, setMonths)} type="number" min="0" name="months" value={months} placeholder="24" />
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie den Zeitraum in Monaten an. Hinweis: Dieser kann nicht kleiner als "0" sein.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button className="mx-auto w-25" type="submit" variant="primary">{buttonText}</Button>
                </Row>
            </Form>
            <br />
            <ListGroup variant="flush">
                {renderPermissionsTable()}
            </ListGroup>
            <hr />
        </div>
    )
}

export default Permissions;