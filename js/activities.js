function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const ActivityMap = new Map();

	//Most popular Activities it maps Map<activity, occurences>
	for (const tweet of tweet_array){
		if (ActivityMap.has(tweet.activityType)){
			ActivityMap.set(tweet.activityType, ActivityMap.get(tweet.activityType) + 1);
		} else {
			ActivityMap.set(tweet.activityType, 1);
		}
	}

	document.getElementById('numberActivities').innerText = ActivityMap.size;

	//Coverts Map to Array of objects and sorts it by the occurence value
	const activity_array = Array.from(ActivityMap);
	activity_array.sort(function(a, b){return a[1] - b[1]}).reverse();

	document.getElementById('firstMost').innerText = activity_array[0][0];
	document.getElementById('secondMost').innerText = activity_array[1][0];
	document.getElementById('thirdMost').innerText = activity_array[2][0];


	//Distance of Popular Activities
	const DistanceMap = new Map();

	//Farest Averge Distance it maps Map<activity, distance>
	for (const tweet of tweet_array){
		if (DistanceMap.has(tweet.activityType)){
			DistanceMap.set(tweet.activityType, DistanceMap.get(tweet.activityType) + tweet.distance);
		} else {
			DistanceMap.set(tweet.activityType, tweet.distance);
		}
	}

	// distance gone / number of times the activity was done (to find average)
	const first_avg_distance = DistanceMap.get(activity_array[0][0]) / tweet_array.filter(t => t.activityType === activity_array[0][0]).length;
	const second_avg_distance = DistanceMap.get(activity_array[1][0]) / tweet_array.filter(t => t.activityType === activity_array[1][0]).length;
	const third_avg_distance = DistanceMap.get(activity_array[2][0]) / tweet_array.filter(t => t.activityType === activity_array[2][0]).length;

	// Assign shortestActivityType and longestActivityType to the matching min and max value
	const min = Math.min(first_avg_distance, second_avg_distance, third_avg_distance);
	const max = Math.max(first_avg_distance, second_avg_distance, third_avg_distance);

	if (min == first_avg_distance){
		document.getElementById('shortestActivityType').innerText = activity_array[0][0];
	} else if (min == second_avg_distance){
		document.getElementById('shortestActivityType').innerText = activity_array[1][0];
	} else if (min == third_avg_distance){
		document.getElementById('shortestActivityType').innerText = activity_array[2][0];
	}


	if (max == first_avg_distance){
		document.getElementById('longestActivityType').innerText = activity_array[0][0];
	} else if (max == second_avg_distance){
		document.getElementById('longestActivityType').innerText = activity_array[1][0];
	} else if (max == third_avg_distance){
		document.getElementById('longestActivityType').innerText = activity_array[2][0];
	}

	//Turn Distance map to array of objects
	const distance_array = Array.from(DistanceMap);
	distance_array.sort(function(a, b){return a[1] - b[1]}).reverse();


	const activity_distance_data = activity_array.map(([a,b]) => ({a, b}));

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_distance_data
	  },
	  "mark": "bar",
	  "encoding": {
		"x": {field: "a", "type": "nominal", "title": "activity"},
		"y": {field: "b", "type": "quantitative", "title": "distance"}
	  }
	  
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	
	//Graph for activity vs. distance vs. date
	const weekday = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
	const topActivities = [activity_array[0][0], activity_array[1][0], activity_array[2][0]]
	
	//filters tweets by activity type then maps it to the days, distance, activity type (data needed for the plot)
	const tweet_data = tweet_array.filter(t =>
		topActivities.includes(t.activityType)
	).map(t => ({
		date: weekday[t.time.getDay()],
		distance: t.distance,
		activityType: t.activityType
	}));
	
	
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "width": 600,
	  "description": "A graph of the distance by day of the week for all of the three most tweeted-about activities.",
	  "data": {
	    "values": tweet_data
	  },
	  "mark": {
		type: "point",
		opacity: .6,
		size: 100

	  },
	  "encoding": {
		"x": {field: "date", type: "ordinal", sort: weekday, "title": "time (day)"},
		"y": {field: "distance", "type": "quantitative", "title": "distance"},
		"color": { field: "activityType", type: "nominal", "title": "Activities"}
	  }
	  
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	mean_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "width": 600,
	  "description": "A graph of the distance by day of the week for all of the three most tweeted-about activities, aggregating the activities by the mean.",
	  "data": {
	    "values": tweet_data
	  },
	  "mark": {
		type: "point",
		opacity: .6,
		size: 100

	  },
	  "encoding": {
		"x": {field: "date", type: "ordinal", sort: weekday, "title": "time (day)"},
		"y": {field: "distance", "aggregate": "mean","type": "quantitative", "title": "Mean of distance"},
		"color": { field: "activityType", type: "nominal", "title": "Activities"}
	  }
	  
	};
	vegaEmbed('#distanceVisAggregated', mean_vis_spec, {actions:false});
	document.getElementById('distanceVisAggregated').style.display = "none";


	var distance_graph = document.getElementById("distanceVis");
	var mean_graph =  document.getElementById("distanceVisAggregated");

	//Change graphs at click
	document.getElementById("aggregate").addEventListener("click", function(){
		if(distance_graph.style.display == 'none'){
			distance_graph.style.display = 'block';
			mean_graph.style.display = 'none';
		} else {
			distance_graph.style.display = 'none';
			mean_graph.style.display = 'block';
		}
	});

	//Hard coded Info:
	document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";


}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});