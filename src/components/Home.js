import React from 'react';
import '../App.css';

const Home = () => {
	return (
		<div>
			<h2>
				This is a single page application created using React.js and Marvel API.
			</h2>
			<h3>This application uses Characters, Comics and Series listings.</h3>
			<p>
				Developed by{' '}
				<a
					href="https://www.linkedin.com/in/saishsankhe/"
					className="underline"
				>
					Saish Sankhe
				</a>
			</p>
		</div>
	);
};

export default Home;
