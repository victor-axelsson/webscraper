var request = require('request');

var queue = [];
var settings = {
    queueSize: 5, //The size of the request queue
    intervalTime: 1000, // one second,
};

var scrape = function(url, callback) {
    //The actual HTTP request
    request(url, function(error, response, body) {
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
 * TODO: implement logic for getting the next url to scrape
 */
var getNextUrl = function() {
    //You need to have some kind of logic to get the next url to fetch. use a global counter or something. 
    return "http://www.google.com";
}

var proccessHttp = function(http) {
    //console.log(http);
    //Maybe you can use some npm module to process the http, create your models and save them to a database
}

/**
 * Main loop of the program
 */
setInterval(function() {

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
