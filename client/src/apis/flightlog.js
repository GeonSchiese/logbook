import axios from "axios";

//Quelle: Grider, Video Nr. 339, Minute 2:00
export default axios.create({
    baseURL: "http://localhost:10500/"
});