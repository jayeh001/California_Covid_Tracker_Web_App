import { useCallback, useEffect } from "react";
import { getCovid, getCounties } from "../fetcher";
import { useState } from "react";
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';


// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';

const CovidPage = () => {

	const [covidData, setCovidData] = useState();
	const [county, setCounty] = useState('Alameda');
	const [queryType, setQueryType] = useState('cases');
	const [counties, setCounties] = useState();


	useEffect(() => {
        getCovid('Alameda', 'cases').then(res => {
            setCovidData(res.results)
        })
		getCounties().then(res => {
			setCounties(res.results)
		})
    }, [])


	function onChangeCounty(event) {
		console.log('the value is: ' + event.target.value)
		setCounty(event.target.value)
		console.log('county changed to: ' + county)
		getCovid(event.target.value, queryType).then(res => {
            setCovidData(res.results)
		})
	}
	
	function onChangeQueryType(event) {
		console.log(event.target.value)
		setQueryType(event.target.value)
		console.log(queryType)
       getCovid(county, event.target.value).then(res => {
            setCovidData(res.results)
        })
        console.log('changing')
    }

	// Don't worry about this reloading twice. It has no effect on the rendering, which
	// is what actually counts. Specifically, the JSX in the return block below.
    console.log(covidData)
{/* <MenuItem value={"Alameda"}>Alameda</MenuItem>
				<MenuItem value={"Amador"}>Amador</MenuItem>
				<MenuItem value={"Butte"}>Butte</MenuItem> {counties.map(cname, cname =>
					<MenuItem value={"name.county_name"}>name.county_name</MenuItem>
					)}{var map = new Map(counties.map((obj) => [obj.county_name, obj.county_name])));
					<MenuItem value={"name.county_name"}>name.county_name</MenuItem>
					}*/}

	return (
		<div>
		<FormControl fullWidth>
			<InputLabel id="demo-simple-select-label">County</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={county}
				label="County"
				onChange={onChangeCounty}>
				{
					counties?.map(({county_name, index}) => (
						<MenuItem key={index} value={county_name}>{county_name}</MenuItem>
					))
				}
			</Select>

		</FormControl>
		<p></p>
		<FormControl fullWidth>
			<InputLabel id="demo-simple-select-label">Type</InputLabel>
			<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={queryType}
					label="queryType"
					onChange={onChangeQueryType}
				>
					<MenuItem value={"cases"}>Cases</MenuItem>
					<MenuItem value={"correlation"}>Correlation</MenuItem>
				</Select>
		</FormControl>

		<p></p>{ queryType == 'cases' ? 
			<Box sx={{ minWidth: 150, maxWidth: 300 }}>
			<Card variant="outlined">{
			<React.Fragment>
				<CardContent>
					<Typography variant="h5" color="text.primary" gutterBottom>
						Cases Per 100k
					</Typography>
					<Typography variant="h5" component="div">
						{covidData && covidData[0].cases_per_100k ? covidData[0].cases_per_100k.toFixed(2) : 0}
					</Typography>
				</CardContent>
			</React.Fragment>
			}</Card>
			</Box>
		:  null }

		<p></p>{ queryType == 'cases' ?
			<Box sx={{ minWidth: 150, maxWidth: 300 }}>
			<Card variant="outlined">{
			<React.Fragment>
				<CardContent>
					<Typography variant="h5" color="text.primary" gutterBottom>
						Vaccinations Per 100k
					</Typography>
					<Typography variant="h5" component="div">
						{covidData && covidData[0].vaccinated_per_100k ? covidData[0].vaccinated_per_100k.toFixed(2) : 0}
					</Typography>
				</CardContent>
			</React.Fragment>
			}</Card>
			</Box> : null }

		<p></p>{ queryType == 'cases' ? 
			<Box sx={{ minWidth: 150, maxWidth: 300 }}>
			<Card variant="outlined">{<React.Fragment>
				<CardContent>
					<Typography variant="h5" color="text.primary" gutterBottom>
						Deaths Per 100k
					</Typography>
					<Typography variant="h5" component="div">
						{covidData && covidData[0].deaths_per_100k ? covidData[0].deaths_per_100k.toFixed(2) : 0}
					</Typography>
				</CardContent>
			</React.Fragment>
			}</Card>
			</Box> : null }

		<p></p>{ queryType == 'correlation' ? 
		<Box sx={{ minWidth: 150, maxWidth: 300 }}>
		<Card variant="outlined">{
			<React.Fragment>
			<CardContent>
				<Typography variant="h5" color="text.primary" gutterBottom>
					Correlation of Cases and Deaths
				</Typography>
				<Typography variant="h5" component="div">
					{covidData && covidData[0].Correlation ? covidData[0].Correlation.toFixed(4) : 0}
				</Typography>
			</CardContent>
			</React.Fragment>
		}</Card>
    	</Box> : null}
		</div>

		
		
    )
}

export default CovidPage;