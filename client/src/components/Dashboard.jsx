import React from 'react';
import { useEffect } from 'react';
import { Button, Card, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import createBrowserHistory from '../history';
import { fetchLicenses } from '../store/licenseSlice';
import { fetchLogbooks } from '../store/logbookSlice';
import Header from './Header';
import LicenseCard from './Licenses/LicenseCard';
import LicenseList from './Licenses/LicenseList';
import navigate from './utils/navigate';


const Dashboard = () => {
    const dispatch = useDispatch();
    const userID = useSelector(state => state.auth.userId);
    const licenses = useSelector(state => state.license.licenses);
    const logbooks = useSelector(state => state.logbook.flightlogs);

    useEffect(() => {
        dispatch(fetchLogbooks(userID));
        dispatch(fetchLicenses(userID));
    }, []);

    if (!userID) {
        navigate("/");
    }

    const renderLicenseCard = () => {
        if (licenses.length > 0) {
            return (
                <div>
                    <h4>Lizenzen</h4>
                    <hr />
                    <LicenseCard licenseID={licenses[0].id}/>
                    <Button className="my-3" onClick={() => navigate("/licenses")}>Alle Anzeigen</Button>
                </div>
            );
        } else {
            return (
                <div>
                    <h4>Lizenzen</h4>
                    <hr />
                    Sie haben aktuell keine Lizenzen angelegt. Fügen Sie zuerst welche hinzu.
                    <br />
                    <Button className="my-2" onClick={() => navigate("/licenses/new")}>Neue Lizenz</Button>
                </div>
            );
        }
    }

    const renderTrainingStatus = () => {
        if (logbooks.length > 0) {
            return (
                <div>
                    <h4>Trainingsstand</h4>
                    <hr />
                    {renderLogbookTrainingStatus()}
                    <Button className="my-2" onClick={() => navigate("/logbooks")}>Flugbücher Anzeigen</Button>
                </div>
            );
        } else {
            return (
                <div>
                    <h4>Trainingsstand</h4>
                    <hr />
                    Sie haben leider noch keine Flugbücher angelegt. Legen Sie zuerst eins an.
                    <br />
                    <Button className="my-2" onClick={() => navigate("/logbooks/new")}>Neues Flugbuch</Button>
                </div>
            );
        }
    }

    const renderLogbookTrainingStatus = () => {
        return (
            logbooks.map(logbook => {
                let takeoffs = 0;
                const timeFrame = new Date();
                //Rechnen mit JS Date: https://www.w3docs.com/snippets/javascript/how-to-subtract-days-from-date-in-javascript.html
                timeFrame.setUTCDate(timeFrame.getUTCDate() - (6 * 30));
                logbook.flights.map(flight => {
                    const takeoffDate = new Date(flight.takeoffTime);
                    if (takeoffDate >= timeFrame) {
                        takeoffs = takeoffs + 1;
                    }
                })

                return (
                    <div key={logbook.id}>
                        <Card onClick={() => navigate(`/logbooks/view/${logbook.id}`)} style={{"cursor": "pointer"}} className="my-2" body key={logbook.id}>
                            <h5>{logbook.name}</h5>
                            Sie haben in den letzten 6 Monaten {takeoffs} Starts gemacht. Empfohlen werden 40.
                            {renderProgressbar(takeoffs, 40)}
                        </Card>
                    </div>
                );
            })
        );
    }

    const renderProgressbar = (amount, required) => {
        let variant = "success";
        if ( (amount/required) <= 0.33 ) {
            variant = "danger";
        } else if ( (amount/required) <= 0.66 ) {
            variant = "warning";
        }
        
        return (
            <ProgressBar variant={variant} now={(amount/required) * 100} label={`${amount}/${required} Starts`} />
        );
    }

    const isLoading = () => {
        if (!licenses || !logbooks) {
            return (
                <div>
                    Loading...
                </div>
            );
        } else {
            return (
                <div>
                    <Card body>
                        {renderLicenseCard()}
                        <br />
                        {renderTrainingStatus()}
                    </Card>
                </div>
            )
        }
    }

    return (
        <div>
            <Header />
            <div className="mx-auto w-75">
                <br />
                <h2>Dashboard</h2>
                <hr />
                {isLoading()}
                <br />
            </div>
        </div>
    );
}

export default Dashboard;