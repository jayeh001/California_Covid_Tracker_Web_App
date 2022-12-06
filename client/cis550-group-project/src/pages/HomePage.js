import { useEffect } from "react";
import { getCovid } from "../fetcher";
import { useState } from "react";

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
        </div>
    )
}

export default HomePage;