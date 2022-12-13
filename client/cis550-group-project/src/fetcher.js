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

const getTimeline = async (type, county_name) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/timeline/${type}?fips=${county_name}`, {
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

export {
    getCounties,
    getCovid,
    getCorrelations,
    getTimeline
}
