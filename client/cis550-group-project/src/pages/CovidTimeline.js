import { useEffect } from "react";
import { getCovid } from "../fetcher";
import { useState } from "react";

const CovidTimeline = () => {

    const [covidData, setCovidData] = useState()


    useEffect(() => {
        // TODO: replace this with getTimeline
        getCovid("alameda", "cases").then(res => {
            setCovidData(res.results)
        })
    }, [])


    console.log(covidData)


    return (
        <div>
            <h1>Covid Timeline Page</h1>
        </div>
    )
}

export default CovidTimeline;