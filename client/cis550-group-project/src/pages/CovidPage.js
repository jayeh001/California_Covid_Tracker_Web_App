import { useEffect } from "react";
import { getCovid } from "../fetcher";
import { useState } from "react";

const CovidPage = () => {

    const [covidData, setCovidData] = useState()


    useEffect(() => {
        getCovid("alameda", "cases").then(res => {
            setCovidData(res.results)
        })
    }, [])


    console.log(covidData)


    return (
        <div>
            <h1>Covid Page</h1>
        </div>
    )
}

export default CovidPage;