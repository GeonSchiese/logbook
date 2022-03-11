import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import createBrowserHistory from '../../history';
import Header from '../Header';
import { fetchLogbooks, patchLogbooks, setLogbookStatusIdle } from '../../store/logbookSlice';
import _ from 'lodash';
import Takeofftypes from './Takeofftypes';
import navigate from "../utils/navigate";

const LogbookConfig = (props) => {
    const dispatch = useDispatch();

    const userID = useSelector(state => state.auth.userId);
    const id = props.match.params.id;

    const [header, setHeader] = useState();
    const [title, setTitle] = useState(null);
    const [elementsPerPage, setElementsperPage] = useState(null)
    const [takeoffTypes, setTakeoffTypes] = useState([]);
    const flightlogs = useSelector(state => state.logbook.flightlogs);
    const status = useSelector(state => state.logbook.status);


    useEffect(() => {
        console.log(1);
        if (window.location.pathname === '/logbooks/new') {
            console.log(2);
            setHeader("Create new Logbook");
            setTitle("");
            setElementsperPage(12);
        } else {
            console.log(3);
            dispatch(fetchLogbooks(userID));
            setHeader("Edit Logbook Details");
        }
        console.log(4);
        dispatch(setLogbookStatusIdle());
    }, []);

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
        dispatch(fetchLogbooks(userID));
        let flightlogArray = _.cloneDeep(flightlogs);
        if (window.location.pathname === '/logbooks/new') {
            flightlogArray.push({ "name": title, "id": uuidv4(), "takeoffTypes": takeoffTypes, "elementsPerPage": elementsPerPage, "flights": [] });
        } else {
            let indexOfFlightlog = null;
            flightlogArray.map(flightlog => {
                if (flightlog.id === id) {
                    indexOfFlightlog = flightlogArray.indexOf(flightlog);
                }
            });
            flightlogArray[indexOfFlightlog].name = title;
            flightlogArray[indexOfFlightlog].takeoffTypes = takeoffTypes;
            flightlogArray[indexOfFlightlog].elementsPerPage = elementsPerPage;
        }

        const data = { "userID": userID, "patchContent": { "flightlogs": flightlogArray } }
        dispatch(patchLogbooks(data));
        while(status === "pending" || status === "idle") {
            return;
        }
        navigate('/logbooks');
    }

    const handleChange = (event, action) => {
        action(event.target.value);
    }

    const renderForm = () => {
        if (!flightlogs) {
            return (
                <div>
                    Loading...
                </div>
            )
        } else {
            if (title === null) {
                flightlogs.map(element => {
                    if (element.id === id) {
                        setTitle(element.name);
                        setElementsperPage(element.elementsPerPage);
                        setTakeoffTypes(element.takeoffTypes);
                    }
                });
            } else {
                return (
                    <div>
                        <h3>Startarten</h3>
                        <Takeofftypes takeoffTypes={takeoffTypes} setTakeoffTypes={setTakeoffTypes} />
                        <br />
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <h3>Generelles</h3>
                            <Row>
                                <Form.Group as={Col} md="8" controlId="title" className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control required onChange={(event) => handleChange(event, setTitle)} type="text" name="title" placeholder="Title" defaultValue={title} />
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie einen Namen an.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="flightsPerPage" className="mb-3">
                                    <Form.Label>Flüge pro Seite</Form.Label>
                                    <Form.Control required onChange={(event) => handleChange(event, setElementsperPage)} type="number" min="1" name="flightsPerPage" placeholder="12" defaultValue={elementsPerPage} />
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie eine Zahl ein. Hinweis: Diese können nicht kleiner als '1' sein.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <hr />
                            <br />
                            <div className="text-align-center w-100">
                                <div className="d-flex justify-content-center">
                                    <Button className="w-100" onClick={() => navigate('/logbooks')} variant="outline-danger">Cancel</Button>
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
    );
}
export default LogbookConfig;