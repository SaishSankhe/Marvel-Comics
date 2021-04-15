import './App.css';
import CharactersList from './components/CharactersList';
import ComicsList from './components/ComicsList';
import SeriesList from './components/SeriesList';
import Characters from './components/Characters';
import Comics from './components/Comics';
import Series from './components/Series';
import Home from './components/Home';
import Error from './components/Error';
import SearchResult from './components/SearchResult';
import logo from './img/marvelLogo2.png';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function App() {
	return (
		<Router>
			<div className="App">
				<header className="App-header">
					<div className="headerContent">
						<div className="skewBox"></div>
						<img src={logo} className="App-logo" alt="logo" />
						<h1 className="App-title">
							Welcome to Marvel API with React.js project
						</h1>
						<div className="header-links">
							<Link className="showlink" to="/">
								Home
							</Link>
							<Link className="showlink" to="/characters/page/0">
								Characters
							</Link>
							<Link className="showlink" to="/comics/page/0">
								Comics
							</Link>
							<Link className="showlink" to="/series/page/0">
								Series
							</Link>
							<a
								href="https://github.com/SaishSankhe/MarvelAPI"
								className="showlink git-btn"
								target="blank"
							>
								GitHub
							</a>
						</div>
					</div>
				</header>
				<div className="App-body">
					<Route exact path="/" component={Home} />
					<Route
						exact
						path="/characters/page/:page"
						component={CharactersList}
					/>
					<Route exact path="/characters/:id" component={Characters} />
					<Route exact path="/comics/page/:page" component={ComicsList} />
					<Route exact path="/comics/:id" component={Comics} />
					<Route exact path="/series/page/:page" component={SeriesList} />
					<Route exact path="/series/:id" component={Series} />
					<Route exact path="/error/:errorMsg" component={Error} />
					<Route
						exact
						path="/search/:listing/:query"
						component={SearchResult}
					/>
				</div>
			</div>
		</Router>
	);
}

export default App;
