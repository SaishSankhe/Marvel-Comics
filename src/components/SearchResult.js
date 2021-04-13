import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import noImage from '../img/no-img.jpeg';
import { Link } from 'react-router-dom';
import {
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Typography,
	makeStyles,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: '5px',
		borderRadius: 5,
		border: '1px solid #e23636',
		boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
	},
	titleHead: {
		fontWeight: 'bold',
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row',
	},
	media: {
		height: '100%',
		width: '100%',
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12,
	},
	pagination: {
		display: 'flex',
		justifyContent: 'left',
		margin: '-20px 20px 20px 20px',
	},
});

const SearchResult = (props) => {
	const classes = useStyles();
	const searchTerm = props.match.params.query;
	const searchListing = props.match.params.listing;
	const [searchData, setSearchData] = useState([]);
	const [loading, setLoading] = useState(true);
	let card = null;

	useEffect(() => {
		console.log('search useEffect fired');
		async function fetchData() {
			try {
				console.log(`in fetch searchTerm: ${searchTerm}`);
				setLoading(true);
				const searchUrl = buildSearchUrl();
				const { data } = await axios.get(searchUrl);
				setSearchData(data.data);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		if (searchTerm) {
			fetchData();
		}
	}, [props.match.params.listing, props.match.params.query]);

	const buildSearchUrl = () => {
		const md5 = require('blueimp-md5');
		const publickey = '636ac89ea1be55acb2fcda6ad6a8b9d6';
		const privatekey = 'f6f7c22c079938ace84b37873c026ab30a6b8505';
		const ts = new Date().getTime();
		const stringToHash = ts + privatekey + publickey;
		const hash = md5(stringToHash);
		const baseUrl = 'https://gateway.marvel.com/v1/public/' + searchListing;
		let url = '';

		if (searchListing === 'characters') {
			url =
				baseUrl +
				'?nameStartsWith=' +
				searchTerm +
				'&ts=' +
				ts +
				'&apikey=' +
				publickey +
				'&hash=' +
				hash +
				'&limit=20';
		} else {
			url =
				baseUrl +
				'?titleStartsWith=' +
				searchTerm +
				'&ts=' +
				ts +
				'&apikey=' +
				publickey +
				'&hash=' +
				hash +
				'&limit=20';
		}

		return url;
	};

	const linkTo = () => {
		if (searchListing === 'characters') {
			return 'characters';
		} else if (searchListing === 'comics') {
			return 'comics';
		} else {
			return 'series';
		}
	};

	const buildCard = (listing) => {
		let charImgUrl = '';

		if (listing.thumbnail.path && listing.thumbnail.extension) {
			charImgUrl =
				listing.thumbnail.path +
				'/standard_xlarge.' +
				listing.thumbnail.extension;
		}

		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={listing.id}>
				<Card className={classes.card} variant="outlined">
					<CardActionArea>
						<Link to={`/${linkTo()}/${listing.id}`}>
							<CardMedia
								className={classes.media}
								component="img"
								image={charImgUrl ? charImgUrl : noImage}
								title={listing.name + ' image'}
							/>
							<CardContent>
								<Typography
									className={classes.titleHead}
									gutterBottom
									variant="h6"
									component="h2"
								>
									{searchListing === 'characters'
										? listing.name
										: listing.title}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	const searchResultTerm = () => {
		if (searchData.results && searchData.results.length !== 0) {
			return (
				<div className="searchResultTerm">
					<span>Showing results for: {searchTerm}</span>
				</div>
			);
		}
	};

	const backToBtn = () => {
		if (searchListing === 'characters') {
			return (
				<Link className="backBtn" to="/characters/page/0">
					Back to characters list
				</Link>
			);
		} else if (searchListing === 'comics') {
			return (
				<Link className="backBtn" to="/comics/page/0">
					Back to comics list
				</Link>
			);
		} else if (searchListing === 'series') {
			return (
				<Link className="backBtn" to="/series/page/0">
					Back to series list
				</Link>
			);
		}
	};

	if (searchTerm) {
		card =
			searchData.results &&
			searchData.results.map((listing) => {
				return buildCard(listing);
			});
	}

	if (loading) {
		return (
			<div>
				<CircularProgress />
				<h1>Searching marvel universe for you...</h1>
			</div>
		);
	} else if (searchData.results && searchData.results.length === 0) {
		return (
			<div>
				<h1>Error 404: No results found for this search!</h1>
				<div className="alignCenter">
					<Link to="/" className="backBtn">
						Home
					</Link>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				{backToBtn()}
				{searchResultTerm()}
				<Grid container className={classes.grid} spacing={3}>
					{card}
				</Grid>
			</div>
		);
	}
};

export default SearchResult;
