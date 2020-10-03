import React from 'react';
import { Route } from 'react-router-dom'

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand navbar-dark bg-dark mb-4">
                <div className="container">
                    <a className="navbar-brand" href="#">SpaceApps2020</a>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">About</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )

    }
}

export default Navbar;