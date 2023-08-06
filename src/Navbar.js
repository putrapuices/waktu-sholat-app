import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const CustomNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="sticky-top">
            <Container>
                <Navbar.Brand href="/">Waktu Sholat App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink className="nav-link" exact to="/" activeClassName="active">
                            Home
                        </NavLink>
                        <NavLink className="nav-link" to="/WaktuSholatApp" activeClassName="active">
                            Prayer Times
                        </NavLink>
                        <NavLink className="nav-link" to="/PrayerTimesCalendar" activeClassName="active">
                            Prayer Times Calendar
                        </NavLink>
                        <NavLink className="nav-link" to="/quran" activeClassName="active">
                            Al - Qur'an
                        </NavLink>
                        <NavLink className="nav-link" to="/setting" activeClassName="active">
                            Setting Page
                        </NavLink>
                        {/* Tambahkan menu lain jika diperlukan */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;
