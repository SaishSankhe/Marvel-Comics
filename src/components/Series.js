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

const Series = (props) => {
	const classes = useStyles();
	const [seriesData, setSeriesData] = useState([]);
	const [loading, setLoading] = useState(true);

	const buildUrl = () => {
		let seriesId = props.match.params.id;

		const md5 = require('blueimp-md5');
		const publickey = '636ac89ea1be55acb2fcda6ad6a8b9d6';
		const privatekey = 'f6f7c22c079938ace84b37873c026ab30a6b8505';
		const ts = new Date().getTime();
		const stringToHash = ts + privatekey + publickey;
		const hash = md5(stringToHash);
		const baseUrl = 'https://gateway.marvel.com/v1/public/series/';
		let url = '';
		url =
			baseUrl +
			seriesId +
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
			let seriesId = props.match.params.id;

			if (parseInt(seriesId) < 0 || seriesId.match(/^[0-9]+$/) == null) {
				setSeriesData([]);
				setLoading(false);
			} else {
				try {
					setLoading(true);
					const getUrl = buildUrl();
					const { data } = await axios.get(getUrl);
					setSeriesData(data.data.results[0]);
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
	} else if (seriesData.length === 0) {
		return (
			<Redirect to={'/error/series?id=' + props.match.params.id}></Redirect>
		);
	} else {
		let charImgUrl = '';
		charImgUrl =
			seriesData.thumbnail.path +
			'/landscape_incredible.' +
			seriesData.thumbnail.extension;

		return (
			<div>
				<Card className={classes.card} variant="outlined">
					<CardHeader className={classes.titleHead} title={seriesData.title} />
					<CardMedia
						className={classes.media}
						component="img"
						image={charImgUrl ? charImgUrl : noImage}
						title={seriesData.title + ' image'}
					/>

					<CardContent className="textLeft">
						<Typography variant="body2" color="textSecondary" component="span">
							<dl>
								<p>
									<dt className="title">Description: </dt>
									<dd>
										{seriesData.description
											? seriesData.description
											: 'No description available.'}
									</dd>
								</p>
								<p>
									<dt className="title">Start year: </dt>
									<dd>
										{seriesData.startYear
											? seriesData.startYear
											: 'Start year not available.'}
									</dd>
								</p>
								<p>
									<dt className="title">End year: </dt>
									<dd>
										{seriesData.endYear
											? seriesData.endYear
											: 'End year not available.'}
									</dd>
								</p>
								<p>
									<dt className="title">Creators: </dt>
									<dd>
										{seriesData.creators.available > 0
											? seriesData.creators.available
											: 'No creators available.'}
									</dd>
									<ol>
										{seriesData.creators.items.map((item, index) => (
											<li key={index}>
												{item.name} - {item.role}
											</li>
										))}
									</ol>
								</p>
								<p>
									<dt className="title">Characters: </dt>
									<dd>
										{seriesData.characters.available > 0
											? seriesData.characters.available
											: 'No characters available.'}
									</dd>
									<ol>
										{seriesData.characters.items.map((item, index) => (
											<li key={index}>{item.name}</li>
										))}
									</ol>
								</p>
								<p>
									<dt className="title">Stories: </dt>
									<dd>
										{seriesData.stories.available > 0
											? seriesData.stories.available
											: 'No stories available.'}
									</dd>
									<ol>
										{seriesData.stories.items.map((item, index) => (
											<li key={index}>{item.name}</li>
										))}
									</ol>
								</p>
								<p>
									<dt className="title">Comics: </dt>
									<dd>
										{seriesData.comics.available > 0
											? seriesData.comics.available
											: 'No comics available.'}
									</dd>
									<ol>
										{seriesData.comics.items.map((item, index) => (
											<li key={index}>{item.name}</li>
										))}
									</ol>
								</p>
							</dl>
							<div className="alignCenter">
								<Link to="/series/page/0" className="backBtn">
									Series list
								</Link>
							</div>
						</Typography>
					</CardContent>
				</Card>
			</div>
		);
	}
};

export default Series;
