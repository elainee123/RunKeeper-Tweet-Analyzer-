function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	written_array = tweet_array.filter(t => t.written);
}


function addEventHandlerForSearch() {


	//Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener("keyup", function(e){
		const input_text = e.target.value;
		var rows = ""
		i = 1;

		for (const tweet of written_array){
			if (input_text == ""){
				document.getElementById("searchCount").innerText = "";
				document.getElementById("searchText").innerText = 0;
				document.getElementById("tweetTable").innerHTML = "";
			} else if (tweet.text.toLowerCase().includes(input_text.toLowerCase())){
				rows  += tweet.getHTMLTableRow(i)
				i += 1;
			}
		}

		document.getElementById("searchCount").innerText = i - 1;
		document.getElementById("searchText").innerText = input_text;
		document.getElementById("tweetTable").innerHTML = rows;

	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});