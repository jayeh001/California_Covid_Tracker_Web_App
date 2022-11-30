import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";

import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate 
} from 'antd'
import { RadarChart } from 'react-vis';
import { format } from 'd3-format';




import MenuBar from '../components/MenuBar';
import { getCovid } from '../fetcher'
const wideFormat = format('.3r');

/*const covidColumns = [
    {
        title: 'Vaccinated Per 100k',
        dataIndex: 'vaccinated_per_100k',
        key: 'vaccinated_per_100k',
    },
    {
        title: 'Cases Per 100k',
        dataIndex: 'cases_per_100k',
        key: 'cases_per_100k',
    },
    {
        title: 'Deaths Per 100k',
        dataIndex: 'deaths_per_100k',
        key: 'deaths_per_100k',
    }
];*/


class CovidPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fips:6001,
            type:'cases',
            casesQuery:0,
            vaccinatedQuery:0,
            deathsQuery:0,
            correlationByDate: [],
            deathsByDate: []	
        }

        this.handleCasesQueryChange = this.handleCasesQueryChange.bind(this)
        this.handleVaccinatedQueryChange = this.handleVaccinatedQueryChange.bind(this)
        this.handleDeathsQuery = this.handleDeathsQuery.bind(this)
        this.handleCorrelationByDateChange = this.handleCorrelationByDateChange.bind(this)
    }
    

    handleCasesQueryChange(event) {
        this.setState({ casesQuery: event.target.value })
    }

    handleVaccinatedQueryChange(event) {
        this.setState({ vaccinatedQuery: event.target.value })
    }

    handleDeathsQuery(value) {
        this.setState({ deathsQuery: value })
    }

    handleCorrelationByDateChange(value) {
        this.setState({ correlationByDate: value })
    }


    /*updateSearchResults() {
        getCovid(this.state.fips, this.state.type).then(res => {
            this.setState({ casesQuery: res.results.cases_per_100k })
            this.setState({ vaccinatedQuery: res.results.vaccinated_per_100k })
            this.setState({ deathsQuery: res.results.deaths_per_100k })
            this.setState({ correlationByDate: res.results })
        })

    }*/

    componentDidMount() {
        getCovid(this.state.fips, this.state.type).then(res => {
            this.setState({ casesQuery: res.results.cases_per_100k })
            this.setState({ vaccinatedQuery: res.results.vaccinated_per_100k })
            this.setState({ deathsQuery: res.results.deaths_per_100k })
            this.setState({ correlationByDate: res.results })
        })
    }

    render() {
        return (

            <div>

                <MenuBar />
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Cases Per 100k</label>
                            <FormInput placeholder="Cases Per 100k" value={this.state.casesQuery} onChange={this.handleCasesQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Vaccinations Per 100k</label>
                            <FormInput placeholder="Vaccinations Per 100k" value={this.state.vaccinatedQuery} onChange={this.handleVaccinatedQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Deaths Per 100k</label>
                            <FormInput placeholder="Deaths Per 100k" value={this.state.deathsQuery} onChange={this.handleDeathsQueryChange} />
                        </FormGroup></Col>
                    </Row>


                </Form>
                <Divider />
                {/* TASK 24: Copy in the players table from the Home page, but use the following style tag: style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} - this should be one line of code! */}
            
            </div>
        )
    }
}

export default CovidPage

