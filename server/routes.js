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
    //console.log(req.params.type)
    var type = req.params.type ? req.params.type : 'cases'
    //const county = req.query.type ? req.query.type : "Alameda"
    var county = req.query.county_name ? req.query.county_name :'"Alameda'
    var county_code =  6001
    connection.query(`SELECT fips FROM County WHERE county_name= '${county}'`, function(error, results, fields) {
        //console.log(req.params.type)
        console.log(req.query.county_name)
        county_code = results[0].fips
        //console.log(county_code)
        //console.log(type)
        if (type == 'cases') {
            connection.query(`WITH Per_100k_Vaccination AS (SELECT (v.vaccinated / c.population * 100000) AS vaccinated_per_100k
                FROM CountyVacc v JOIN County c ON v.county_code = c.fips
                WHERE fips = ${county_code} AND v.Date >= ALL (SELECT Date FROM CountyVacc)),
    
                Per_100k_Cases AS (SELECT cases AS cases_per_100k
                FROM CountyCases cc JOIN County c ON cc.county_code = c.fips
                WHERE fips = ${county_code} AND cc.Date >= ALL (SELECT Date FROM CountyCases)),
    
                Per_100k_Deaths AS (SELECT (d.cases / c.population * 100000) AS deaths_per_100k
                FROM CountyDeath d JOIN County c ON d.county_code = c.fips
                WHERE fips = ${county_code} AND d.Date >= ALL (SELECT Date FROM CountyDeath))
    
                SELECT v.vaccinated_per_100k AS vaccinated_per_100k, c.cases_per_100k AS cases_per_100k, d.deaths_per_100k AS deaths_per_100k
                FROM Per_100k_Vaccination v JOIN Per_100k_Cases c JOIN Per_100k_Deaths d`, function(error, results, fields) {
                
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
                    console.log(results[0]);
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
    // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    
}


module.exports = {
    hello,
    covid,
    correlations,
    timeline
}
