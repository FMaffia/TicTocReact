import React from "react"
import '../index.scss';

function Header() {
    return (
        <div className="row">
            <div className="jumbotron jumbotron-fluid col-12">
                <div className="container">
                    <h1 className="display-4">TicTacToe</h1>
                    <p className="lead">React tutorial</p>
                </div>
            </div>
        </div>
    )
}
export default Header;