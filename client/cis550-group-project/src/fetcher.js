import config from './config.json'

const getCovid = async (county_name, type) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/covid/${type}?county_name=${county_name}`, {
        method: 'GET',
    })
    // const data = await res.json()
    // console.log(data)
    return await res.json()
}

const getCorrelations = async (category, county_name) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/correlations/${category}?fips=${county_name}`, {
        method: 'GET',
    })
    return res.json()
}

const getTimeline = async (type, county_name) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/timeline/${type}?fips=${county_name}`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getCovid,
    getCorrelations,
    getTimeline
}
