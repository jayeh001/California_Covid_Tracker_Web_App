import { useEffect } from "react";
import { getCorrelations,getCounties } from "../fetcher";
import { useState } from "react";
// import { FormControl } from '@mui/material';
// import { InputLabel } from '@mui/material';
// import { Select } from '@mui/material';
// import { MenuItem } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, Grid, CardHeader } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';

//import { getCovid } from "../fetcher";

const CovidCorrelations = () => {

    const [corrData, setCorrData] = useState()
	const [county, setCounty] = useState('Alameda');
	const [counties, setCounties] = useState();
    const [category, setCategory] = useState('overcrowding')
    // const [type,setType] = useState('rate')
	const [overCorr,setOvercrowdCorr] = useState()
	const [povCorr,setPovCorr] = useState()
	
	
    useEffect(() => {
        // TODO: replace this with getCorrelations
        getCorrelations("overcrowding", "rates", "Alameda").then(res => {
            setCorrData(res.results)
			
        })
        getCorrelations("overcrowding", "correlation", "Alameda").then(res => {
            setOvercrowdCorr(res.results)
		})
        getCorrelations("poverty", "correlation", "Alameda").then(res => {
            setPovCorr(res.results)
		})
		getCounties().then(res => {
			setCounties(res.results)
		})
    }, [])
 
	function onChangeCounty(event) {
		console.log('the value is: ' + event.target.value)
		setCounty(event.target.value)
		// console.log('county changed to: ' + county)
        getCorrelations(category,'rates',event.target.value).then(res => {
            setCorrData(res.results)
        })
	}
	function onChangeCategory(event) {
		setCategory(event.target.value)
		getCorrelations(event.target.value,'rates',county).then(res => {
            setCorrData(res.results)
        })
	}
	console.log('corrdata',corrData)
    return (
        <div>
		<p></p>
	
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
			<InputLabel id="demo-simple-select-label">Category</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={category}
				label="County"
				onChange={onChangeCategory}>				
				<MenuItem value={'overcrowding'}>Overcrowding</MenuItem>
				<MenuItem value={'poverty'}>Poverty</MenuItem>			
			</Select>
		</FormControl>
	
        <p></p>
		{  
	
				<Grid container space={2}>
					<Grid item xs={3}>
					<Box sx={{ minWidth: 150, maxWidth: 300 }}>
						<CardMedia
								height="300"
								component="img"
								image="/overpopulation.png"
								alt="overpopulation symbol"/>
						<Card variant="outlined">
							<CardContent>
								<Typography variant="h5" color="text.primary" gutterBottom>
									Overcrowding Correlation
								</Typography>			
								<Typography variant="h5" component="div">
									{overCorr? overCorr[0].Correlation: null}
								</Typography>
							</CardContent>
						</Card>
					</Box>
					</Grid>
					
					<Grid item xs={1}></Grid>
					<Grid item xs={3}>
					<Box sx={{ minWidth: 150, maxWidth: 300 }}>
						<CardMedia
							height="300"
							component="img"
							image="/poverty.png"
							alt="poverty symbol"/>
						<Card variant="outlined">
							<CardContent>
								<Typography variant="h5" color="text.primary" gutterBottom>
									Poverty Correlation
								</Typography>			
								<Typography variant="h5" component="div">
									{povCorr? povCorr[0].Correlation: null}
								</Typography>
							</CardContent>
						</Card>
					</Box>
					</Grid>

					<Grid item xs={1}></Grid>
					<Grid item xs={3}>
						<Box sx={{ minWidth: 150, maxWidth: 300 }}>
							<CardMedia
								height="300"
								component="img"
								image="/ratio.svg"
								alt="ratio symbol"/>
							<Card variant="outlined">
								<CardContent>	
									<Typography variant="h5" component="div" gutterBottom>
										Ratio of Category Score to Cases
									</Typography>		
									<Typography variant="h5" component="div">
										{corrData? corrData[0].cases_rate : null}
									</Typography>
								</CardContent>
							</Card>
						</Box>
					</Grid>
				</Grid>
	
		 }
        
		<p></p>
		<Box sx={{ minWidth: 1200, maxWidth: 1700 }}>		
			<Grid container>
					
			</Grid>
		</Box>

        </div>
    )
}

export default CovidCorrelations;