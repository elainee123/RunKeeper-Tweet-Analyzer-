function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	

//Gets the data from tweet.ts and puts it into about.js
	let completed_events = tweet_array.filter(t => t.source === 'completed_event').length;
	let live_events = tweet_array.filter(t => t.source === 'live_event').length;
	let achievement_events = tweet_array.filter(t => t.source === 'achievement').length;
	let miscellaneous_events = tweet_array.filter(t => t.source === 'miscellaneous').length;
	let written_text = tweet_array.filter(t => t.written).length;
	let total_tweets = tweet_array.length;


	document.getElementById('numberTweets').innerText = tweet_array.length;	
	Array.from(document.getElementsByClassName('completedEvents')).forEach( 
		element => { element.innerText = completed_events});
	Array.from(document.getElementsByClassName('completedEventsPct')).forEach( 
		element => { element.innerText = math.format((completed_events / total_tweets) * 100, {notation: 'fixed', precision: 2})  + '%'});


	Array.from(document.getElementsByClassName('liveEvents')).forEach( 
		element => { element.innerText = live_events});
	Array.from(document.getElementsByClassName('liveEventsPct')).forEach( 
		element => { element.innerText = math.format((live_events/total_tweets)  * 100, {notation: 'fixed', precision: 2}) + '%'});


	Array.from(document.getElementsByClassName('achievements')).forEach( 
		element => { element.innerText = achievement_events});
	Array.from(document.getElementsByClassName('achievementsPct')).forEach( 
		element => { element.innerText = math.format((achievement_events/total_tweets)  * 100, {notation: 'fixed', precision: 2}) + '%'});

	Array.from(document.getElementsByClassName('miscellaneous')).forEach( 
		element => { element.innerText = miscellaneous_events});
	Array.from(document.getElementsByClassName('miscellaneousPct')).forEach( 
		element => { element.innerText = math.format((miscellaneous_events/total_tweets)  * 100, {notation: 'fixed', precision: 2}) + '%'});
	
	Array.from(document.getElementsByClassName('written')).forEach( 
		element => { element.innerText = written_text});
	Array.from(document.getElementsByClassName('writtenPct')).forEach( 
		element => { element.innerText = math.format(((written_text) / (completed_events)) * 100, {notation: 'fixed', precision: 2}) + '%'});
	
	
//Edit the about.js file to find the earliest and latest tweet and update the spans.
	let latest_date = tweet_array[0].time;
	let earliest_date = tweet_array[0].time;
	for (tweet of tweet_array){
		if (tweet.time > latest_date ){
			latest_date = tweet.time;
		} else if (tweet.time < earliest_date){
			earliest_date = tweet.time
		}
	}


//format of the dates 
	document.getElementById('firstDate').innerText = earliest_date.toLocaleString("en-US", {
		timeZone: "UTC",
		weekday: "long",
		month: "long",
		year: "numeric",
		day: "numeric"
	});
	document.getElementById('lastDate').innerText = latest_date.toLocaleString("en-US", {
		timeZone: "UTC",
		weekday: "long",
		month: "long",
		year: "numeric",
		day: "numeric"
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});