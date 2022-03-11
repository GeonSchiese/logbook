import axios from 'axios';

export default axios.create({
    baseURL: 'https://avwx.rest/api/',
    timeout: 5000,
    headers: {"Authorization": ""}
});