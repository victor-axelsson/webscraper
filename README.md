# Setup
- `npm install´
- ´nodemon server.js´

# Implementation
You will need to complete the following funcitons so that your scraper will work for whatever you are scraping. 

```

/**
 * TODO: implement logic for exiting the scraping. If you return false here, the interval will stop
 */
var IShouldTerminate = function(){
    return false; 
}

/**
 * TODO: implement logic for getting the next url to scrape
 */
var getNextUrl = function() {
    //You need to have some kind of logic to get the next url to fetch. use a global counter or something. 

    //This stops the intervall if IShouldTerminate returns true
    if(IShouldTerminate()){
        clearInterval(intervalId);
    }
    return "http://www.google.com";
}

var proccessHttp = function(http) {
    //console.log(http);
    //Maybe you can use some npm module to process the http, create your models and save them to a database
}
```

# Adding header
If you need to add headers you can edit the options for request: 

```

/**
* This is the acutal http request. You can add/remove headers and stuff here
*/
var scrape = function(url, callback) {

    var options = {
        url: url,
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'sv-SE,sv;q=0.8,en-US;q=0.6,en;q=0.4',
            'Content-Type': 'application/json'
        }
    };

    request(options, function(error, response, body) {
        if (error) throw error;
        callback(body, response.statusCode);
    });
}
```

# Edit pagination options
You can change the size of the paginator from the default size of 5. You can also speed up or slow down the scraper from the default of one second request loop
with the settings object. If you have any additional settings it's advisable that you also put them here. 

```
var settings = {
    queueSize: 5, //The size of the request queue
    intervalTime: 1000, // one second,
};
```
