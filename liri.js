var fs = require('fs');
var request = require('request');
var keys = require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

function runSwitch(){
	switch(userCommand){
		
		case 'my-tweets':
		getTweets();
		break;

		case 'spotify-this-song':
		getSong();
		break;

		case 'movie-this':
		getMovie();
		break;

		case 'do-what-it-says':
		getRandom();
		break;
	}
};

function getTweets(){
	var client = new twitter({
    	consumer_key: keys.twitterKeys.consumer_key,
    	consumer_secret: keys.twitterKeys.consumer_secret,
    	access_token_key: keys.twitterKeys.access_token_key,
    	access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {
		screen_name: 'kanyewest',
		count: 20,
	};

	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if (!error){
			for (i = 0; i < tweets.length; i++){
				var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
				console.log(returnedData);
				console.log('-----------------');
			}
		};
	});
};

function getSong(){
	var searchTrack = "The Sign";
	if(secondCommand === undefined){
		searchTrack;
	} else {
		searchTrack = secondCommand;
	};

	spotify.search({type: 'track', query: searchTrack}, function(err, data){
		if(err){
			console.log('Error occured: ' + err);
			return;
		} else {
			console.log("Artist: " + data.tracks.items[0].artists[0].name);
        	console.log("Song Name: " + data.tracks.items[0].name);
        	console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
        	console.log("Album: " + data.tracks.items[0].album.name);
		};
	});
};

function getMovie(){
	var searchMovie = "Mr. Nobody";
	if(secondCommand === undefined){
		searchMovie;
	} else {
		searchMovie = secondCommand;
	};

	request('http://www.omdbapi.com/?t=' + searchMovie + "&tomatoes=true", function (error, response, body){
		if(!error && response.statusCode == 200){
			var movieData = JSON.parse(body);
			console.log('Title: ' + movieData.Title);
			console.log("Year: " + movieData.Year);
            console.log("IMDB Rating: " + movieData.imdbRating);
            console.log("Country: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot: " + movieData.Plot);
            console.log("Actors: " + movieData.Actors);
            console.log("Rotten Tomatoes Rating: " + movieData.tomatoUserRating);
            console.log("Rotten Tomatoes URL: " + movieData.tomatoURL);
		} else {
			console.log(error);
		}
	});
};

function getRandom(){
	fs.readFile('random.txt', 'utf8', function(error, data){
		if(error){
			console.log(error);
		} else {
			var dataArr = data.split(',');
			userCommand = dataArr[0];
			secondCommand = dataArr[1];
			for(i = 2; i < dataArr.length; i++){
				secondCommand = secondCommand + '+' + dataArr[i];
			};
			runSwitch();
		};
	});
};

runSwitch();
