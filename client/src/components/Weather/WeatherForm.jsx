import React from "react";
import { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchWeather } from "../../store/weatherSlice";

const WeatherForm = () => {
    const dispatch = useDispatch();

    const [isDisabled, setIsDisabled] = useState(false);
    const [icaoCode, setIcaoCode] = useState("");

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(isDisabled) {
                window.navigator.geolocation.getCurrentPosition(
                    (position) => dispatch(fetchWeather(position.coords.latitude + "," + position.coords.longitude)) 
                );
            } else {
                dispatch(fetchWeather(icaoCode));
            }
        }
        event.preventDefault();
        setValidated(true);
    }

    const isRequired = () => {
        if (isDisabled) {
            return <Form.Control type="text" placeholder="Bsp. EDDK" disabled value={icaoCode}/>
        }
        return <Form.Control required type="text" placeholder="Bsp. EDDK" value={icaoCode} onChange={(event) => setIcaoCode(event.target.value)} />
    }

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Col} md="4" controlId="fourletterCode">
                    <Form.Label>ICAO-Code</Form.Label>
                    {isRequired()}
                    <Form.Control.Feedback type="invalid">
                        Bitte geben Sie einen ICAO-Code ein!
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mt-1" as={Col} md="4" controlId="useLocation" checked={isDisabled} onChange={() => setIsDisabled(!isDisabled)}>
                    <Form.Check size="lg" type="switch" id="useLocation" label="Aktuellen Standort benutzen" />
                </Form.Group>
                <br />
                <Button md="2" type="submit" variant="primary">Neu Laden</Button>
            </Form>
        </div>
    )
}

export default WeatherForm;