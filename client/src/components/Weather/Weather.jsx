import React, { useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather, setErrorMsg } from '../../store/weatherSlice';
import Header from '../Header';
import WeatherCard from './WeatherCard';
import WeatherForm from './WeatherForm';
import createBrowserHistory from '../../history';
import navigate from '../utils/navigate';


const Weather = () => {
    const dispatch = useDispatch();
    const weather = useSelector(state => state.weather);
    const weatherStatus = useSelector(state => state.weather.status);
    const userID = useSelector(state => state.auth.userId);

    useEffect(() => {
        if (weatherStatus === 'idle') {
            window.navigator.geolocation.getCurrentPosition(
                (position) => dispatch(fetchWeather(position.coords.latitude + "," + position.coords.longitude)),
                (error) => dispatch(setErrorMsg(error.message)),
                {timeout: 10000, enableHighAccuracy: true}
            );
        }
    }, [weatherStatus, dispatch]);

    const renderWeather = () => {
        if (weatherStatus === 'loading') {
            return (
                <div className='w-100'>
                    <Spinner animation='border'/>
                </div>
            );
        } else if (weatherStatus === 'succeeded') {
            return (
                <div>
                    <WeatherCard title="METAR" />
                    <br />
                    <WeatherCard title="TAF" />
                </div>
            );
        } else if (weatherStatus === 'failed') {
            return (
                <div>
                    <Alert variant="danger">
                        <Alert.Heading>Fehler!</Alert.Heading>
                        <p>{setErrorText()}</p>
                    </Alert>
                </div>
            );
        } else if (weatherStatus === 'idle') {
            return (
                <div>
                    <Alert variant="primary">
                        <Alert.Heading>Hinweis:</Alert.Heading>
                        <p>Bitte geben Sie einen ICAO-Code ein oder erlauben Sie den Zugriff auf Ihren aktuellen Standort und versuchen Sie es erneut!</p>
                    </Alert>
                </div>
            );
        }
    }

    const setErrorText = () => {
        if (weather.errormsg === "Request failed with status code 400") {
            return "Bitte geben Sie einen gültigen 4-Buchstaben ICAO-Code an!";
        } else if (weather.errormsg === "Request failed with status code 401") {
            return "API-token fehlt!";
        } else if (weather.errormsg === "Request failed with status code 403") {
            return "Das verwendete Token hat nicht die Berechtigung um diese Aktion auszuführen.";
        } else if (weather.errormsg === "Request failed with status code 429") {
            return "Das tägliche Limit der Anfragen wurde überschritten! Porbieren Sie es morgen erneut.";
        } else if (weather.errormsg === "Request failed with status code 500") {
            return "Unerwarteter Fehler beim Server. Versuchen Sie es erneut!";
        } else if (weather.errormsg === "Request failed with status code 502") {
            return "Die Verbindung ist Fehlgeschlagen. Versuchen Sie es später erneut.";
        } else if (weather.errormsg === "Request failed with status code 503") {
            return "Der Server ist vorrübergehend offline. Probieren Sie es später erneut.";
        } else if (weather.errormsg === "Unknown error acquiring position") {
            return "Ihr Standort konnte nicht ermittelt werden. Dies kann passieren, wenn Ihr Computer nicht genügend andere Netwerke erkennt. Versuchen Sie es erneut oder Geben Sie einen ICAO-Code ein.";
        } else if (weather.errormsg == "User denied geolocation prompt" || weather.errormsg == "Only secure origins are allowed (see: https://goo.gl/Y0ZkNV).") {
            return "Hinweis: Sie können die Standortermittlung nur über den Computer auf dem die App läuft verwenden, da diese App aktuell keine gesicherte Verbindung unterstützt (see: https://goo.gl/Y0ZkNV).";
        } else {
            return weather.errormsg;
        }
    }

    if(!userID) {
        navigate("/");
    }

    return (
        <div>
            <Header />
            <br />
            <div className="mx-auto w-75">
                <h2>Wetter</h2>
                <hr />
                <WeatherForm />
                <hr />
                {renderWeather()}
                <br />
            </div>
        </div>
    )

}

export default Weather;