import React from "react";
import { Stack, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import createBrowserHistory from '../history';
import { setSignIn } from "../store/authSlice";
import { FaRegPaperPlane } from "react-icons/fa"
import navigate from "./utils/navigate";

const Home = () => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);

    return (
        <div className="position-absolute top-50 start-50 translate-middle w-100">
            <Stack gap={3} className="col-md-5 mx-auto">
                <h1 className="text-center">logbook <FaRegPaperPlane /></h1>
                <Button className="mx-auto w-50" onClick={() => navigate("/createAccount")} variant="primary">Account erstellen</Button>
                <Button className="mx-auto w-50" onClick={() => navigate("/login")} variant="primary">Einloggen</Button>
            </Stack>
        </div>
    );
}

export default Home;