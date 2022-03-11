import React, { useEffect } from "react";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import Header from "../Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchLicenses, patchLicenses, setLicenceStatusIdle } from "../../store/licenseSlice";
import { fetchLogbooks } from "../../store/logbookSlice";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import Permissions from "./Permissions";
import navigate from "../utils/navigate";


const LicenseConfig = (props) => {
    const dispatch = useDispatch();
    const licenseID = props.match.params.id;

    const userID = useSelector(state => state.auth.userId);
    const licenses = useSelector(state => state.license.licenses);
    const license = useSelector(state => state.license.licenses.filter(element => {
        return element.id === licenseID;
    })[0]);
    const logbooks = useSelector(state => state.logbook.flightlogs);

    const [header, setHeader] = useState();
    const [title, setTitle] = useState(null);
    const [logbookID, setLogbookID] = useState();
    const [otherPermissions, setOtherPermissions] = useState([]);

    useEffect(() => {
        if (window.location.pathname === '/licenses/new') {
            dispatch(fetchLogbooks(userID));
            setHeader("Neue Lizenz erstellen");
            setTitle("");
        } else {
            dispatch(fetchLogbooks(userID));
            dispatch(fetchLicenses(userID));
            setHeader("Lizenzdetails bearbeiten");
        }
        dispatch(setLicenceStatusIdle());
    }, []);

    const handleChange = (event, action) => {
        action(event.target.value);
    }

    // ******** Standard Beispiel von React-Bootstrap *********
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            updateData();
        }
        event.preventDefault();
        setValidated(true);
    }
    // ********************************************************

    const updateData = () => {
        dispatch(fetchLicenses(userID));
        let tempLicenses = _.cloneDeep(licenses);
        if (window.location.pathname === '/licenses/new') {
            tempLicenses.push({ "name": title, "id": uuidv4(), "logbookID": logbookID, "otherPermissions": otherPermissions });
        } else {
            let indexOfLicense = null;
            tempLicenses.map(tempLicense => {
                if (tempLicense.id === licenseID) {
                    indexOfLicense = tempLicenses.indexOf(tempLicense);
                }
            });
            tempLicenses[indexOfLicense].name = title;
            tempLicenses[indexOfLicense].logbookID = logbookID;
            tempLicenses[indexOfLicense].otherPermissions = otherPermissions;
        }
        const data = { "userID": userID, "patchContent": { "licenses": tempLicenses } }
        dispatch(patchLicenses(data));
        while(licenses.status === "pending" || licenses.status === "idle") {
            return;
        }
        navigate('/licenses');
    }

    const renderLogbooks = () => {
        return (
            logbooks.map(logbook => {
                return(
                    <option value={logbook.id} key={logbook.id}>{logbook.name}</option>
                );
            })
        );
    }

    const renderForm = () => {
        if (!logbooks || !licenses) {
            return (
                <div>
                    Loading...
                </div>
            )
        } else {
            if (title === null) {
                licenses.map(element => {
                    if (element.id === licenseID) {
                        setTitle(element.name);
                        setOtherPermissions(element.otherPermissions);
                    }
                });
            } else {
                return (
                    <div>
                        <h4>Berechtigungen</h4>
                        <Permissions permissions={otherPermissions} setPermissions={setOtherPermissions} />
                        <h4>Generelles</h4>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row>
                                <Form.Group as={Col} md="6" controlId="title" className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control required onChange={(event) => handleChange(event, setTitle)} type="text" name="title" placeholder="Title" defaultValue={title} />
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie einen Namen an.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="logbook" className="mb-3">
                                    <Form.Label>Flugbuch</Form.Label>
                                    <Form.Control required as="select" onChange={(event) => handleChange(event, setLogbookID)} name="logbook">
                                        <option value="">Flugbuch auswählen...</option>
                                        {renderLogbooks()}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Bitte wählen Sie ein Flugbuch aus. Falls keins zur Auswahl steht, müssen Sie eins unter 'Flügbücher' anlegen.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <hr />
                            <br />
                            <div className="text-align-center w-100">
                                <div className="d-flex justify-content-center">
                                    <Button className="w-100" onClick={() => navigate('/licenses')} variant="outline-danger">Cancel</Button>
                                    <p className="mx-2"></p>
                                    <Button className="w-100" type="submit" variant="primary">Save</Button>
                                </div>
                            </div>
                            <br />
                        </Form>
                        <br />
                    </div>
                );
            }
        }
    }

    if(!userID) {
        navigate("/");
    }

    return (
        <div>
            <Header />
            <div className="mx-auto w-75">
                <br />
                <h2 className='d-flex justify-content-between'>
                    {header}
                </h2>
                <hr />
                {renderForm()}
            </div>
        </div>
    )
}

export default LicenseConfig;