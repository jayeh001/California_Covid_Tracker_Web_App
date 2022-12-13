import { useEffect } from "react";
import { getCorrelations,getCounties } from "../fetcher";
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

//import { getCovid } from "../fetcher";

const CovidCorrelations = () => {

    const [corrData, setCorrData] = useState()
	const [county, setCounty] = useState('Alameda');
	const [counties, setCounties] = useState();
    const [category, setCategory] = useState('overcrowding')
    const [type,setType] = useState('rate')

    const overcrowdingCorr = getCorrelations("overcrowding","correlation","Alameda")
    console.log('printing overcrowdingCorr')
    console.log(overcrowdingCorr)
	   
    useEffect(() => {
        // TODO: replace this with getCorrelations
        getCorrelations("overcrowding", "rates", "Alameda").then(res => {
            setCorrData(res.results)
        })
		getCounties().then(res => {
			setCounties(res.results)
		})
    }, [])
 
	function onChangeCounty(event) {
		console.log('the value is: ' + event.target.value)
		setCounty(event.target.value)
		console.log('county changed to: ' + county)
        getCorrelations(category,type,event.target.vale).then(res => {
            setCorrData(res.results)
        })
		
	}


    console.log(corrData)


    return (
        <div>

        <p></p>{  
			<Box sx={{ minWidth: 150, maxWidth: 400 }}>
			<Card variant="outlined">{
			<React.Fragment>
				<CardContent>
					<Typography variant="h5" color="text.primary" gutterBottom>
                        Overcrowding Correlation
					</Typography>
					<Typography variant="h5" component="div">
                        
					</Typography>
				</CardContent>
			</React.Fragment>
			}</Card>
			</Box>
		 }
         {  
			<Box sx={{ minWidth: 150, maxWidth: 400 }}>
			<Card variant="outlined">{
			<React.Fragment>
				<CardContent>
					<Typography variant="h5" color="text.primary" gutterBottom>
                        Overcrowding Correlation
					</Typography>
					<Typography variant="h5" component="div">
					</Typography>
				</CardContent>
			</React.Fragment>
			}</Card>
			</Box>
		 }
            <h1>Covid Correlation Page</h1>
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
        </div>
    )
}

export default CovidCorrelations;