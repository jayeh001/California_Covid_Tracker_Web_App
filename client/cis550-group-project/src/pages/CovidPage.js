import { useCallback, useEffect } from "react";
import { getCovid } from "../fetcher";
import { useState } from "react";

// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';

const CovidPage = () => {

	const [covidData, setCovidData] = useState();
	const [county, setCounty] = useState();
	const [queryType, setQueryType] = useState();


    useEffect(() => {
        getCovid('Alameda', 'cases').then(res => {
            setCovidData(res.results)
        })
    }, [])


	function onChangeCounty(event) {
		event.preventDefault();
		console.log(event.target.value)
		
        // var countyName = event.target.value
        // console.log(event.target.value);
       /* getCovid(countyName, 'cases').then(res => {
            setCovidData(res.results)
        })
        console.log('changing')*/
	}
	
	function onChangeQueryType(event) {
		event.preventDefault();
		console.log(event.target.value)
		
        // var countyName = event.target.value
        // console.log(event.target.value);
       /* getCovid(countyName, 'cases').then(res => {
            setCovidData(res.results)
        })
        console.log('changing')*/
    }

    console.log(covidData)


	return (
		<>
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

		</>
		
        // <div>
        //     <h1>Covid Page</h1>
        //     <form action='/covid'>
        //         <label for="county"><b>County:</b> &nbsp;</label>
        //         <select name="county" id="county" onchange={onChangeCounty}>
        //             <option value="Alameda">Alameda</option>
        //             <option value="Amador">Amador</option>
        //         </select>
        //     </form>
        //     <form action='/covid'>
        //         <label for="type"><b>Type:&nbsp;&nbsp;&nbsp;&nbsp;</b> &nbsp;</label>
        //         <select name="type" id="type">
        //             <option value="cases">Cases</option>
        //             <option value="correlation">Correlation</option>
        //         </select>
		// 	</form>
        // </div>
    )
}

export default CovidPage;