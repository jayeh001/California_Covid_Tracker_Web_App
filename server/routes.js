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

async function counties(req, res) {
    connection.query(`SELECT county_name from County`, function(error, results, fields) {
        if (error) {
            console.log(error)
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Route 2 (handler)
async function covid(req, res) {
    console.log('inside covid')
    var type = req.params.type ? req.params.type : 'cases'
    var county = req.query.county_name ? req.query.county_name :'Alameda'
    console.log('received for route: ' + county);
    //var county_code =  6001
    connection.query(`SELECT fips FROM County WHERE county_name= '${county}'`, function(error, results, fields) {
        console.log(req.query.county_name)
        county_code = results[0].fips
        if (type == 'cases') {
            connection.query(`WITH Vaccination AS (SELECT vaccinated, date
                FROM CountyVacc
                WHERE county_code = ${county_code}
                ORDER BY date DESC
                LIMIT 1),

                Cases_Per_100k AS (SELECT cases, date
                FROM CountyCases
                WHERE county_code = ${county_code}
                ORDER by date DESC
                LIMIT 1),

                Deaths AS (SELECT cases, county_code, date
                FROM CountyDeath
                WHERE county_code = ${county_code}
                ORDER BY date DESC
                LIMIT 1),

                Population AS (SELECT population, county_name, description
                FROM County
                WHERE fips = ${county_code})

                SELECT d.county_code as fips, p.description AS description, p.county_name as name, p.population as population, (v.vaccinated / p.population * 100000) AS vaccinated_per_100k, v.date AS vaccDate, c.cases AS cases_per_100k, c.date AS casesDate, (d.cases / p.population * 100000) AS deaths_per_100k, d.date AS deathsDate
                FROM Vaccination v JOIN Cases_Per_100k c JOIN Deaths d JOIN Population p;`, function(error, results, fields) {
                
                if (error) {
                    console.log(error)
                }
                else if (results) {
                    //console.log(results[0]);
                    res.json({results: results, type: type})
                }
            }); 
        } else {
            connection.query(`WITH Averages AS (SELECT cases_avg, deaths_avg, county_code
                FROM (SELECT AVG(cases) AS cases_avg, county_code
                      FROM CountyCases WHERE date < '2022-01-01' AND county_code = ${county_code} GROUP BY county_code) X,
                     (SELECT AVG(cases) AS deaths_avg
                      FROM CountyDeath WHERE date < '2022-01-01' AND county_code = ${county_code} GROUP BY county_code) Y),

                Cases AS (SELECT cases, date, county_code
                        FROM CountyCases WHERE county_code = ${county_code} AND date < '2022-01-01'),

                Deaths AS (SELECT cases, date, county_code
                            FROM CountyDeath WHERE county_code = ${county_code}  AND date < '2022-01-01'),

                County_Pop AS (SELECT county_name, population, description
                               FROM County WHERE fips = ${county_code})

                SELECT SUM((c.cases - a.cases_avg) * (d.cases - a.deaths_avg))/
                        ((count(*) - 1) * (stddev_samp(c.cases) * stddev_samp(d.cases))) AS Correlation, p.county_name AS name, p.population AS population, p.description AS description
                FROM Cases c  JOIN Deaths d ON c.date = d.date, Averages a, County_Pop p;`, function(error,results, fields) {
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
    console.log('inside correlations')
    var category = req.params.category ? req.params.category : 'overcrowding'
    //const county = req.query.type ? req.query.type : "Alameda"
    var type = req.params.type ? req.params.type : 'rate'
    var county_name = req.query.county_name ? req.query.county_name :'Alameda'
    console.log('received this: ', category, type, county_name) 
    connection.query(`SELECT fips FROM County WHERE county_name= '${county_name}'`, function(error, results, fields){
        county_code = results[0].fips
        console.log('this is county code', county_code)
        if (category == 'overcrowding') {
            if (type == 'rates') {
                connection.query(`WITH X as (SELECT county_code, (SUM(cases)/C.population) * 100 as percent_infected
            FROM CountyCases CC join County C on CC.county_code = C.fips
            GROUP BY county_code) SELECT O.county_code, O.percentage/percent_infected as overcrowding_to_cases_rate
            FROM Overcrowding O JOIN X on O.county_code = X.county_code
            WHERE O.county_code = ${county_code}
            `, function(error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                })
            } else{
                console.log('INSIDE OF OVERCROWDING CORRELATION')
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
        } else if (category == 'poverty') {
            if (type == 'rates') {
                connection.query(`WITH A as (SELECT county_code, (SUM(cases)/C.population) * 100 as percent_infected_per_county
                FROM CountyCases CC join County C on CC.county_code = C.fips
                GROUP BY county_code)
                SELECT P.county_code, P.poverty/percent_infected_per_county as poverty_to_cases_rate
                FROM Poverty P JOIN A on P.county_code = A.county_code
                WHERE P.county_code = ${county_code}
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
                `, function(error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                })
            }
    
        }
    })
    
}


module.exports = {
    hello,
    counties,
    covid,
    correlations,
    timeline
}
