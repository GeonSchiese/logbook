import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header";
import { ListGroup, Button } from "react-bootstrap";
import { fetchLogbooks, patchLogbooks } from "../../store/logbookSlice";
import CenteredModal from "../CenteredModal";
import _ from "lodash";
import navigate from "../utils/navigate";


const LogbookList = () => {
    const userID = useSelector(state => state.auth.userId);

    const dispatch = useDispatch();
    const flightlogs = useSelector(state => state.logbook.flightlogs);
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalID, setModalID] = useState("");

    useEffect(() => {
        dispatch(fetchLogbooks(userID));
    }, [dispatch, userID]);

    const renderActions = (id) => {
        return (
            <>
                <Button variant="primary" onClick={() => setModalShow(false)}>Cancel</Button>
                <Button variant="danger" onClick={() => handleDelete(id)}>Delete</Button>
            </>
        );
    }

    const handleDelete = (id) => {
        dispatch(fetchLogbooks(userID));
        let indexOfFlightlog = null;
        //lodash cloneDeep idee kommt hierher (2. Antwort): https://stackoverflow.com/questions/69749850/typeerror-cant-define-array-index-property-past-the-end-of-an-array-with-non-w
        const flightlogarray = _.cloneDeep(flightlogs);
        flightlogarray.map(flightlog => {
            if (flightlog.id === id) {
                indexOfFlightlog = flightlogs.indexOf(flightlog);
            }
            return "";
        });
        flightlogarray.splice(indexOfFlightlog, 1);
        const data = { "userID": userID, "patchContent": { "flightlogs": flightlogarray } }
        dispatch(patchLogbooks(data));
        setModalShow(false);
    }

    const renderLogbooks = () => {
        return flightlogs.map(logbook => {
            const temp = logbook.name;
            return (
                <ListGroup.Item key={logbook.id} style={{ cursor: "pointer" }}>
                    <div className="d-flex justify-content-between" style={{ fontSize: 20 }}>
                        <span onClick={() => navigate(`/logbooks/view/${logbook.id}`)}>{temp}</span>
                        <div className="ml-auto">
                            <Button className="mx-2" onClick={() => navigate(`/logbooks/edit/${logbook.id}`)} variant="primary" size="sm">Bearbeiten</Button>
                            <Button onClick={() => { setModalShow(true); setModalTitle(logbook.name); setModalID(logbook.id); }} variant="danger" size="sm">L??schen</Button>
                        </div>
                    </div>
                    <CenteredModal show={modalShow} onHide={() => { setModalShow(false); setModalTitle(""); setModalID(""); }} title="Flugbuch l??schen" bodyTitle={modalTitle} bodyText="M??chten Sie dieses Flugbuch wirklich l??schen?" actions={renderActions(modalID)} />
                </ListGroup.Item>
            );
        });
    }

    const renderMaster = () => {
        if (!flightlogs) {
            return <div>Loading</div>
        } else {
            return renderLogbooks();
        }
    }

    if (!userID) {
        navigate("/");
    }

    return (
        <div>
            <Header />
            <div className="mx-auto w-75">
                <br />
                <h2 className="d-flex justify-content-between">
                    Flugb??cher
                    <Button onClick={() => navigate("/logbooks/new")} className="ml-auto" variant="primary">Neu</Button>
                </h2>
                <hr />
                <br />
                <ListGroup variant="flush">
                    {renderMaster()}
                </ListGroup>
            </div>
        </div>
    );
}

export default LogbookList;