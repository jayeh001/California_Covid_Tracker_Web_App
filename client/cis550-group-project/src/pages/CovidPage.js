import * as React from 'react';
import { useCallback, useEffect } from "react";
import { useState } from "react";

import { getCovid, getCounties } from "../fetcher";

import { FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const styles = {
	back: {
		backgroundImage: "url(https://foundrybc.ca/wp-content/uploads/2020/08/Foundry-COVID-19-Symbol-300x300.png)"
	}
}
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
//<FlipNumbers play height={40} width={40} color="black" background="white" duration={(covidData && covidData[0].cases_per_100k ? covidData[0].cases_per_100k.toFixed(0) : 0)/70} numbers={covidData && covidData[0].cases_per_100k ? covidData[0].cases_per_100k.toFixed(0) : 0}/>
/*
<Box sx={{ minWidth: 150, maxWidth: 600, maxHeight: 600 }}>
						<CardMedia
							component="img"
							image="/pop_density.jpg"
							alt="population density"/>
						</Box>*/	
return (
		<div>
		<FormControl fullWidth>
			<InputLabel id="demo-simple-select-label">County</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={county}
				label="County"
				onChange={onChangeCounty}
				MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}>
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
		<Box sx={{ flexGrow: 2}}>
			<Grid container space={5}>
				<Grid item xs={4}>
					<p></p>
					<Box sx={{ minWidth: 400, maxWidth: 600 }}>
						<Card variant="outlined">{
							<React.Fragment>
							<CardContent>
								<Typography variant="h5" component="div">
									{covidData && covidData[0].name ? covidData[0].name : 0} County
								</Typography>
								<Typography variant="p" component="div" color="#555">
									Population: {covidData && covidData[0].population ? covidData[0].population : 0}
								</Typography>
								<Typography variant = "p" component="div" color="#fff">
									s
								</Typography>
								<Typography variant = "h5" component="div">
									Description: 
								</Typography>
								<Typography variant="p" component="div" color="#222">
									{covidData && covidData[0].description ? covidData[0].description : 0}
								</Typography>
								<br/>
								<Typography variant="p" component="div" color="#555">
									Source: Wikipedia
								</Typography>
							</CardContent>
							</React.Fragment>
						}</Card>
					</Box>
				</Grid>

				<Grid item xs={2}>
					<p></p>{ queryType == 'cases' ? 
					<Box sx={{ minWidth: 150, maxWidth: 300 }}>
						<CardMedia
							height="300"
							component="img"
							image="/covid.png"
							alt="covid symbol"/>
						<Card variant="outlined">{
						<React.Fragment>
							<CardContent>
								<Typography variant="h5" color="text.primary" gutterBottom>
									Cases Per 100k
								</Typography>			
								<Typography variant="h5" component="div">
									{covidData && covidData[0].cases_per_100k ? covidData[0].cases_per_100k.toFixed(2) : 0}
								</Typography>
								<Typography variant="p" component="div" color="#555"><br/>
									Date: {covidData && covidData[0].casesDate ? covidData[0].casesDate : 0}
								</Typography>
							</CardContent>
						</React.Fragment>
						}</Card>
					</Box> :  null }

					{ queryType == 'correlation' ? 
					<Box sx={{ minWidth: 150, maxWidth: 300 }}>
						<CardMedia
							height="300"
							component="img"
							image="/covid.png"
							alt="covid symbol"/>
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
				</Grid>

				<Grid item xs={2}>	
					<p></p>{ queryType == 'cases' ?
					<Box sx={{ minWidth: 150, maxWidth: 300 }}>
					<CardMedia
						height="300"
						component="img"
						image="/vaccine.png"
						alt="vaccine symbol"/>
					<Card variant="outlined">{
					<React.Fragment>
						<CardContent>
							<Typography variant="h5" color="text.primary" gutterBottom>
								Vaccinations Per 100k
							</Typography>
							<Typography variant="h5" component="div">
								{covidData && covidData[0].vaccinated_per_100k ? covidData[0].vaccinated_per_100k.toFixed(2) : 0}
							</Typography>
							<Typography variant="p" component="div" color="#555"><br/>
								Date: {covidData && covidData[0].vaccDate ? covidData[0].vaccDate : 0}
							</Typography>
						</CardContent>
					</React.Fragment>
					}</Card>
					</Box> : null }
				</Grid>

				<Grid item xs={2}>
					<p></p>{ queryType == 'cases' ? 
					<Box sx={{ minWidth: 150, maxWidth: 300 }}>
					<CardMedia
						height="300"
						component="img"
						image="/coffin.png"
						alt="coffin symbol"/>
					<Card variant="outlined">{<React.Fragment>
						<CardContent>
							<Typography variant="h5" color="text.primary" gutterBottom>
								Deaths Per 100k
							</Typography>
							<Typography variant="h5" component="div">
								{covidData && covidData[0].deaths_per_100k ? covidData[0].deaths_per_100k.toFixed(2) : 0}
							</Typography>
							<Typography variant="p" component="div" color="#555"><br/>
								Date: {covidData && covidData[0].deathsDate ? covidData[0].deathsDate : 0}
							</Typography>
						</CardContent>
					</React.Fragment>
					}</Card>
					</Box> : null }
				</Grid>
			</Grid>
		</Box>
		</div>

    )
}

export default CovidPage;