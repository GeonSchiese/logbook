import React from "react";
import { useSelector } from "react-redux";
import timeFormatter from "../utils/timeFormatter";

const TafText = () => {
    const { taf, metar } = useSelector(state => state.weather);

    const renderMaster = () => {
        let key = 0;
        return (
            taf.forecast.map(forecast => {
                key = key + 1;
                return (
                    <span key={key}>
                        {renderForecast(forecast)}
                        <br />
                    </span>
                );
            })
        );
    }

    const renderForecast = (forecast) => {
        const forecastStartDate = new Date(forecast.start_time.dt);
        const forecastEndDate = new Date(forecast.end_time.dt);
        let type = "";
        if (forecast.type === "FROM" || forecast.type === "BECMG") {
            type = "Es wird ab " + timeFormatter(forecastStartDate.getUTCHours(), forecastStartDate.getUTCMinutes()) + " Uhr UTC am " + forecastStartDate.getUTCDate() + "." + (forecastStartDate.getUTCMonth() + 1) + "." + forecastStartDate.getUTCFullYear() + " mit folgenden Wetteränderungen gerechnet:";
        } else if (forecast.type === "TEMPO") {
            type = "Zwischen " + timeFormatter(forecastStartDate.getUTCHours(), forecastStartDate.getUTCMinutes()) + " Uhr UTC am " + forecastStartDate.getUTCDate() + "." + (forecastStartDate.getUTCMonth() + 1) + "." + forecastStartDate.getUTCFullYear() + " und " + timeFormatter(forecastEndDate.getUTCHours(), forecastEndDate.getUTCMinutes()) + " Uhr UTC am " + forecastEndDate.getUTCDate() + "." + (forecastEndDate.getUTCMonth() + 1) + "." + forecastEndDate.getUTCFullYear() + " wird mit folgenden temporären Wetteränderungen gerechnet:"
        }

        let altimeter = "";
        if (forecast.altimeter) {
            altimeter = "Der Luftdruck "
            if (forecast.altimeter.repr > metar.altimeter.repr) {
                altimeter = altimeter + " steigt auf "
            } else {
                altimeter = altimeter + " sinkt auf "
            }
            if (forecast.altimeter.repr.startsWith("Q")) {
                altimeter = altimeter + forecast.altimeter.value + "hPa ab. "
            } else if (forecast.altimeter.repr.startsWith("A")) {
                altimeter = altimeter + forecast.altimeter.value + "inHg ab. "
            }
        }

        let visibility = "";
        if (forecast.visibility) {
            visibility = "Die Sichtweite ";
            if (forecast.visibility.value >= metar.visibility.value) {
                visibility = visibility + "steigt auf ";
            } else {
                visibility = visibility + "sinkt auf ";
            }
            if (forecast.visibility.value === 9999) {
                visibility = visibility + "mehr als 10km. ";
            } else {
                visibility = visibility + forecast.visibility.value + "m. ";
            }
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

        let clouds = "";
        if (forecast.clouds.length === 0 && metar.clouds.length !== 0) {
            clouds = "Die Wolken lösen sich auf. ";
        } else if (forecast.clouds.length === 0) {
            clouds = "Es gibt keine Wolken. ";
        } else if (forecast.clouds.length === 1) {
            clouds = "Es herrscht " + cloudFormatter(forecast.clouds[0]) + ". ";
        } else {
            clouds = "Es sind " + forecast.clouds.length + " Wolkenschichten vorhanden. Es gibt "
            forecast.clouds.map(cloud => {
                clouds = clouds + cloudFormatter(cloud);
                if ((forecast.clouds.indexOf(cloud) + 1) === forecast.clouds.length) {
                    clouds = clouds + ". ";
                } else if ((forecast.clouds.indexOf(cloud) + 1) === (forecast.clouds.length - 1)) {
                    clouds = clouds + " und ";
                } else {
                    clouds = clouds + ", ";
                }
                return "";
            });
        }

        let wx = "";
        if (forecast.wx_codes) {
            if (forecast.wx_codes.length !== 0) {
                forecast.wx_codes.map(wxCode => {
                    wx = wx + "Es herrscht ";
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
                    return "";
                });
            } else if (forecast.wx_codes.length === 0 && metar.wx_codes.length !== 0) {
                wx = "Der Niederschlag klingt ab. ";
            }
        }

        let wind = "";
        if (forecast.wind_speed) {
            wind = "Es weht "
            if (forecast.wind_speed.value < 5) {
                wind = wind + "leichter ";
            } else if (forecast.wind_speed.value <= 15) {
                wind = wind + "mäßiger ";
            } else {
                wind = wind + "starker ";
            }

            if (forecast.wind_gust) {
                wind = wind + "und böiger Wind mit " + forecast.wind_speed.value + "kt (" + Math.round(forecast.wind_speed.value * 1.852) + "km/h) und böen von " + forecast.wind_gust.value + "kt (" + Math.round(forecast.wind_gust.value * 1.852) + "km/h) aus ";
            } else {
                wind = wind + "Wind mit " + forecast.wind_speed.value + "kt (" + Math.round(forecast.wind_speed.value * 1.852) + "km/h) aus ";
            }

            if (forecast.wind_direction.value < 22 || forecast.wind_direction.value > 337) {
                wind = wind + "nördlicher Richtung";
            } else if (forecast.wind_direction.value < 67) {
                wind = wind + "nordwestlicher Richtung";
            } else if (forecast.wind_direction.value < 112) {
                wind = wind + "östlicher Richtung";
            } else if (forecast.wind_direction.value < 157) {
                wind = wind + "südwestlicher Richtung";
            } else if (forecast.wind_direction.value < 202) {
                wind = wind + "südlicher Richtung";
            } else if (forecast.wind_direction.value < 247) {
                wind = wind + "südwestlicher Richtung";
            } else if (forecast.wind_direction.value < 292) {
                wind = wind + "westlicher Richtung";
            } else if (forecast.wind_direction.value < 337) {
                wind = wind + "nordwestlicher Richtung";
            }
            wind = wind + " (" + (forecast.wind_direction.repr) + "°). ";

            if (forecast.wind_variable_direction) {
                wind = wind + " Der Wind variiert jedoch zwischen " + forecast.wind_variable_direction[0].repr + "° und " + forecast.wind_variable_direction[forecast.wind_variable_direction.length - 1].repr + "°. "
            }
        }

        let flightrules = "Demnach sind in diesem Zeitraum Flüge nach Sichtflugregeln (VFR) ";
        if (forecast.flight_rules === "VFR") {
            flightrules = flightrules + "möglich."
        } else {
            flightrules = flightrules + "nicht möglich."
        }

        return (
            <span>
                <br />
                {type}
                <br />
                {altimeter + visibility + clouds + wx + wind + flightrules}
            </span>
        );
    }

    const date = new Date(taf.time.dt);
    const startDate = new Date(taf.start_time.dt);
    const endDate = new Date(taf.end_time.dt);

    return (
        <>
            Wettervorhersage vom {date.getUTCDate() + "." + (date.getUTCMonth() + 1) + "." + date.getUTCFullYear() + " um " + timeFormatter(date.getUTCHours(), date.getUTCMinutes()) + " Uhr UTC"}
            , gültig von {timeFormatter(startDate.getUTCHours(), startDate.getUTCMinutes()) + " Uhr UTC am " + startDate.getUTCDate() + "." + (startDate.getUTCMonth() + 1) + "." + startDate.getUTCFullYear() + " "}
            bis {timeFormatter(endDate.getUTCHours(), endDate.getUTCMinutes()) + " Uhr UTC am " + endDate.getUTCDate() + "." + (endDate.getUTCMonth() + 1) + "." + endDate.getUTCFullYear()}.
            {renderMaster()}
        </>
    );
}

export default TafText;