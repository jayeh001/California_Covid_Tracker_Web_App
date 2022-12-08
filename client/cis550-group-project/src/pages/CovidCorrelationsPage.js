import { useEffect } from "react";
import { getCorrelations } from "../fetcher";
import { useState } from "react";
//import { getCovid } from "../fetcher";

const CovidCorrelations = () => {

    const [corrData, setCorrData] = useState()


    useEffect(() => {
        // TODO: replace this with getCorrelations
        getCorrelations("overcrowding", "rates", "Alameda").then(res => {
            setCorrData(res.results)
        })
    }, [])


    console.log(corrData)


    return (
        <div>
            <h1>Covid Correlation Page</h1>
        </div>
    )
}

export default CovidCorrelations;