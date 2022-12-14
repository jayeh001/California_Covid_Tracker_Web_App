import config from './config.json'

const getCovid = async (county_name, type) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/covid/${type}?county_name=${county_name}`, {
        method: 'GET',
    })
    return res.json()
}

const getCorrelations = async (category, type, county_name) => {
    // console.log('inside getCorrelations fetcher function. Before await fetch call')
    var res = await fetch(`http://${config.server_host}:${config.server_port}/correlations/${category}/${type}?county_name=${county_name}`, {
        method: 'GET',
    })
    // console.log('after await fetch call')
    // console.log(res)
    return res.json()
}

const getTimeline = async (county_name, type, minDate, maxDate) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/timeline/${type}?county_name=${county_name}&minDate=${minDate}&maxDate=${maxDate}`, {
        method: 'GET',
    })
    return res.json()
}

const getTimelineCorr = async (county_name, type) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/timelineCorr?type=${type}&county_name=${county_name}`, {
        method: 'GET',
    })
    return res.json()
}

const getCounties = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/counties`, {
        method: 'GET',
    })
    return res.json()
}

const getRates = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/rates`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getCounties,
    getRates,
    getCovid,
    getCorrelations,
    getTimeline,
    getTimelineCorr
}
