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

const Comics = (props) => {
	const classes = useStyles();
	const [comicData, setComicData] = useState([]);
	const [loading, setLoading] = useState(true);

	const buildUrl = () => {
		let comicId = props.match.params.id;

		const md5 = require('blueimp-md5');
		const publickey = '636ac89ea1be55acb2fcda6ad6a8b9d6';
		const privatekey = 'f6f7c22c079938ace84b37873c026ab30a6b8505';
		const ts = new Date().getTime();
		const stringToHash = ts + privatekey + publickey;
		const hash = md5(stringToHash);
		const baseUrl = 'https://gateway.marvel.com/v1/public/comics/';
		let url = '';
		url =
			baseUrl +
			comicId +
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
			let comicId = props.match.params.id;

			if (parseInt(comicId) < 0 || comicId.match(/^[0-9]+$/) == null) {
				setComicData([]);
				setLoading(false);
			} else {
				try {
					setLoading(true);
					const getUrl = buildUrl();
					const { data } = await axios.get(getUrl);
					setComicData(data.data.results[0]);
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
	} else if (comicData.length === 0) {
		return (
			<Redirect to={'/error/comics?id=' + props.match.params.id}></Redirect>
		);
	} else {
		let charImgUrl = '';
		charImgUrl =
			comicData.thumbnail.path +
			'/landscape_incredible.' +
			comicData.thumbnail.extension;

		return (
			<div>
				<Card className={classes.card} variant="outlined">
					<CardHeader className={classes.titleHead} title={comicData.title} />
					<CardMedia
						className={classes.media}
						component="img"
						image={charImgUrl ? charImgUrl : noImage}
						title={comicData.title + ' image'}
					/>

					<CardContent className="textLeft">
						<Typography variant="body2" color="textSecondary" component="span">
							<dl>
								<p>
									<dt className="title">Description: </dt>
									<dd>
										{comicData.description
											? comicData.description
											: 'No description available.'}
									</dd>
								</p>
								<p>
									<dt className="title">Page count: </dt>
									<dd>
										{comicData.pageCount
											? comicData.pageCount
											: 'Page count not available.'}
									</dd>
								</p>
								<p>
									<dt className="title">Series: </dt>
									<dd>{comicData.series.name}</dd>
								</p>
								<p>
									<dt className="title">Variants: </dt>
									<dd>
										{comicData.variants.length > 0
											? comicData.variants.length
											: 'No variants available.'}
									</dd>
									<ol>
										{comicData.variants.map((item, index) => (
											<li key={index}>{item.name}</li>
										))}
									</ol>
								</p>
								<p>
									<dt className="title">Creators: </dt>
									<dd>
										{comicData.creators.available > 0
											? comicData.creators.available
											: 'No creators available.'}
									</dd>
									<ol>
										{comicData.creators.items.map((item, index) => (
											<li key={index}>
												{item.name} - {item.role}
											</li>
										))}
									</ol>
								</p>
								<p>
									<dt className="title">Characters: </dt>
									<dd>
										{comicData.characters.available > 0
											? comicData.characters.available
											: 'No characters available.'}
									</dd>
									<ol>
										{comicData.characters.items.map((item, index) => (
											<li key={index}>{item.name}</li>
										))}
									</ol>
								</p>
							</dl>
							<div className="alignCenter">
								<Link to="/comics/page/0" className="backBtn">
									Comics list
								</Link>
							</div>
						</Typography>
					</CardContent>
				</Card>
			</div>
		);
	}
};

export default Comics;
