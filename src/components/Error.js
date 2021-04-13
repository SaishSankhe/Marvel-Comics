import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Error = () => {
    return (
        <div>
            <h1>
                Error 404: Page not found!
			</h1>
            <div className="alignCenter">
                <Link to='/' className='backBtn'>Home</Link>
            </div>
        </div>
    );
};

export default Error;