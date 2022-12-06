import { useCallback, useEffect } from "react";
import { getCovid } from "../fetcher";
import { useState } from "react";

// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';

const CovidPage = () => {

	const [covidData, setCovidData] = useState();
	const [county, setCounty] = useState('Alameda');
	const [queryType, setQueryType] = useState('cases');


	useEffect(() => {
        getCovid('Alameda', 'cases').then(res => {
            setCovidData(res.results)
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


	return (
		<>
			<form>
				<div>
				<select value={county} onChange={onChangeCounty}>
					<option value="Alameda">Alameda</option>
					<option value="Amador">Amador</option>
				</select>
			</div>
			<div>
				<select value={queryType} onChange={onChangeQueryType}>
					<option value="cases">Cases</option>
                    <option value="correlation">Correlation</option>
				</select>
			</div>
			</form>
			<div>
				{<p>{covidData && covidData[0].cases_per_100k ? covidData[0].cases_per_100k : null}</p>}
				{<p>{covidData && covidData[0].Correlation ? covidData[0].Correlation : null}</p>}
				{county && <p>{county}</p>}
			</div>
			
		</>
		
    )
}

export default CovidPage;