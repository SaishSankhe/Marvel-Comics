import React, { useState } from 'react';

const Search = (props) => {
	const [target, setTarget] = useState(null);
	const handleChange = (e) => {
		setTarget(e.target.value);
	};
	const handleClick = (e) => {
		props.searchValue(target);
	};
	return (
		<form
			method='POST'
			onSubmit={(e) => {
				e.preventDefault();
			}}
			name='formName'
			className='searchForm'
		>
			<label>
				<input autoComplete='off' className="searchBar" type='text' name='searchTerm' placeholder="Search here" onChange={handleChange} />
			</label>
			<label>
				<button type="submit" className="searchBtn" onClick={handleClick}>Search</button>
			</label>
		</form>
	);
};

export default Search;
