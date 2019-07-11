const request = require('request')
const cheerio = require('cheerio')

module.exports = function(req, res, next) {

    let ql = req.query.q;
    let ll = req.query.l;
        
    const qr = ql.replace(/é/g, 'e').replace(/è/g, 'e').replace(/ç/g, 'c') 
    const lr = ll.replace(/é/g, 'e').replace(/è/g, 'e').replace(/ç/g, 'c')


  const getIndeed = (callback) => {
    request( `https://www.indeed.fr/emplois?q=${qr}&l=${lr}` , (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const jobsInd = []
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
            jobsInd.push({ titleJob, linkJob, heading, company, location, date })
            })
            callback(jobsInd)
        }
    })
  }

  const getMeteo = (callback) => {
    request( `https://www.meteojob.com/jobsearch/offers?what=${qr}&where=${lr}` , (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const jobsMet = []
            const $ = cheerio.load(html)
  
            $('#mj-main-container div.result-content>ul.mj-offers-list>li>article.mj-offer').each((i, el) => {
                const titleJob = $(el)
                    .find('h2.title')
                    .text()  
                const linkJob = $(el)
                    .find('a.block-link')
                    .attr('href')
                const heading = $(el)
                    .find('.preview')
                    .text()
                const company = $(el)
                    .find('.logo > span > span > img')
                    .attr('alt')
                const location = $(el)
                    .find('.list-unstyled > li + li > h3')
                    .text()   
                const date = $(el)
                    .find('.published-date')
                    .text() 
            jobsMet.push({ titleJob, linkJob, heading, company, location, date })
            })
            callback(jobsMet)
        }
    })
  }

  console.log(req.query.l);
  console.log(req.query.q);
    getIndeed(jobsInd => {
        getMeteo(jobsMet => {
        res.render('index', {
            jobsInd , jobsMet 
        })
    })})
  }

