import { useEffect } from "react";
import { getCorrelations } from "../fetcher";
import { useState } from "react";
import { getCovid } from "../fetcher";

const CovidCorrelations = () => {

    const [covidData, setCovidData] = useState()


    useEffect(() => {
        // TODO: replace this with getCorrelations
        getCovid("Alameda", "cases").then(res => {
            setCovidData(res.results)
        })
    }, [])


    console.log(covidData)


    return (
        <div>
            <h1>Covid Correlation Page</h1>
        </div>
    )
}

export default CovidCorrelations;