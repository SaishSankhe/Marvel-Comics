import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import noImage from '../img/no-img.jpeg';
import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	makeStyles,
	CardHeader,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
	card: {
		maxWidth: '75vw',
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: '40px',
		borderRadius: 5,
		border: '1px solid #e23636',
		boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
	},
	cardContent: {
		textAlign: 'left',
	},
	title: {
		marginTop: '3px',
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold',
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row',
	},
	media: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12,
	},
});

const Characters = (props) => {
	const classes = useStyles();
	const [characterData, setCharacterData] = useState([]);
	const [loading, setLoading] = useState(true);

	const buildUrl = () => {
		let characterId = props.match.params.id;

		const md5 = require('blueimp-md5');
		const publickey = '636ac89ea1be55acb2fcda6ad6a8b9d6';
		const privatekey = 'f6f7c22c079938ace84b37873c026ab30a6b8505';
		const ts = new Date().getTime();
		const stringToHash = ts + privatekey + publickey;
		const hash = md5(stringToHash);
		const baseUrl = 'https://gateway.marvel.com/v1/public/characters/';
		let url = '';
		url =
			baseUrl +
			characterId +
			'?ts=' +
			ts +
			'&apikey=' +
			publickey +
			'&hash=' +
			hash;

		return url;
	};

	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			let characterId = props.match.params.id;

			if (parseInt(characterId) < 0 || characterId.match(/^[0-9]+$/) == null) {
				setCharacterData([]);
				setLoading(false);
			} else {
				try {
					setLoading(true);
					const getUrl = buildUrl();
					const { data } = await axios.get(getUrl);
					setCharacterData(data.data.results[0]);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
		}
		fetchData();
		// eslint-disable-next-line
	}, [props.match.params.id]);

	if (loading) {
		return (
			<div>
				<CircularProgress />
			</div>
		);
	} else if (characterData.length === 0) {
		return (
			<Redirect to={'/error/characters?id=' + props.match.params.id}></Redirect>
		);
	} else {
		let charImgUrl = '';
		charImgUrl =
			characterData.thumbnail.path +
			'/landscape_incredible.' +
			characterData.thumbnail.extension;

		return (
			<div>
				<Card className={classes.card} variant="outlined">
					<CardHeader
						className={classes.titleHead}
						title={characterData.name}
					/>
					<CardMedia
						className={classes.media}
						component="img"
						image={charImgUrl ? charImgUrl : noImage}
						title={characterData.name + ' image'}
					/>

					<CardContent className="textLeft">
						<Typography variant="body2" color="textSecondary" component="span">
							<dl>
								<p>
									<dt className="title">Description: </dt>
									<dd>
										{characterData.description
											? characterData.description
											: 'No description available.'}
									</dd>
								</p>
								<p>
									<dt className="title">Comics: </dt>
									<dd>
										{characterData.comics.available
											? characterData.comics.available
											: 'No comics available.'}
									</dd>
									<ol>
										{characterData.comics.items.map((item, index) => (
											<li key={index}>{item.name}</li>
										))}
									</ol>
								</p>
								<p>
									<dt className="title">Series: </dt>
									<dd>
										{characterData.series.available
											? characterData.series.available
											: 'No series available.'}
									</dd>
									<ol>
										{characterData.series.items.map((item, index) => (
											<li key={index}>{item.name}</li>
										))}
									</ol>
								</p>
								<p>
									<dt className="title">Stories: </dt>
									<dd>
										{characterData.stories.available
											? characterData.stories.available
											: 'No stories available.'}
									</dd>
									<ol>
										{characterData.stories.items.map((item, index) => (
											<li key={index}>
												{item.name} ({item.type})
											</li>
										))}
									</ol>
								</p>
							</dl>
							<div className="alignCenter">
								<Link to="/characters/page/0" className="backBtn">
									Characters list
								</Link>
							</div>
						</Typography>
					</CardContent>
				</Card>
			</div>
		);
	}
};

export default Characters;
