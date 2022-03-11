import _ from "lodash";
import React from "react";
import { ProgressBar } from "react-bootstrap";
import { useSelector } from "react-redux";

const PermissionStatus = (props) => {
    const item = props.permission;
    const logbook = useSelector(state => state.logbook.flightlogs.filter(element => {
        return element.id === props.logbookID;
    })[0]);

    

    const renderAmountProgressbar = (amount) => {
        if(amount < item.amount) {
            return (
                <ProgressBar className="my-1" variant="danger" now={(amount/item.amount) * 100} label={`${amount}/${item.amount} Starts`} />
            );
        } else {
            return (
                <ProgressBar className="my-1" variant="success" now={100} label={`${amount}/${item.amount} Starts`} />
            );
        }
    }

    const renderHoursProgressbar = (hours) => {
        if(hours < item.hours) {
            //Auf bestimmte Nachkommastellen runden: https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
            return (
                <ProgressBar className="my-1" variant="danger" now={(hours/item.hours) * 100} label={`${Math.round(hours * 100) / 100}/${item.hours} Flugstunden`} />
            );
        } else {
            return (
                <ProgressBar className="my-1" variant="success" now={100} label={`${Math.round(hours * 10) / 10}/${item.hours} Flugstunden`} />
            );
        }
    }

    const timeFrame = new Date();
    //Rechnen mit JS Date: https://www.w3docs.com/snippets/javascript/how-to-subtract-days-from-date-in-javascript.html
    timeFrame.setUTCDate(timeFrame.getUTCDate() - (item.months * 30));

    const renderStatus = () => {
        //lodash cloneDeep idee kommt hierher (2. Antwort): https://stackoverflow.com/questions/69749850/typeerror-cant-define-array-index-property-past-the-end-of-an-array-with-non-w
        const flights = _.cloneDeep(logbook.flights).reverse();

        let amountInTimeFrame = 0;
        let flightTimeHours = 0;
        let lastValidDate = null;

        flights.map(flight => {
            const takeoffDate = new Date(flight.takeoffTime);
            if (takeoffDate >= timeFrame) {
                amountInTimeFrame = amountInTimeFrame + 1;
                flightTimeHours = flightTimeHours + (flight.flightTime / 60);
                if (amountInTimeFrame <= item.amount) {
                    const temp = takeoffDate;
                    temp.setUTCDate(temp.getUTCDate() + (item.months * 30));
                    lastValidDate = temp;
                }
                if (flightTimeHours <= item.hours) {
                    const temp = takeoffDate;
                    temp.setUTCDate(temp.getUTCDate() + (item.months * 30));
                    lastValidDate = temp;
                }
            }
        });


        let invalidDateString = "";
        if(amountInTimeFrame >= item.amount && flightTimeHours >= item.hours) {
            if(lastValidDate === null) {
                invalidDateString = " Die Berechtigung kann nicht verfallen.";
            } else {
                invalidDateString = " Am " + lastValidDate.toLocaleDateString() + " verfällt diese Berechtigung.";
            }
        } else {
            invalidDateString = " Daher müssen Sie diese Berechtigung erst wieder erwerben. Dazu fehlen ";
            if ((item.amount - amountInTimeFrame) <= 0) {
                invalidDateString = invalidDateString + " 0 Starts, ";
            } else {
                invalidDateString = invalidDateString + (item.amount - amountInTimeFrame) + " Starts, ";
            }
            if ((item.hours - flightTimeHours) <= 0) {
                invalidDateString = invalidDateString + " 0 Stunden und 0 Minuten.";
            } else {
                invalidDateString = invalidDateString + Math.floor(item.hours - flightTimeHours) + " Stunde(n) und " + Math.round(((item.hours - flightTimeHours) - Math.floor(item.hours - flightTimeHours)) * 60) + " Minute(n).";
            }
        }

        return (
            <div>
                <h6>{item.permission}:</h6>
                {renderAmountProgressbar(amountInTimeFrame)}
                {renderHoursProgressbar(flightTimeHours)}
                Sie haben {amountInTimeFrame} Starts in den letzten {item.months} Monaten gemacht (erforderlich {item.amount}).
                {invalidDateString}
                <br />
                <br />
            </div>
        );
    }

    const isLoading = () => {
        if (!logbook) {
            return (
                <div>
                    Loading...
                </div>
            );
        } else {
            return (
                <div>
                    {renderStatus()}
                </div>
            );
        }
    }

    return (
        <div>
            {isLoading()}
        </div>
    )
}

export default PermissionStatus;