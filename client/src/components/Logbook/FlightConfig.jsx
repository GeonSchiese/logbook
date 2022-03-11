import React, { useEffect, useState } from "react";
import Header from '../Header';
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { fetchLogbooks, patchLogbooks } from "../../store/logbookSlice";
import _ from "lodash";
import timeFormatter from "../utils/timeFormatter";
import navigate from "../utils/navigate";

const FlightConfig = (props) => {
    const dispatch = useDispatch();

    const userID = useSelector(state => state.auth.userId);
    const logbookID = props.match.params.logbookID;
    const logbooks = useSelector(state => state.logbook.flightlogs);
    const logbookData = useSelector(state => state.logbook.flightlogs.filter(element => {
        return element.id === logbookID;
    })[0]);

    const [header, setHeader] = useState();

    const [registration, setRegistration] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [takeoffLocation, setTakeoffLocation] = useState("");
    const [landingLocation, setLandingLocation] = useState("");
    const [remarks, setRemarks] = useState("");
    const [flightID, setFlightID] = useState();
    const [offBlock, setOffBlock] = useState("");
    const [onBlock, setOnBlock] = useState("");
    const [totalBlock, setTotalBlock] = useState("");
    const [totalBlockMinutes, setTotalBlockMinutes] = useState(0);
    const [takeoff, setTakeoff] = useState("");
    const [landing, setLanding] = useState("");
    const [totalFlighttime, setTotalFlighttime] = useState("");
    const [totalFlighttimeMinutes, setTotalFlighttimeMinutes] = useState(0);

    useEffect(() => {
        dispatch(fetchLogbooks(userID));
    }, []);

    const handleSetDefaults = (element) => {
        if (window.location.pathname === `/logbooks/${logbookID}/flights/new`) {
            setHeader("Neuen Flug erstellen");
            setFlightID(uuidv4());
        } else {
            setHeader("Flugdetails bearbeiten");
            setFlightID(props.match.params.flightID);
            element.flights.map(flight => {
                if (flight.id === props.match.params.flightID) {
                    const takeoffDate = new Date(flight.takeoffTime);
                    const landingDate = new Date(flight.landingTime);
                    const offBlockDate = new Date(flight.offBlock);
                    const onBlockDate = new Date(flight.onBlock);
                    setRegistration(flight.registration);
                    setDate(dateFormatter(takeoffDate.getUTCFullYear(), takeoffDate.getUTCMonth(), takeoffDate.getUTCDate()));
                    setType(flight.type);
                    setTakeoffLocation(flight.takeoff);
                    setLandingLocation(flight.landing);
                    setTakeoff(timeFormatter(takeoffDate.getUTCHours(), takeoffDate.getUTCMinutes()));
                    setLanding(timeFormatter(landingDate.getUTCHours(), landingDate.getUTCMinutes()));
                    setTotalFlighttime(timeFormatter(0, flight.flightTime));
                    setTotalFlighttimeMinutes(flight.flightTime);
                    setOffBlock(timeFormatter(offBlockDate.getUTCHours(), offBlockDate.getUTCMinutes()));
                    setOnBlock(timeFormatter(onBlockDate.getUTCHours(), onBlockDate.getUTCMinutes()));
                    setTotalBlock(timeFormatter(0, flight.blockTime));
                    setTotalBlockMinutes(flight.blockTime);
                    setRemarks(flight.remarks);
                }
            })
        }
    }

    // ******** Standard Beispiel von React-Bootstrap *********
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
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
        const tempLogbooks = _.cloneDeep(logbooks);

        let currentFlightlog = null;
        tempLogbooks.map(flightlog => {
            if (flightlog.id === logbookID) {
                currentFlightlog = flightlog;
            }
        });
        const currentFlightlogIndex = tempLogbooks.indexOf(currentFlightlog);
        console.log(currentFlightlogIndex);
        const flightData = {
            "id": flightID,
            "registration": registration,
            "takeoff": takeoffLocation,
            "landing": landingLocation,
            "type": type,
            "remarks": remarks,
            "takeoffTime": new Date(date + "T" + takeoff + "Z"),
            "landingTime": new Date(date + "T" + landing + "Z"),
            "flightTime": totalFlighttimeMinutes,
            "offBlock": new Date(date + "T" + offBlock + "Z"),
            "onBlock": new Date(date + "T" + onBlock + "Z"),
            "blockTime": totalBlockMinutes
        }

        if (window.location.pathname === `/logbooks/${logbookData.id}/flights/new`) {
            currentFlightlog.flights.push(flightData);
        } else {
            let currentFlight = null;
            currentFlightlog.flights.map(flight => {
                if (flight.id === props.match.params.flightID) {
                    currentFlight = flight;
                }
            });
            currentFlightlog.flights[currentFlightlog.flights.indexOf(currentFlight)] = flightData;
        }
        currentFlightlog.flights = currentFlightlog.flights.sort(function (a, b) {
            const dateA = new Date(a.takeoffTime);
            const dateB = new Date(b.takeoffTime);
            return dateA - dateB;
        });
        tempLogbooks[currentFlightlogIndex] = currentFlightlog;
        dispatch(patchLogbooks({ "userID": userID, "patchContent": { "flightlogs": tempLogbooks } }));
        navigate(`/logbooks/view/${logbookID}`);
    }

    const handleChange = (event, action) => {
        action(event.target.value);
    }

    const dateFormatter = (year, month, day) => {
        let returnString = year + "-";
        if ((month + 1) < 10) {
            returnString = returnString + "0" + (month + 1);
        } else {
            returnString = returnString + (month + 1);
        }
        if (day < 10) {
            returnString = returnString + "-0" + day;
        } else {
            returnString = returnString + "-" + day;
        }
        return returnString;
    }

    const calcBlock = () => {
        console.log(offBlock);
        console.log(onBlock);
        if (offBlock && onBlock && date) {
            const offBlockDate = new Date(date + "T" + offBlock);
            const onBlockDate = new Date(date + "T" + onBlock);
            const difference = new Date(onBlockDate - offBlockDate);
            const outputString = timeFormatter(difference.getUTCHours(), difference.getUTCMinutes());
            setTotalBlock(outputString);
            setTotalBlockMinutes((difference.getUTCHours() * 60) + (difference.getUTCMinutes()));
        }
    }

    const calcFlight = () => {
        console.log(takeoff);
        console.log(landing);
        if (takeoff && landing && date) {
            const takeoffDate = new Date(date + "T" + takeoff);
            const landingDate = new Date(date + "T" + landing);
            const difference = new Date(landingDate - takeoffDate);
            const outputString = timeFormatter(difference.getUTCHours(), difference.getUTCMinutes());
            setTotalFlighttime(outputString);
            setTotalFlighttimeMinutes((difference.getUTCHours() * 60) + (difference.getUTCMinutes()));
        }
    }

    const renderErrorText = (variable, errorMsgOne, errorMsgTwo) => {
        if (variable) {
            return errorMsgTwo;
        }
        return errorMsgOne;
    }

    const renderTakeoffTypes = () => {
        return (
            logbookData.takeoffTypes.map(type => {
                return (
                    <option value={type.takeoffType} key={type.id}>{type.takeoffType}</option>
                );
            })
        );
    }

    const isLoading = () => {
        if (!logbookData) {
            return (
                <div>
                    Loading...
                </div>
            )
        } else {
            if (!header) {
                logbooks.map(element => {
                    if (element.id === logbookID) {
                        handleSetDefaults(element);
                    }
                });
            } else {
                return (
                    <div>
                        <h2 className='d-flex justify-content-between'>
                            {header}
                        </h2>
                        <hr />
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="aircraftRegstration" className="mb-3">
                                        <Form.Label>Luftfahrzeug Kennzeichen:</Form.Label>
                                        <Form.Control required onChange={(event) => handleChange(event, setRegistration)} type="text" name="aircraftRegistration" placeholder="D-XXXX" defaultValue={registration} />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie ein Kennzeichen ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="date" className="mb-3">
                                        <Form.Label>Flugdatum:</Form.Label>
                                        <Form.Control required onChange={(event) => handleChange(event, setDate)} onBlur={() => { calcBlock(); calcFlight() }} type="date" name="date" defaultValue={date} />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie ein Datum ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="type" className="mb-3">
                                        <Form.Label>Startart:</Form.Label>
                                        <Form.Control required as="select" onChange={(event) => handleChange(event, setType)} name="type">
                                            <option value="">Startart auswählen...</option>
                                            {renderTakeoffTypes()}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte wählen Sie eine Startart aus. Wenn keine zur Auswahl stehen, müssen Sie welche in den Flugbucheinstellungen hinzufügen.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Form.Group controlId="takeoffLocation" className="mb-3">
                                        <Form.Label>Startort:</Form.Label>
                                        <Form.Control required onChange={(event) => handleChange(event, setTakeoffLocation)} type="text" name="takeoffLocation" defaultValue={takeoffLocation} />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie den Startort ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="landingLocation" className="mb-3">
                                        <Form.Label>Landeort:</Form.Label>
                                        <Form.Control required onChange={(event) => handleChange(event, setLandingLocation)} type="text" name="landingLocation" defaultValue={landingLocation} />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie den Landeort ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Form.Group controlId="offBlock" className="mb-3">
                                        <Form.Label>Off-Block (UTC):</Form.Label>
                                        <Form.Control required onChange={(event) => handleChange(event, setOffBlock)} onBlur={() => calcBlock()} type="time" max={takeoff} name="offBlock" defaultValue={offBlock} />
                                        <Form.Control.Feedback type="invalid">
                                            {renderErrorText(offBlock, "Bitte geben Sie eine Off-Block Zeit an.", "Die Off-Block Zeit darf nicht nach der Startzeit sein.")}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="onBlock" className="mb-3">
                                        <Form.Label>On-Block (UTC):</Form.Label>
                                        <Form.Control required onChange={(event) => handleChange(event, setOnBlock)} onBlur={() => calcBlock()} type="time" min={landing} name="onBlock" defaultValue={onBlock} />
                                        <Form.Control.Feedback type="invalid">
                                            {renderErrorText(onBlock, "Bitte geben Sie eine On-Block Zeit an.", "Die On-Block Zeit darf nicht vor der Landezeit liegen.")}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Blockzeit:</Form.Label>
                                        <Form.Control disabled type="time" name="totalBlock" value={totalBlock} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="takeoff" className="mb-3">
                                        <Form.Label>Start (UTC):</Form.Label>
                                        <Form.Control required onChange={(event) => handleChange(event, setTakeoff)} onBlur={() => calcFlight()} min={offBlock} max={landing} type="time" name="takeoff" defaultValue={takeoff} />
                                        <Form.Control.Feedback type="invalid">
                                            {renderErrorText(takeoff, "Bitte geben Sie die Startzeit ein.", "Die Startzeit darf nicht vor der Off-Block-Zeit oder nach der Landezeit liegen.")}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="landing" className="mb-3">
                                        <Form.Label>Landung (UTC):</Form.Label>
                                        <Form.Control required onChange={(event) => handleChange(event, setLanding)} onBlur={() => calcFlight()} min={takeoff} max={onBlock} type="time" name="landing" defaultValue={landing} />
                                        <Form.Control.Feedback type="invalid">
                                            {renderErrorText(landing, "Bitte geben Sie die Landezeit ein.", "Die Landezeit darf nicht vor der Startzeit oder nach der On-Block-Zeit liegen.")}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="flightTime" className="mb-3">
                                        <Form.Label>Flugzeit:</Form.Label>
                                        <Form.Control disabled type="time" name="flightTime" value={totalFlighttime} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br />
                            <Form.Group controlId="remarks" className="mb-3">
                                <Form.Label>Bemerkungen:</Form.Label>
                                <Form.Control onChange={(event) => handleChange(event, setRemarks)} type="text" name="remarks" defaultValue={remarks} />
                            </Form.Group>
                            <br />
                            <div className="text-align-center w-100">
                                <div className="d-flex justify-content-center">
                                    <Button className="w-100" onClick={() => navigate(`/logbooks/view/${logbookData.id}`)} variant="outline-danger">Cancel</Button>
                                    <p className="mx-2"></p>
                                    <Button className="w-100" onSubmit={handleSubmit} type="submit" variant="primary">Save</Button>
                                </div>
                            </div>
                            <br />
                            <br />
                        </Form>
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
                {isLoading()}
            </div>
        </div>
    );
}

export default FlightConfig;