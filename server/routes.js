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

async function rates(req, res) {
    connection.query(`SELECT CONCAT("0", fips) AS GEOID, (AVG(cases)/population) * 100000 as cases_per_100k
    FROM County JOIN CountyCases ON County.fips = CountyCases.county_code
    GROUP BY fips;`, function(error, results, fields) {
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
                      FROM CountyCases WHERE county_code = ${county_code} GROUP BY county_code) X,
                     (SELECT AVG(cases) AS deaths_avg
                      FROM CountyDeath WHERE county_code = ${county_code} GROUP BY county_code) Y),

                Cases AS (SELECT cases, date, county_code
                        FROM CountyCases WHERE county_code = ${county_code}),

                Deaths AS (SELECT cases, date, county_code
                            FROM CountyDeath WHERE county_code = ${county_code}),

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
    var type = req.params.type ? req.params.type : 'cases'
    var county = req.query.county_name ? req.query.county_name : 'Alameda'
    var minDate = req.query.minDate ? req.query.minDate : '2020-02-01'
    var maxDate = req.query.maxDate ? req.query.maxDate : '2022-11-29'
    connection.query(`SELECT fips FROM County WHERE county_name= '${county}'`, function (error, results, fields) {
        console.log(req.query.county_name)
        county_code = results[0].fips
        if (type === 'cases') {
            console.log(minDate)
            console.log(maxDate)
            connection.query(`SELECT cases, date
            FROM CountyCases cc JOIN County c ON cc.county_code = c.fips
            WHERE cases IS NOT NULL AND fips = ${county_code} AND date >= "${minDate}" AND date <= "${maxDate}";`, function (error, results, fields) {
                if (error) {
                    console.log(error)
                }
                else if (results) {
                    //console.log(results[0]);
                    res.json({ results: results, type: type })
                }
            });
        }
         else if (type === 'vaccinated') {
            connection.query(`SELECT v.vaccinated, v.date 
            FROM CountyVacc v JOIN County c ON v.county_code = c.fips
            WHERE vaccinated IS NOT NULL AND fips = ${county_code} AND date >= "${minDate}" AND date <= "${maxDate}";`, function (error, results, fields) {
                if (error) {
                    console.log(error)
                }
                else if (results) {
                    //console.log(results[0]);
                    res.json({ results: results, type: type })
                }
            });   
        }

        else if(type === 'deaths'){
            connection.query(`SELECT d.cases, d.date
            FROM CountyDeath d JOIN County c ON d.county_code = c.fips
            WHERE cases IS NOT NULL AND cases >= 0 AND fips = ${county_code} AND date >= "${minDate}" AND  date <= "${maxDate}";`, function (error, results, fields) {
                if (error) {
                    console.log(error)
                }
                else if (results) {
                    //console.log(results[0]);
                    res.json({ results: results, type: type })
                }
            });   
        }
    })
}


async function timelineCorr(req, res){
    var type = req.query.type ? req.query.type : 'Overall'
    var startDate = '2022-09-01'
    var endDate = '2022-11-29'
    console.log(type)
    if (type === "Overall"){
        connection.query(`WITH Cases AS (SELECT SUM(cc.cases) AS num_cases, SUM(cc.cases)/c.population * 100 AS cases_percent
                                    FROM CountyCases cc JOIN County c on cc.county_code = c.fips
                                    WHERE cc.cases IS NOT NULL AND cc.date >= "${startDate}" AND cc.date <= "${endDate}"), 
                      Vaccinated AS (SELECT SUM(cv.vaccinated) AS num_vaccinated, SUM(cv.vaccinated)/SUM(c.population) * 100 AS vaccinated_percent
                                    FROM CountyVacc cv JOIN County c on cv.county_code = c.fips
                                    WHERE cv.vaccinated IS NOT NULL AND  cv.date = "${endDate}"),
                      
                      Deaths AS (SELECT SUM(cases) AS num_deaths, SUM(cd.cases)/c.population * 100 AS death_percent
                                FROM CountyDeath cd JOIN County c on cd.county_code = c.fips
                                WHERE cd.cases IS NOT NULL AND  cd.date >= "${startDate}" AND cd.date <= "${endDate}")
                      SELECT c.num_cases, c.cases_percent, c.num_cases/90 AS cases_daily, v.num_vaccinated, v.vaccinated_percent, v.num_vaccinated/90 AS vaccinated_daily, d.num_deaths, d.death_percent, d.num_deaths/90 AS deaths_daily
                      FROM Cases c, Vaccinated v, Deaths d`, function (error, results, fields) {
            if (error) {
                console.log(error)
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
    else if (type === 'All'){
        connection.query(`WITH Cases AS (SELECT c.county_name, SUM(cc.cases) AS num_cases, SUM(cc.cases)/c.population * 100 AS cases_percent
                                    FROM CountyCases cc JOIN County c on cc.county_code = c.fips
                                    WHERE cc.cases IS NOT NULL AND cc.date >= "${startDate}" AND cc.date <= "${endDate}"
                                    GROUP BY c.county_name), 
                      Vaccinated AS (SELECT c.county_name, cv.vaccinated AS num_vaccinated, cv.vaccinated/c.population * 100 AS vaccinated_percent
                                    FROM CountyVacc cv JOIN County c on cv.county_code = c.fips
                                    WHERE cv.vaccinated IS NOT NULL AND  cv.date = "${endDate}"
                                    GROUP BY c.county_name),
                      
                      Deaths AS (SELECT c.county_name, SUM(cases) AS num_deaths, SUM(cd.cases)/c.population * 100 AS death_percent
                                FROM CountyDeath cd JOIN County c on cd.county_code = c.fips
                                WHERE cd.cases IS NOT NULL AND  cd.date >= "${startDate}" AND cd.date <= "${endDate}"
                                GROUP BY c.county_name)
                      SELECT c.county_name, c.num_cases, c.cases_percent, v.num_vaccinated, v.vaccinated_percent, d.num_deaths, d.death_percent
                      FROM Cases c JOIN Vaccinated v ON c.county_name=v.county_name
                      JOIN Deaths d ON c.county_name = d.county_name
                      ORDER BY c.county_name`, function (error, results, fields) {
            if (error) {
                console.log(error)
            } else if (results) {
                res.json({ results: results })
            }
        });

    }
    else if(type === "Overall_by_date"){
        connection.query(`WITH Cases AS (SELECT cc.date, SUM(cc.cases) AS num_cases
                                    FROM CountyCases cc JOIN County c on cc.county_code = c.fips
                                    WHERE cc.cases IS NOT NULL AND cc.date >= "${startDate}" AND cc.date <= "${endDate}" AND cc.date LIKE "%1" OR cc.date LIKE "%14"
                                    GROUP BY cc.date), 
                      Vaccinated AS (SELECT cv.date, SUM(cv.vaccinated) AS num_vaccinated
                                    FROM CountyVacc cv JOIN County c on cv.county_code = c.fips
                                    WHERE cv.vaccinated IS NOT NULL AND cv.date >= "${startDate}" AND cv.date <= "${endDate}" AND cv.date LIKE "%1" OR cv.date LIKE "%14"
                                    GROUP BY cv.date),
                      
                      Deaths AS (SELECT cd.date, SUM(cases) AS num_deaths
                                FROM CountyDeath cd JOIN County c on cd.county_code = c.fips
                                WHERE cd.cases IS NOT NULL AND  cd.date >= "${startDate}" AND cd.date <= "${endDate}" AND cd.date LIKE "%1" OR cd.date LIKE "%14"
                                GROUP BY cd.date)
                      SELECT c.date, c.num_cases, v.num_vaccinated, d.num_deaths
                      FROM Cases c JOIN Vaccinated v ON c.date = v.date
                      JOIN Deaths d ON d.date = c.date`, function (error, results, fields) {
            if (error) {
                console.log(error)
            } else if (results) {
                res.json({ results: results })
            }
        });

    }
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
                connection.query(`WITH Avg as (SELECT county_code, (AVG(cases)/C.population) * 100000 AS avg_infected_per_100k
            FROM CountyCases CC join County C on CC.county_code = C.fips
            WHERE CC.county_code = ${county_code}
            GROUP BY county_code) SELECT O.percentage AS score, A.avg_infected_per_100k AS avg_infected_per_100k
            FROM Overcrowding O JOIN Avg A on O.county_code = A.county_code
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
                connection.query(`WITH County_Avg AS (SELECT county_code, AVG(cases) AS avg_infected_per_county
                FROM CountyCases
                GROUP BY county_code),

                County_Avg_Per_100k AS (SELECT county_code, (avg_infected_per_county/population) * 100000 AS per_100k_infect_avg
                    FROM County_Avg JOIN County ON County_Avg.county_code = County.FIPS),

                Both_Averages AS (SELECT overcrowd_avg, AVG(per_100k_infect_avg) AS overall_infect_avg
                                FROM (SELECT county_code, AVG(percentage) AS overcrowd_avg
                                FROM Overcrowding) O JOIN County_Avg_Per_100k CA ON O.county_code = CA.county_code)

                SELECT SUM( (O.percentage - overcrowd_avg) * (CA.per_100k_infect_avg - overall_infect_avg) ) /
                ((count(*) -1) * (stddev_samp(percentage) * stddev_samp(per_100k_infect_avg)))
                    as Correlation
                FROM Overcrowding O JOIN County_Avg_Per_100k CA on O.county_code = CA.county_code, Both_Averages;
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
                connection.query(`WITH Avg as (SELECT county_code, (AVG(cases)/C.population) * 100000 AS avg_infected_per_100k
                FROM CountyCases CC join County C on CC.county_code = C.fips
                WHERE CC.county_code = ${county_code}
                GROUP BY county_code)
                SELECT P.poverty AS score, A.avg_infected_per_100k AS avg_infected_per_100k
                FROM Poverty P JOIN Avg A on P.county_code = A.county_code
                WHERE P.county_code = ${county_code};
                `,function(error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                })
            } else {
                connection.query(`WITH County_Avg AS (SELECT county_code, AVG(cases) AS avg_infected_per_county
                FROM CountyCases
                GROUP BY county_code),

                County_Avg_Per_100k AS (SELECT county_code, (avg_infected_per_county/population) * 100000 AS per_100k_infect_avg
                    FROM County_Avg JOIN County ON County_Avg.county_code = County.FIPS),

                Both_Averages AS (SELECT poverty_avg, AVG(per_100k_infect_avg) AS overall_infect_avg
                                FROM (SELECT county_code, AVG(poverty) AS poverty_avg
                                FROM Poverty) P JOIN County_Avg_Per_100k CA ON P.county_code = CA.county_code)

                SELECT SUM( (P.poverty - poverty_avg) * (CA.per_100k_infect_avg - overall_infect_avg) ) /
                ((count(*) -1) * (stddev_samp(poverty) * stddev_samp(per_100k_infect_avg)))
                    as Correlation
                FROM Poverty P JOIN County_Avg_Per_100k CA on P.county_code = CA.county_code, Both_Averages;
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
    rates,
    covid,
    correlations,
    timeline,
    timelineCorr
}
