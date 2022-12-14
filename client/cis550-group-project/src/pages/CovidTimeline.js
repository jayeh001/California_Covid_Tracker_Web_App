import { useEffect, useState, Component } from "react";
import { getCounties, getTimeline, getTimelineCorr} from "../fetcher";
import { FormControl, FormGroup, Container, Form, colors} from '@mui/material';
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
import { Line, CartesianGrid, LineChart, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import '../mystyle.module.css';
import styles from '../mystyle.module.css';

// import { Form } from "shards-react";

import {
    Row,
    Col,
    Slider

} from 'antd'
import 'antd/dist/antd.css';
import { fontSize } from "@mui/system";

var moment = require('moment')

const CovidTimeline = () => {

  
   

    

    const [timelineData, setTimelineData] = useState();
    const [county, setCounty] = useState('Alameda');
    const [queryType, setQueryType] = useState('cases');
    const [counties, setCounties] = useState();
    const [start, setStart] = useState('2020-02-01');
    const [end, setEnd] = useState('2022-11-29');
    const [fixedTimelineCorrData, setFixedTimelineCorrData] = useState();
    const [fixedTimeAllData, setFixedTimeAllData] = useState();
    const [fixedTimeAllDataPerDate, setFixedTimeAllDataPerDate] = useState();
    const [isLoading, setLoading] = useState(true);
    const [isLoading_2, setLoading_2] = useState(true);
    const [isLoading_3, setLoading_3] = useState(true);

    var minDate = '2020-02-01';
    var maxDate = '2022-11-29';
    var startDateLabel = minDate;
    var endDateLabel = maxDate;
    var minRange = 0;
    var maxRange = 100;
    var currentValue = [];

    
   
    
    

    calculateDateRange(minDate, maxDate)

    useEffect(() => {
        console.log("here")
        getTimeline('Alameda', 'cases', '2020-02-01', '2022-12-05').then(res => {
            setTimelineData(res.results)
        })
        getCounties().then(res => {
            setCounties(res.results)
        })

        getTimelineCorr('Alameda', "Overall").then(res => {
            setFixedTimelineCorrData(res.results)
            console.log(res.results)
            setLoading(false);
        })
        getTimelineCorr('Alameda', "All").then(res => {
            setFixedTimeAllData(res.results)
            setLoading_2(false);
        })

        getTimelineCorr('Alameda', "Overall_by_date").then(res => {
            setFixedTimeAllDataPerDate(res.results)
            console.log(res.results)
            setLoading_3(false);
        })
        
    }, [])


    if (isLoading | isLoading_2 | isLoading_3) {
        return <div className="App">Loading...</div>;
    }


    function onChangeDate(event) {
        currentValue = [event[0], event[1]]
        updateDates()
        getTimeline(county, queryType, startDateLabel, endDateLabel).then(res => {
            setTimelineData(res.results)
        })
    }


    function updateDates() {
        let [min, max] = currentValue
        let start = moment(minDate, "YYYY-MM-DD").add(min, 'd')
        let end = moment(maxDate, "YYYY-MM-DD").subtract(maxRange - max, 'd')

        startDateLabel = formatDate(start)
        endDateLabel =  formatDate(end)
        setStart(startDateLabel)
        setEnd(endDateLabel)
      
    }
   
    function calculateDateRange(startDateStr, endDateStr) {
        let startDate = moment(startDateStr, "YYYY-MM-DD")
        let endDate = moment(endDateStr, "YYYY-MM-DD")
        maxRange = Math.abs(endDate.diff(startDate, 'days'))
        currentValue = [0, Math.abs(endDate.diff(startDate, 'days'))]
    }


    function tipFormatter(value) {
        let [min, max] = currentValue
        if (min === value) {
            return (<div className="p-1 text-center">
                {startDateLabel}
            </div>)
        }
        else if (max === value) {
            return (<div>
                {endDateLabel}
            </div>)
        }
    }


    function formatDate(date) {
        // console.log("date: " + date)
        let day, month, year = 0;
        day = date.get('date')
        month = date.get('month')
        year = date.get('year')
        if (month < 10){
            return year + '-0' + month + '-' + day
        }
        return year + '-' + month + '-' + day
    }


    function onChangeCounty(event) {
        setCounty(event.target.value)
        getTimeline(event.target.value, queryType, minDate, maxDate).then(res => {
            setTimelineData(res.results)
        })
    }

    function onChangeQueryType(event) {
        setQueryType(event.target.value)
        getTimeline(county, event.target.value, minDate, maxDate).then(res => {
            setTimelineData(res.results)
        })
    }

  
    // console.log((fixedTimelineCorrData[0].cases_daily).toFixed(2))
  
    return (
        <div className={styles.divstyle}>

            <Container fluid={true} className={styles.container}>
                <h3 className={styles.text_2}>On this page you'll find:</h3>
                <ul className={styles.ulstyle}>
                    <li onClick={() => window.location.replace("/covid-timeline/#latest-updates")} className={styles.listyle}>
                        <span className={styles.spanstyle}>Latest Updates</span>
                    </li>

                    <li onClick={() => window.location.replace("/covid-timeline/#timeline-county-wide")} className={styles.listyle}>
                        <span className={styles.spanstyle}>County Data</span>
                    </li>

                    <li onClick={() => window.location.replace("/covid-timeline/#percountyview")} className={styles.listyle}>
                        <span className={styles.spanstyle}>Cases, Vaccinated and Deaths per County</span>
                    </li>

                </ul>
            </Container>


            <Container fluid={true} className={styles.container_2} id="latest-updates">
                <h2 className={styles.text_2}>Update For November 29, 2022</h2>
                <Row className={styles.row}>
                    <Box className={styles.box}>
                        <ul>
                            <li className={styles.boxtext}>Number of Vaccinated</li>
                            <li className={styles.boxtext}>{fixedTimelineCorrData[0].num_vaccinated} total</li>
                            <li className={styles.boxtext}>{(fixedTimelineCorrData[0].vaccinated_daily).toFixed(2)} daily avg.</li>
                            <li className={styles.boxtext_2}>{(fixedTimelineCorrData[0].vaccinated_percent).toFixed(2)}% of population Vaccinated</li>
                        </ul>

                        <div className={styles.chart}>
                            <BarChart
                                width={300}
                                height={130}
                                data={fixedTimeAllDataPerDate}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5
                                }}
                            >
                                <XAxis dataKey="date" tick={false} stroke="#ffffff"/>
                                <YAxis tick={false} stroke="#ffffff" />
                                <Bar dataKey="num_vaccinated" fill="#050339" />
                            </BarChart>

                        </div>
                    </Box>

                    <Box className={styles.box}>
                        <ul>
                            <li className={styles.boxtext}>Number of Cases</li>
                            <li className={styles.boxtext}>{fixedTimelineCorrData[0].num_cases} total</li>
                            <li className={styles.boxtext}>{(fixedTimelineCorrData[0].cases_daily).toFixed(2)} daily avg.</li>
                            <li className={styles.boxtext_2}>{(fixedTimelineCorrData[0].cases_percent).toFixed(2)}% of New Cases</li>
                        </ul>

                        <div className={styles.chart}>
                            <BarChart
                                width={300}
                                height={130}
                                data={fixedTimeAllDataPerDate}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5
                                }}
                            >
                                <XAxis dataKey="date" tick={false} stroke="#ffffff" />
                                <YAxis tick={false} stroke="#ffffff" />
                                <Bar dataKey="num_cases" fill="#050339" />
                            </BarChart>

                        </div>
                    </Box>

                    <Box className={styles.box}>
                        <ul>
                            <li className={styles.boxtext}>Number of Deaths</li>
                            <li className={styles.boxtext}>{fixedTimelineCorrData[0].num_deaths} total</li>
                            <li className={styles.boxtext}>{(fixedTimelineCorrData[0].deaths_daily).toFixed(2)} daily avg.</li>
                            <li className={styles.boxtext_2}>{(fixedTimelineCorrData[0].death_percent).toFixed(2)}% of Deaths</li>
                        </ul>
                        
                        <div className={styles.chart}>
                            <BarChart
                                width={300}
                                height={130}
                                data={fixedTimeAllDataPerDate}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5
                                }}
                            >
                                <XAxis dataKey="date" tick={false} stroke="#ffffff" />
                                <YAxis tick={false} stroke="#ffffff" domain={["dataMin", "dataMax + 10"]}/>
                                <Bar dataKey="num_deaths" fill="#050339" />
                            </BarChart>

                        </div>
                    </Box>
                </Row>
            </Container>

            <Row className={styles.row}>
                <FormControl style={{ width: '40vw', marginRight: '5mm', marginTop: '5vh' }}>
                    <InputLabel id="demo-simple-select-label">County</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={county}
                        label="County"
                        onChange={onChangeCounty}>
                        {
                            counties?.map(({ county_name, index }) => (
                                <MenuItem key={index} value={county_name}>{county_name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl style={{ width: '40vw', marginLeft: '5mm', marginTop: '5vh' }}>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={queryType}
                        label="queryType"
                        onChange={onChangeQueryType}
                    >
                        <MenuItem value={"cases"}>Cases</MenuItem>
                        <MenuItem value={"deaths"}>Deaths</MenuItem>
                        <MenuItem value={"vaccinated"}>Vaccinated</MenuItem>
                    </Select>
                </FormControl>
            </Row>
            <p></p>

         

            <Container fluid={true} id="timeline-county-wide" className={styles.slidebar}>
                <Row className={styles.slidebarrow}>
                    <Col xs={3} sm={3} md={3}></Col>
                    <Col xs={5} sm={5} md={8} >
                        <div className={styles.slidebarrow}>
                            Please Choose The Date Range
                        </div>  
                    </Col>
                    <Col xs={3} sm={3} md={3} style={{ marginLeft: "15mm" }}></Col>
                </Row>
                <Row className={styles.slidebarrow}>
                    <Col xs={3} sm={3} md={3}>
                        <span>
                            {start}
                        </span>
                    </Col>
                    <Col  xs={5} sm={5} md={8}>
                        <div >
                            <Slider
                                range
                                min={minRange}
                                max={maxRange}
                                defaultValue={[minRange, maxRange]}
                                tipFormatter={tipFormatter}
                                onChange={onChangeDate}
                            />
                        </div>
                    </Col>
                    <Col xs={3} sm={3} md={3} style={{marginLeft:"15mm"}}>
                        <span>
                            {end}
                        </span>
                    </Col>
                </Row>
            </Container>

            <div  className={styles.container}>
                {queryType === "cases" ?
                    <LineChart width={900} height={500} data={timelineData}>
                        <Line type="monotone"
                            dataKey="cases"
                            stroke="#2196F3"
                            strokeWidth={0.5}
                            dot={false} />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date"
                            height={70}
                            angle={-45}
                            textAnchor="end" />
                        <YAxis label={{ value: 'cases', angle: -90, position: 'insideLeft', fontSize: '1.5rem' }} />
                        <Tooltip />
                    </LineChart>
                    : null}
                {queryType === "vaccinated" ?
                    <LineChart width={900} height={500} data={timelineData}>
                        <Line type="monotone"
                            dataKey="vaccinated"
                            stroke="#2196F3"
                            strokeWidth={1}
                            dot={false} />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date"
                            height={70}
                            angle={-45}
                            textAnchor="end" />
                        <YAxis width={100} label={{ value: 'vaccinated', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                    </LineChart>
                    : null}

                {queryType === "deaths" ?
                    <LineChart width={900} height={500} data={timelineData}>
                        <Line type="monotone"
                            dataKey="cases"
                            stroke="#2196F3"
                            strokeWidth={0.5}
                            dot={false} />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date"
                            height={70}
                            angle={-45}
                            textAnchor="end" />
                        <YAxis width={100} label={{ value: 'deaths', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                    </LineChart>
                    : null}
            </div>

            <div className={styles.container} id="percountyview">
                <h2>Percentage of Vaccinated Cases From September 1, 2022 - November 29, 2022</h2>
                <BarChart
                    width={1200}
                    height={600}
                    data={fixedTimeAllData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="county_name" />
                    <YAxis label={{ value: 'Vccinated [%]', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="vaccinated_percent" fill="#087aaf" />
                </BarChart>

            </div>


            <div className={styles.container}>
                <h2>Number of Cases From September 1, 2022 - November 29, 2022</h2>
                <BarChart
                    width={1200}
                    height={600}
                    data={fixedTimeAllData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="county_name" />
                    <YAxis label={{ value: 'Number of Cases', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="num_cases" fill="#d00c0c" />
                </BarChart>

            </div>

            <div className={styles.container}>
                <h2>Number of Deaths From September 1, 2022 - November 29, 2022</h2>
                <BarChart
                    width={1200}
                    height={600}
                    data={fixedTimeAllData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="county_name"  />
                    <YAxis label={{ value: 'Number of Deaths', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="num_deaths" fill="#025d46" />
                </BarChart>

            </div>


        </div>
    )
    
        
}

export default CovidTimeline;