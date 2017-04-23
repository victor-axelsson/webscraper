var request = require('request');

var queue = [];
var settings = {
    queueSize: 5, //The size of the request queue
    intervalTime: 1000, // one second,
};

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

var counter = 0;
var addToQueue = function() {
    while (queue.length < settings.queueSize) {
        var item = {
            isDone: false,
            status: -1,
            id: counter,
            url: getNextUrl(),
            execute: function(callback) {
                var that = this; //Because of the closure
                scrape(this.url, function(body, statusCode) {
                    callback(body, statusCode, that);
                });
            }
        };

        counter++;
        console.log("Added new to queue");
        queue.push(item);
    }
}

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

/**
 * Main loop of the program
 */
var intervalId = setInterval(function() {

    //Remove all that was done from the queue
    var tmp = [];
    for (var i = 0; i < queue.length; i++) {
        if (!queue[i].isDone) {
            tmp.push(queue[i]);
        } else {
            console.log("removed " + i + " from queue");
        }
    }
    queue = tmp;


    addToQueue();

    for (var i = 0; i < queue.length; i++) {
        queue[i].execute(function(body, statusCode, scope) {
            scope.isDone = true;
            scope.status = statusCode;
            console.log("Done fetching: " + scope.id);
            proccessHttp(body);
        });
    }

    console.log("queue size: " + queue.length);

}, settings.intervalTime);
