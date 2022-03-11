import _ from "lodash";
import React from "react";
import { ProgressBar } from "react-bootstrap";
import { useSelector } from "react-redux";

const TakeoffTypeStatus = (props) => {
    const item = props.item;
    const logbook = useSelector(state => state.logbook.flightlogs.filter(element => {
        return element.id === props.logbookID;
    })[0]);

    const timeFrame = new Date();
    //Rechnen mit JS Date: https://www.w3docs.com/snippets/javascript/how-to-subtract-days-from-date-in-javascript.html
    timeFrame.setUTCDate(timeFrame.getUTCDate() - (item.months * 30));

    const renderProgressbar = (amount) => {
        if(amount < item.amount) {
            return (
                <ProgressBar variant="danger" now={(amount/item.amount) * 100} label={`${amount}/${item.amount} Starts`} />
            );
        } else {
            return (
                <ProgressBar variant="success" now={100} label={`${amount}/${item.amount} Starts`} />
            );
        }
    }

    const renderStatus = () => {
        //lodash cloneDeep idee kommt hierher (2. Antwort): https://stackoverflow.com/questions/69749850/typeerror-cant-define-array-index-property-past-the-end-of-an-array-with-non-w
        const flights = _.cloneDeep(logbook.flights).reverse();

        let amountInTimeFrame = 0;
        let lastValidDate = null;
        flights.map(flight => {
            const takeoffDate = new Date(flight.takeoffTime);
            if (takeoffDate >= timeFrame && flight.type === item.takeoffType) {
                amountInTimeFrame = amountInTimeFrame + 1;
                if (amountInTimeFrame <= item.amount) {
                    takeoffDate.setUTCDate(takeoffDate.getUTCDate() + (item.months * 30));
                    lastValidDate = takeoffDate;
                }
            }
        });

        let invalidDateString = "";
        if (amountInTimeFrame < item.amount) {
            invalidDateString = " Sie müssen diese Berechtigung erst wieder erwerben. Dazu fehlen " + (item.amount - amountInTimeFrame) + " Starts.";
        } else {
            if(lastValidDate === null) {
                invalidDateString = " Die Berechtigung kann nicht verfallen.";
            } else {
                invalidDateString = " Am " + lastValidDate.toLocaleDateString() + " verfällt diese Berechtigung.";
            }
        }

        return (
            <div>
                <h6>{item.takeoffType}:</h6>
                {renderProgressbar(amountInTimeFrame)}
                Sie haben {amountInTimeFrame} Starts des Typs "{item.takeoffType}" in den letzten {item.months} Monaten gemacht (erforderlich {item.amount}).
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

export default TakeoffTypeStatus;