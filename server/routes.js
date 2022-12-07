const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function hello(req, res) {
    // a GET request to /hello?name=Steve
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the FIFA server!`)
    } else {
        res.send(`Hello! Welcome to the FIFA server!`)
    }
}

// Route 2 (handler)
async function covid(req, res) {
    var type = req.params.type ? req.params.type : 'cases'
    var county = req.query.county_name ? req.query.county_name :'Alameda'
    console.log('received for route: ' + county);
    //var county_code =  6001
    connection.query(`SELECT fips FROM County WHERE county_name= '${county}'`, function(error, results, fields) {
        console.log(req.query.county_name)
        county_code = results[0].fips
        if (type == 'cases') {
            connection.query(`WITH Per_100k_Vaccination AS (SELECT (v.vaccinated / c.population * 100000) AS vaccinated_per_100k
            FROM CountyVacc v JOIN County c ON v.county_code = c.fips
            WHERE vaccinated IS NOT NULL AND fips = ${county_code} AND v.Date >= ALL (SELECT Date FROM CountyVacc WHERE county_code = ${county_code} AND date IS NOT NULL AND vaccinated IS NOT NULL)),

            Per_100k_Cases AS (SELECT cases AS cases_per_100k
            FROM CountyCases cc JOIN County c ON cc.county_code = c.fips
            WHERE cases IS NOT NULL AND fips = ${county_code} AND cc.Date >= ALL (SELECT Date FROM CountyCases WHERE county_code = ${county_code} AND date IS NOT NULL AND cases IS NOT NULL)),

            Per_100k_Deaths AS (SELECT (d.cases / c.population * 100000) AS deaths_per_100k
            FROM CountyDeath d JOIN County c ON d.county_code = c.fips
            WHERE cases IS NOT NULL AND fips = ${county_code} AND d.Date >= ALL (SELECT date FROM CountyDeath WHERE county_code = ${county_code} AND date IS NOT NULL AND cases IS NOT NULL))

            SELECT v.vaccinated_per_100k AS vaccinated_per_100k, c.cases_per_100k AS cases_per_100k, d.deaths_per_100k AS deaths_per_100k
            FROM Per_100k_Vaccination v JOIN Per_100k_Cases c JOIN Per_100k_Deaths d;`, function(error, results, fields) {
                
                if (error) {
                    console.log(error)
                }
                else if (results) {
                    //console.log(results[0]);
                    res.json({results: results, type: type})
                }
            }); 
        } else {
            connection.query(`WITH Averages AS (SELECT vaccinated_avg, deaths_avg
                FROM (SELECT AVG(vaccinated) AS vaccinated_avg
                      FROM CountyVacc WHERE county_code = ${county_code} GROUP BY county_code) X,
                     (SELECT AVG(cases) AS deaths_avg
                      FROM CountyDeath WHERE county_code = ${county_code} GROUP BY county_code) Y),
            
                Vaccinations AS (SELECT vaccinated, date
                        FROM CountyVacc
                        WHERE county_code = ${county_code}),
                
                Deaths AS (SELECT cases, date
                            FROM CountyDeath
                            WHERE county_code = ${county_code})
                
                SELECT SUM((v.vaccinated - a.vaccinated_avg) * (d.cases - a.deaths_avg))/
                        ((count(*) - 1) * (stddev_samp(v.vaccinated) * stddev_samp(d.cases))) AS Correlation
                FROM Vaccinations v JOIN Deaths d ON v.date = d.date, Averages a`, function(error,results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                }
                else if (results) {
                    //console.log(results[0]);
                    res.json({results: results, type: type})
                }
            });
        }
    })
   
}

// Route 3 (handler)
async function timeline(req, res) {
    
}

// Route 4 (handler)
async function correlations(req, res) {
// overcrowding or poverty
    var category = req.params.category ? req.params.category : 'overcrowding'
    //const county = req.query.type ? req.query.type : "Alameda"
    var type = req.query.type ? req.query.type :'rates'
    
    if (category = 'overcrowding') {
        if (type = 'rates') {
            connection.query(`WITH X as (SELECT county_code, (SUM(cases)/C.population) * 100 as percent_infected
        FROM CountyCases CC join County C on CC.county_code = C.fips
        GROUP BY county_code) SELECT O.county_code, O.percentage/percent_infected as overcrowding_to_cases_rate
        FROM Overcrowding O JOIN X on O.county_code = X.county_code
        `, function(error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            })
        } else {
            connection.query(`WITH A as (SELECT overcrowd_avg, AVG(percent_infected_per_county) as infect_avg
            FROM (SELECT AVG(percentage) as overcrowd_avg
            FROM Overcrowding) X, (SELECT county_code, (SUM(cases)/C.population) * 100 as percent_infected_per_county FROM CountyCases CC join County C on CC.county_code = C.fips GROUP BY county_code) Y),
            B as (SELECT county_code, (SUM(cases)/C.population) * 100 as percent_infected_per_county
            FROM CountyCases CC join County C on CC.county_code = C.fips
            GROUP BY county_code)
            SELECT SUM( (O.percentage - overcrowd_avg) * (percent_infected_per_county - infect_avg) ) /
                   ((count(*) -1) * (stddev_samp(percentage) * stddev_samp(percent_infected_per_county)))
                    as Correlation
            FROM Overcrowding O JOIN B on O.county_code = B.county_code, A
            `, function(error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            })
        }
    } else if (category = 'poverty') {
        if (types = 'rates') {
            connection.query(`WITH A as (SELECT county_code, (SUM(cases)/C.population) * 100 as percent_infected_per_county
            FROM CountyCases CC join County C on CC.county_code = C.fips
            GROUP BY county_code)
            SELECT P.county_code, P.poverty/percent_infected_per_county as poverty_to_cases_rate
            FROM Poverty P JOIN A on P.county_code = A.county_code
            `,function(error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            })
        } else {
            connection.query(`WITH A as (SELECT overcrowd_avg, AVG(percent_infected_per_county) as infect_avg
            FROM (SELECT AVG(percentage) as overcrowd_avg
            FROM Overcrowding) X, (SELECT county_code, (SUM(cases)/C.population) * 100 as percent_infected_per_county FROM CountyCases CC join County C on CC.county_code = C.fips GROUP BY county_code) Y),
            B as (SELECT county_code, (SUM(cases)/C.population) * 100 as percent_infected_per_county
            FROM CountyCases CC join County C on CC.county_code = C.fips
            GROUP BY county_code)
            SELECT SUM( (O.percentage - overcrowd_avg) * (percent_infected_per_county - infect_avg) ) /
                   ((count(*) -1) * (stddev_samp(percentage) * stddev_samp(percent_infected_per_county)))
                    as Correlation
            FROM Overcrowding O JOIN B on O.county_code = B.county_code, A
            `)
        }
    
    }
    
}


module.exports = {
    hello,
    covid,
    correlations,
    timeline
}
