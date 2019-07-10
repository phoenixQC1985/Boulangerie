const request = require('request')
const cheerio = require('cheerio')

module.exports = function(req, res, next) {

  const q = req.query.q;
  const l = req.query.l;

  const getIndeed = (callback) => {
    request( `https://www.indeed.fr/emplois?q=${q}&l=${l}` , (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const jobs = []
            const $ = cheerio.load(html)
  
            $('.jobsearch-SerpJobCard').each((i, el) => {
                const titleJob = $(el)
                    .find('.title')
                    .text()  
                const linkJob = $(el)
                    .find('div.title > a')
                    .attr('href')
                const heading = $(el)
                    .find('div.summary')
                    .text()
                const company = $(el)
                    .find('div.sjcl .company ')
                    .text()
                const location = $(el)
                    .find('div.sjcl .location')
                    .text()   
                const date = $(el)
                    .find('span.date')
                    .text() 
              jobs.push({ titleJob, linkJob, heading, company, location, date })
            })
            callback(jobs)
        }
    })
  }
  console.log(req.query.l);
  console.log(req.query.q);
    getIndeed(jobs => {
        res.render('index', {
            jobs 
        })
    })
  }

