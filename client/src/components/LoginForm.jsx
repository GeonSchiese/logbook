import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { FaRegPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import flightlog from "../apis/flightlog";
import { setSignIn } from "../store/authSlice";
import navigate from "./utils/navigate";

const LoginForm = () => {
    const dispatch = useDispatch();

    const [buttonText, setButtonText] = useState("");
    const [userID, setUserID] = useState("");
    const [failed, setFailed] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const isSignedIn = useSelector(state => state.auth.isSignedIn);

    useEffect(() => {
        if (window.location.pathname === "/login") {
            setButtonText("Einloggen");
        } else {
            setButtonText("Account erstellen")
        }
    }, []);

    const handleChange = (event, action) => {
        action(event.target.value);
        if (failed === true) {
            setFailed(false);
        }
    }
    // ********************************************************
    // Quelle: https://react-bootstrap.netlify.app/forms/validation/
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            validateAction();
        }
        event.preventDefault();
        setValidated(true);
    }
    // ********************************************************

    async function validateAction() {
        const response = await flightlog.get("/users");
        let isExistingUser = false;
        response.data.map(user => {
            if (user.id === userID) {
                isExistingUser = true;
            }
            return "";
        });
        if (window.location.pathname === "/login") {
            if (isExistingUser === true) {
                setIsDisabled(true);
                dispatch(setSignIn(userID));
            } else {
                setFailed(true);
                setUserID("");
            }
        } else {
            if (isExistingUser === true) {
                setFailed(true)
                setUserID("");
            } else {
                const userData = { "id": userID, "licenses": [], "flightlogs": [] }
                await flightlog.post("/users", userData);
                setIsDisabled(true);
                dispatch(setSignIn(userID));
            }
        }
    }

    const renderErrorMessage = () => {
        if (window.location.pathname === "/login" && failed) {
            return "Der Nutzer wurde nicht gefunden. Prüfen Sie Ihre Eingabe oder versuchen Sie es erneut.";
        } else if (window.location.pathname === "/createAccount" && failed) {
            return "Ein Nutzer mit diesem Kürzel existiert bereits. Geben Sie ein anderes an.";
        } else {
            return "Bitte geben Sie einen Nicknamen/Kürzel an.";
        }
    }

    const userIDForm = () => {
        return (
            <Form className="mx-auto text-center w-50" noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="userID" className="mb-3">
                    <Form.Label>Nickname/Kürzel</Form.Label>
                    <Form.Control required disabled={isDisabled} onChange={(event) => handleChange(event, setUserID)} type="text" name="userID" placeholder="123" value={userID} />
                    <Form.Control.Feedback type="invalid">
                        {renderErrorMessage()}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button className="w-100" disabled={isDisabled} type="submit" variant="primary">{buttonText}</Button>
            </Form>
        );
    }

    if (isSignedIn === true) {
        navigate("/dashboard");
    }

    return (
        <div className="position-absolute top-50 start-50 translate-middle w-100">
            <Stack gap={3} className="col-md-5 mx-auto">
                <h1 className="text-center">logbook <FaRegPaperPlane /></h1>
                {userIDForm()}
                <Button className="mx-auto w-50" onClick={() => navigate("/")} variant="primary">Zurück</Button>
            </Stack>
        </div>
    );
}

export default LoginForm;