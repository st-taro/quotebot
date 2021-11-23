const wikiPath = 'https://dota2.fandom.com';
const Crawler = require('crawler');

let responses = [];

const crawlPage = (error, res, done) => {
  if (error) {
    console.log(error);
    return;
  } else {
    let $ = res.$;

    let index = 0;
    // Find main body of articles
    let listBody = $('div.mw-parser-output ul li').each(function (i, x) {
      // let line = {
      //   url: $('div.mw-parser-output ul li a').attr('href'),
      //   quote: $(this).text(),
      // };
      // responses.push(line);
      let linkRegex = /Link/g;
      const text = $(this).text();
      if(text.match(linkRegex)) {
        const quote = text.substring(8)
        console.log("quote = " + quote);
        const url = $(x).attr('src')
        console.log("url = " +url);
      }
      
    });
  }
};

// define crawler callback function
const crawlCategories = (error, res, done) => {
  if (error) {
    // just console log it 4head
    console.log(error);
    return;
  } else {
    /**
     * So we need the crawler to take the Dota wiki responses page and
     * follow all links in the article body. Then it needs to save all the
     * responses and urls to the voice lines for said responses.
     */
    let $ = res.$;

    let pages = [];

    // Find main body of articles
    let listBody = $('div.mw-category ul li a').each(function () {
      let page = {
        url: $(this).attr('href'),
        title: $(this).text(),
      };
      pages.push(page);
    });

    let responses = [];
    pages.forEach(function (x) {
      const { url, title } = x;
      c.queue([
        {
          uri: wikiPath + url,
          callback: crawlPage,
        },
      ]);
    });
    // console.log(responses);
    // console.log(pages);
  }
};

// start crawler
let c = new Crawler({ maxConnections: 10 });

c.queue([
  {
    uri: wikiPath + '/wiki/Category:Responses',
    callback: crawlCategories,
  },
]);
