const Crawler = require('crawler');

// define crawler callback function
const crawlCategories = (error, res, done) => {
  if (error) {
    // just console log it 4head
    console.log(error);
    return {};
  } else {
    /**
     * So we need the crawler to take the Dota wiki responses page and
     * follow all links in the article body. Then it needs to save all the
     * responses and urls to the voice lines for said responses.
     */
    let $ = res.$;

    // console.log($('title').text());
    let pages = [];

    // Find main body of articles
    let listBody = $('div.mw-category ul li a').each(function () {
      let page = {
        url: $(this).attr('href'),
        title: $(this).text(),
      };
      pages.push(page);
    });

    console.log(pages);
  }
};

// start crawler
let c = new Crawler({ maxConnections: 10 });

c.queue([
  {
    uri: 'https://dota2.fandom.com/wiki/Category:Responses',
    callback: crawlCategories,
  },
]);
