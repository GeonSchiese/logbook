import React from "react";
import { Navbar, Container, Offcanvas, Nav, NavDropdown } from "react-bootstrap";
import createBrowserHistory from '../history';
import { BsPower, BsFillCloudSunFill, BsListUl, BsCreditCard2Front } from "react-icons/bs";
import { AiOutlineDashboard } from "react-icons/ai"
import { FaRegPaperPlane } from "react-icons/fa"
import { useDispatch } from "react-redux";
import { setSignOut } from "../store/authSlice";
import { clearLicenses } from "../store/licenseSlice";
import { clearLogbooks } from "../store/logbookSlice";
import { clearWeather } from "../store/weatherSlice";
import navigate from "./utils/navigate";

const Header = () => {
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(setSignOut());
        dispatch(clearLicenses());
        dispatch(clearLogbooks());
        dispatch(clearWeather());
        navigate("/");
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand={false}>
                <Container fluid>
                    <Navbar.Brand onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>logbook <FaRegPaperPlane /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar" />
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">Menü</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="flex-grow-1 pe-3 h-100 w-100">
                                <Nav.Link onClick={() => navigate('/dashboard')}><AiOutlineDashboard />&nbsp; Dashboard</Nav.Link>
                                <hr />
                                <Nav.Link onClick={() => navigate('/logbooks')}><BsListUl />&nbsp; Flugbücher</Nav.Link>
                                <Nav.Link onClick={() => navigate('/licenses')}><BsCreditCard2Front className="mr-10" />&nbsp; Lizenzen</Nav.Link>
                                <Nav.Link onClick={() => navigate('/weather')}><BsFillCloudSunFill />&nbsp; Wetter</Nav.Link>
                                <hr />
                                <Nav.Link style={{ color: "red" }} onClick={() => handleSignOut()}><BsPower className="mx-auto" />&nbsp; Ausloggen</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </div>
    );
}

export default Header;