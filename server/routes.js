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
        res.send(`Hello, ${req.query.name}! Welcome to the CIS5500 Group Project server!`)
    } else {
        res.send(`Hello! Welcome to the cis550-final-project server!`)
    }
}

// Route 2 (handler)
async function covid(req, res) {
    const choice = req.params.choice ? req.params.choice : 'cases'
    const county = req.query.county_name ? req.query.county_name : "Alameda"
    const fips = 6001
    connection.query(`SELECT fips FROM County WHERE county_name= %${county}%`, function(error, results, fields) {
        fips = results.fips
    });
    if (req.params.choice == 'cases') {
        connection.query(`WITH Per_100k_Vaccination AS (SELECT (v.vaccinated / c.population * 100000) AS vaccinated_per_100k
        FROM CountyVacc v JOIN County c ON v.county_code = %${fips}%
        WHERE fips = ${county}$ AND v.Date >= ALL (SELECT Date FROM CountyVacc)),

        Per_100k_Cases AS (SELECT cases AS cases_per_100k
        FROM CountyCases cc JOIN County c ON cc.county_code = %${fips}%
        WHERE fips = ${county}$ AND cc.Date >= ALL (SELECT Date FROM CountyCases)),

        Per_100k_Deaths AS (SELECT (d.cases / c.population * 100000) AS deaths_per_100k
        FROM CountyDeath d JOIN County c ON d.county_code = %${fips}%
        WHERE fips = ${county}$ AND d.Date >= ALL (SELECT Date FROM CountyDeath))

        SELECT v.vaccinated_per_100k AS vaccinated_per_100k, c.cases_per_100k AS cases_per_100k, d.deaths_per_100k AS deaths_per_100k
        FROM Per_100k_Vaccination v JOIN Per_100k_Cases c JOIN Per_100k_Deaths d`, function(error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            }
            else if (results) {
                res.json({results: results})
            }
        }); 
    } else {
        connection.query(`WITH Per_100k_Deaths AS (SELECT (d.cases / c.population * 100000) AS deaths_per_100k, d.Date as Date
        FROM CountyDeath d JOIN County c ON d.county_code = %${fips}%)

        Per_100k_Vaccinated AS (SELECT (v.vaccinated / c.population * 100000) AS vaccination_per_100k, v.Date as Date
        FROM CountyVacc v JOIN County c ON v.county_code = %${fips}%)

        SELECT v.vaccination_per_100k, d.deaths_per_100k
        FROM Per_100k_Deaths d JOIN Per_100k_Vaccinated ON d.date = v.date`, function(error,results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            }
            else if (results) {
                res.json({results: results})
            }
        });
    }
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
