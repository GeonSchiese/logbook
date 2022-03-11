import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import MetarText from "./MetarText";
import TafText from "./TafText";

const WeatherCard = (props) => {

    const { metar, taf } = useSelector(state => state.weather);

    const getCardText = () => {
        if (props.title === "METAR") {
            if (!metar) {
                return "Für diesen Flughafen steht keine aktuelle Wettermeldung zur Verfügung. Versuche es später erneut oder probiere einen anderen Flughafen.";
            }
            return (
                <>
                    {metar.raw}
                    <br />
                    <br />
                    <MetarText />
                </>
            );
        } else if (props.title === "TAF") {
            if (!taf) {
                return "Für diesen Flughafen steht keine aktuelle Wettevorhersage zur Verfügung. Versuche es später erneut oder probiere einen anderen Flughafen.";
            }
            return (
                <>
                    {taf.raw}
                    <br />
                    <br />
                    <TafText />
                </>
            );
        }
    }

    return (
        <div>
            <Card>
                <Card.Header as='h3'>{props.title}</Card.Header>
                <Card.Body>
                    <Card.Text>
                        {getCardText()}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default WeatherCard;