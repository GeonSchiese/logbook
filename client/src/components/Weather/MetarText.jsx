import React from "react";
import { useSelector } from "react-redux";
import timeFormatter from "../utils/timeFormatter";


const MetarText = () => {
    const { metar } = useSelector(state => state.weather);

    const metarDate = new Date(metar.time.dt);
    const date = "Wettermeldung vom " + metarDate.getUTCDate() + "." + (metarDate.getUTCMonth() + 1) + "." + metarDate.getUTCFullYear() + " um " + timeFormatter(metarDate.getUTCHours(), metarDate.getUTCMinutes()) + " Uhr UTC.";

    const temperature = "Die aktuelle Temperatur beträgt " + metar.temperature.value + "°C ";

    let altimeter = "und der Luftdruck liegt bei ";
    if (metar.altimeter.repr.startsWith("Q")) {
        altimeter = altimeter + metar.altimeter.value + "hPa."
    } else if (metar.altimeter.repr.startsWith("A")) {
        altimeter = altimeter + metar.altimeter.value + "inHg."
    }

    let visibility = " Die Sichtweite beträgt";
    if (metar.visibility.value === 9999) {
        visibility = visibility + " mehr als 10km";
    } else {
        visibility = visibility + metar.visibility.value + "m."
    }

    const cloudFormatter = (cloud) => {
        let returnString = "";
        if (cloud.type === "FEW") {
            returnString = "wenige Wolken (1/8 - 2/8) ";
        } else if (cloud.type === "SCT") {
            returnString = "aufgelockerte Wolken (3/8 - 4/8) ";
        } else if (cloud.type === "BKN") {
            returnString = "fast durchgängige Bewölkung (5/8 - 7/8) ";
        } else if (cloud.type === "OVC") {
            returnString = "durchgängige Bewölkung (8/8) "
        }
        returnString = returnString + "in " + (cloud.altitude * 100) + "ft (" + (Math.round((cloud.altitude * 100) / 3.281)) + "m)";

        return returnString;
    }

    let clouds = "Aktuell gibt es ";
    if (metar.clouds.length === 0) {
        clouds = clouds + "keine Wolken.";
    } else if (metar.clouds.length === 1) {
        clouds = clouds + cloudFormatter(metar.clouds[0]) + ".";
    } else {
        clouds = clouds + metar.clouds.length + " Wolkenschichten. Es gibt "
        metar.clouds.map(cloud => {
            clouds = clouds + cloudFormatter(cloud);
            if ((metar.clouds.indexOf(cloud) + 1) === metar.clouds.length) {
                clouds = clouds + ".";
            } else if ((metar.clouds.indexOf(cloud) + 1) === (metar.clouds.length - 1)) {
                clouds = clouds + " und ";
            } else {
                clouds = clouds + ", ";
            }
        });
    }

    let wx = "";
    if (metar.wx_codes) {
        if (metar.wx_codes.length != 0) {
            wx = "Es herrscht "
            metar.wx_codes.map(wxCode => {
                if (wxCode.repr.startsWith("-")) {
                    wx = wx + "leichter "
                } else if (wxCode.repr.startsWith("+")) {
                    wx = wx + "leichter "
                }
                if (wxCode.repr.includes("SH")) {
                    wx = wx + "shauernder ";
                }
                if (wxCode.repr.includes("RA")) {
                    wx = wx + "Regen. ";
                } else if (wxCode.repr.includes("SN")) {
                    wx = wx + "Schnee. ";
                } else if (wxCode.repr.includes("GR")) {
                    wx = wx + "Hagel. ";
                } else if (wxCode.repr.includes("BR")) {
                    wx = wx + "Nebel. "
                }
            });
        } else {
            wx = "Es herrscht kein Niederschlag."
        }
    } else {
        wx = wx + "kein Niederschlag."
    }

    let wind = "Es weht ";
    if (!metar.wind_speed) {
        wind = wind + "kein Wind."
    } else {
        if (metar.wind_speed.value < 5) {
            wind = wind + "leichter ";
        } else if (metar.wind_speed.value <= 15) {
            wind = wind + "mäßiger ";
        } else {
            wind = wind + "starker ";
        }

        if (metar.wind_gust) {
            wind = wind + "und böiger Wind mit " + metar.wind_speed.value + "kt (" + Math.round(metar.wind_speed.value * 1.852) + "km/h) und böen von " + metar.wind_gust.value + "kt (" + Math.round(metar.wind_gust.value * 1.852) + "km/h) aus ";
        } else {
            wind = wind + "Wind mit " + metar.wind_speed.value + "kt (" + Math.round(metar.wind_speed.value * 1.852) + "km/h) aus ";
        }

        if (metar.wind_direction.value < 22 || metar.wind_direction.value > 337) {
            wind = wind + "nördlicher Richtung";
        } else if (metar.wind_direction.value < 67) {
            wind = wind + "nordwestlicher Richtung";
        } else if (metar.wind_direction.value < 112) {
            wind = wind + "östlicher Richtung";
        } else if (metar.wind_direction.value < 157) {
            wind = wind + "südwestlicher Richtung";
        } else if (metar.wind_direction.value < 202) {
            wind = wind + "südlicher Richtung";
        } else if (metar.wind_direction.value < 247) {
            wind = wind + "südwestlicher Richtung";
        } else if (metar.wind_direction.value < 292) {
            wind = wind + "westlicher Richtung";
        } else if (metar.wind_direction.value < 337) {
            wind = wind + "nordwestlicher Richtung";
        }
        wind = wind + " (" + (metar.wind_direction.repr) + "°).";

        if (metar.wind_variable_direction.length != 0) {
            wind = wind + " Der Wind variiert jedoch zwischen " + metar.wind_variable_direction[0].repr + "° und " + metar.wind_variable_direction[metar.wind_variable_direction.length - 1].repr + "°."
        }
    }

    let remarks = "";
    if (metar.remarks === "NOSIG") {
        remarks = "In den nächsten 2 Stunden sind keine signifikanten Wetteränderungen vorhergesagt."
    }

    let flightrules = "Demnach sind Flüge nach Sichtflugregeln (VFR) ";
    if (metar.flight_rules === "VFR") {
        flightrules = flightrules + "möglich."
    } else {
        flightrules = flightrules + "nicht möglich."
    }

    return (
        <>
            {date}<br />
            {temperature}
            {altimeter}
            {visibility}<br />
            {clouds}<br />
            {wx}<br />
            {wind}<br />
            {remarks}<br />
            {flightrules}
        </>
    );
}

export default MetarText;