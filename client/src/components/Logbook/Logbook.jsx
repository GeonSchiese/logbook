import React, { useState, useEffect } from "react";
import Header from "../Header";
import { Table, Button } from "react-bootstrap";
import { fetchLogbooks, patchLogbooks } from "../../store/logbookSlice";
import { useDispatch, useSelector } from "react-redux";
import { BsTrash, BsPencil } from "react-icons/bs";
import timeFormatter from "../utils/timeFormatter";
import _ from "lodash";
import CenteredModal from "../CenteredModal";
import navigate from "../utils/navigate";

const Logbook = (props) => {
    const id = props.match.params.id;
    const logbooks = useSelector(state => state.logbook.flightlogs);
    const logbookData = useSelector(state => state.logbook.flightlogs.filter(element => {
        return element.id === id;
    })[0]);
    const [modalShow, setModalShow] = useState(false);
    const [modalFlightID, setModalFlightID] = useState("");
    const [modalFlight, setModalFlight] = useState();

    const userID = useSelector(state => state.auth.userId);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLogbooks(userID));
    }, [dispatch, userID]);

    const handleDelete = (flight) => {
        dispatch(fetchLogbooks(userID));
        //lodash cloneDeep idee kommt hierher (2. Antwort): https://stackoverflow.com/questions/69749850/typeerror-cant-define-array-index-property-past-the-end-of-an-array-with-non-w
        const userFlightlogs = _.cloneDeep(logbooks);
        let indexOfFlightlog = null;
        let indexOfFlight = null;
        userFlightlogs.map(flightlog => {
            if (flightlog.id === id) {
                indexOfFlightlog = userFlightlogs.indexOf(flightlog);
            }
            return "";
        });
        userFlightlogs[indexOfFlightlog].flights.map(currentFlight => {
            if (currentFlight.id === flight.id) {
                indexOfFlight = userFlightlogs[indexOfFlightlog].flights.indexOf(currentFlight);
            }
            return "";
        })
        userFlightlogs[indexOfFlightlog].flights.splice(indexOfFlight, 1);
        dispatch(patchLogbooks({ "userID": userID, "patchContent": { "flightlogs": userFlightlogs } }));
        setModalShow(false);
    }

    const renderActions = (flight) => {
        return (
            <>
                <Button variant="primary" onClick={() => setModalShow(false)}>Cancel</Button>
                <Button variant="danger" onClick={() => handleDelete(flight)}>Delete</Button>
            </>
        );
    }

    const renderPageFooter = (pageItems, pageGrossFlighttime) => {
        let pageTotalBlockTime = 0;
        pageItems.map(flight => {
            pageTotalBlockTime = pageTotalBlockTime + flight.blockTime;
            return "";
        });
        return (
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>{timeFormatter(0, pageTotalFlightTime(pageItems))}</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>{timeFormatter(0, pageTotalBlockTime)}</th>
                <th>ges. Flugzeit: {timeFormatter(0, pageGrossFlighttime)}</th>
                <th></th>
            </tr>
        );
    }

    const renderFlights = (pageItems, page) => {
        return pageItems.map(flight => {
            const takeoffDate = new Date(flight.takeoffTime);
            const landingDate = new Date(flight.landingTime);
            const newDate = takeoffDate.toLocaleDateString();
            const newTakeoffTime = timeFormatter(takeoffDate.getUTCHours(), takeoffDate.getUTCMinutes());
            const newLandingTime = timeFormatter(landingDate.getUTCHours(), landingDate.getUTCMinutes());
            const offBlock = new Date(flight.offBlock);
            const onBlock = new Date(flight.onBlock);
            const newOffBlockTime = timeFormatter(offBlock.getUTCHours(), offBlock.getUTCMinutes());
            const newOnBlockTime = timeFormatter(onBlock.getUTCHours(), onBlock.getUTCMinutes());

            return (
                <tr key={flight.id}>
                    <th>{((page - 1) * logbookData.elementsPerPage) + (pageItems.indexOf(flight) + 1)}</th>
                    <th>{newDate}</th>
                    <th>{flight.registration}</th>
                    <th>{flight.type}</th>
                    <th>{newTakeoffTime}</th>
                    <th>{newLandingTime}</th>
                    <th>{timeFormatter(0, flight.flightTime)}</th>
                    <th>{flight.takeoff}</th>
                    <th>{flight.landing}</th>
                    <th>{newOffBlockTime}</th>
                    <th>{newOnBlockTime}</th>
                    <th>{timeFormatter(0, flight.blockTime)}</th>
                    <th>{flight.remarks}</th>
                    <th><BsPencil onClick={() => navigate(`/logbooks/${id}/flights/edit/${flight.id}`)} style={{ cursor: "pointer" }} /><BsTrash onClick={() => { setModalShow(true); setModalFlightID(flight.id); setModalFlight(flight) }} className="mx-1" style={{ cursor: "pointer" }} /></th>
                    <CenteredModal show={modalShow} onHide={() => setModalShow(false)} title="Flug löschen" bodyTitle={`Flug: ${modalFlightID}`} bodyText="Möchtest du diesen Flug wirklich löschen?" actions={renderActions(modalFlight)} />
                </tr>
            );
        });
    }

    const renderFlightsTable = (pageItems, page, pageGrossFlighttime) => {
        return (
            <div>
                <h3>Seite {page}</h3>
                <Table striped style={{ fontSize: 14 }} size="sm" >
                    <thead >
                        <tr>
                            <th>#</th>
                            <th>Datum</th>
                            <th>Kennzeichen</th>
                            <th>Startart</th>
                            <th>Startzeit</th>
                            <th>Landezeit</th>
                            <th>Flugzeit</th>
                            <th>Startort</th>
                            <th>Landeort</th>
                            <th>Off-Block</th>
                            <th>On-Block</th>
                            <th>Blockzeit</th>
                            <th>Bemerkungen</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderFlights(pageItems, page)}
                        {renderPageFooter(pageItems, pageGrossFlighttime)}
                    </tbody>
                </Table>
            </div>
        );
    }

    const pageTotalFlightTime = (pageItems) => {
        let totalTime = 0;
        pageItems.map(flight => {
            totalTime = totalTime + flight.flightTime;
            return "";
        });
        return totalTime;
    }

    const mapPages = (logbookPageItems) => {
        return logbookPageItems.slice(0).reverse().map(pageItems => {
            const page = logbookPageItems.indexOf(pageItems) + 1;
            let pageGrossFlighttime = 0;
            for (let i = 0; i < page; i++) {
                pageGrossFlighttime = pageGrossFlighttime + pageTotalFlightTime(logbookPageItems[i]);
            }
            return (
                <div key={page}>
                    {renderFlightsTable(pageItems, page, pageGrossFlighttime)}
                </div>
            );
        });
    }

    const arrayDivider = () => {
        const pageLength = logbookData.elementsPerPage;
        let pages = logbookData.flights.length / pageLength;
        let logbookPageItems = [];
        if (Math.round(pages) <= pages) {
            pages = Math.round(pages) + 1;
        } else {
            pages = Math.round(pages);
        }
        for (let i = 1; i <= pages; i++) {
            if (i === pages) {
                logbookPageItems.push(logbookData.flights.slice((pageLength * i) - pageLength, logbookData.flights.length));
            } else {
                logbookPageItems.push(logbookData.flights.slice((pageLength * i) - pageLength, (pageLength * i)));
            }
        }
        return (
            <div>
                {mapPages(logbookPageItems)}
            </div>
        );
    }

    const isLoading = () => {
        if (!logbookData) {
            return (
                <div>
                    Loading...
                </div>
            );
        } else {
            return (
                <div>
                    <h2 className="d-flex justify-content-between">
                        Flugbuch für "{logbookData["name"]}"
                        <Button onClick={() => navigate(`/logbooks/${logbookData.id}/flights/new`)} className="ml-auto" variant="primary">New Flight</Button>
                    </h2>
                    <hr />
                    {arrayDivider()}
                </div>
            );
        }
    }

    if (!userID) {
        navigate("/");
    }

    return (
        <div>
            <Header />
            <div className="mx-5">
                <br />
                {isLoading()}
                <br />
            </div>
        </div>
    );

}

export default Logbook;