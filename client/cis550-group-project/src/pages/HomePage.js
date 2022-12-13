import { useEffect } from "react";
import { getCovid } from "../fetcher";
import { useState } from "react";
import * as React from 'react';

import { FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const HomePage = () => {

    const [covidData, setCovidData] = useState()


    useEffect(() => {
        getCovid("Alameda", "cases").then(res => {
            setCovidData(res.results)
        })
    }, [])


    // console.log(covidData)


    return (
        <div>
            <h1>Home Page</h1>
            <Box sx={{ flexGrow: 2}}>
			<Grid container space={5}>
				<Grid item xs={4}>
					<p></p>
					<Box sx={{ minWidth: 400, maxWidth: 600 }}>
						<Card variant="outlined">{
							<React.Fragment>
							<CardContent>
                                <Typography variant="h4" component="div" color="#000">
								California
								</Typography>
								<Typography variant="p" component="div" color="#555">
								Population: 39,185,605
								</Typography><br/>
								<Typography variant="p" component="div" color="#222">
                                Ten of the first twenty confirmed COVID-19 cases in the United States occurred in California, 
                                the first of which was confirmed on January 26, 2020. All of the early confirmed cases 
                                were persons who had recently travelled to China, as testing was restricted to this group. 
								</Typography>
                                <br/>
                                <Typography variant="p" component="div" color="#222">
                                On January 29, 2020, as disease containment protocols were still being developed, the U.S. 
                                Department of State evacuated 195 persons from Wuhan, China aboard a chartered flight to 
                                March Air Reserve Base in Riverside County, and in the process may have contributed to spread 
                                within the state and the US at large. On February 5, 2020, the U.S. evacuated 345 more 
                                citizens from Hubei Province to two military bases in California, Travis Air Force Base in Solano 
                                County and Marine Corps Air Station Miramar, San Diego, where they were quarantined for 14 days.
                                A state of emergency was declared in the state on March 4, 2020. A mandatory statewide stay-at-home 
                                order was issued on March 19, 2020, that was ended on January 25, 2021. On April 6, 2021, 
                                the state announced plans to fully reopen the economy by June 15, 2021.
                                </Typography>
								<br/>
                                <Typography variant="p" component="div" color="#222">
								As of June 16, 2022, the California Department of Public Health (CDPH) has reported 9,199,942 
                                confirmed cumulative cases and 91,240 deaths in the state, the highest number of confirmed 
                                cases in the United States, and the 41st-highest number of confirmed cases per capita. It has 
                                the highest count of deaths related to the virus, and the 35th-highest count of deaths per 
                                capita. As of June 15, 2021, California administered 40,669,793 COVID-19 vaccine doses, 
                                the largest number of doses nationwide, and currently 11th of 50 states in terms of per capita 
                                dose administration.The slow initial rollout of vaccinations, along with the timing and scope 
                                of state COVID-19 restrictions, triggered a wide-scale effort to recall Governor Gavin Newsom in 2021.
								</Typography>
                                <br/>
                                <Typography variant="p" component="div" color="#222">
								California is the origin of the Epsilon variant of SARS-CoV-2, which by March 2021, 
                                accounted for 35% of all confirmed cases of COVID-19 in the state.
								</Typography>
                                <br /><br />
								<Typography variant="p" component="div" color="#555">
									Source: Wikipedia
								</Typography>
							</CardContent>
							</React.Fragment>
						}</Card>
					</Box>
				</Grid>


				<Grid item xs={3}>	
					<p></p>
					<Box sx={{ minWidth: 150, maxWidth: 435 }}>
                        <Typography variant="h6" component="div" color="#222">
							<u><b>Current Map of Relative Infection Rates</b></u>
						</Typography>
                        <Card variant="outlined">
                            {
                        <React.Fragment>
                        </React.Fragment>
                        }
                        <CardMedia
                            component="img"
                            image="/cases.png"
                            alt="cases map"/>
                        </Card>
					</Box>
				</Grid>

				<Grid item xs={3}>	
					<p></p>
					<Box sx={{ minWidth: 150, maxWidth: 800 }}>
                        <Typography variant="h6" component="div" color="#222">
							<u><b>Current Population Density</b></u>
						</Typography>
                        <Card>
                        {
                        <React.Fragment>
                
                        </React.Fragment>
                        }
                        <CardMedia
                            height="775"
                            component="img"
                            image="/pop_density.jpg"
                            alt="population density map"/>  
                        </Card>
					</Box>
				</Grid>
                <Grid item xs={2}></Grid>
			</Grid>
		    </Box>
        </div>
        
    )
}

export default HomePage;