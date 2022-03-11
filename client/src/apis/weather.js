import axios from 'axios';

//.env Datei von hier: https://stackoverflow.com/questions/48699820/how-do-i-hide-api-key-in-create-react-app

export default axios.create({
    baseURL: 'https://avwx.rest/api/',
    timeout: 5000,
    headers: {"Authorization": process.env.REACT_APP_WEATHER_API_KEY}
});