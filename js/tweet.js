"use strict";
class Tweet {
    text;
    time;
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source() {
        //identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith("Just completed") || (this.text.startsWith("Just posted"))) {
            return "completed_event";
        }
        else if (this.text.startsWith("Achieved a new personal record")) {
            return "achievement";
        }
        else if (this.text.includes("#RKLive")) {
            return "live_event";
        }
        else {
            return "miscellaneous";
        }
    }
    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        //identify whether the tweet is written
        if (this.text.includes("-") && !this.text.includes("TomTom MySports Watch")) {
            return true;
        }
        ;
        return false;
    }
    get writtenText() {
        var link_text = /(https):\/\/t\.co[a-zA-Z0-9\/\-]+/;
        if (!this.written) {
            return "";
        }
        let written_text = this.text;
        //parse the written text from the tweet
        written_text = written_text.replace("#Runkeeper", "");
        written_text = written_text.replace(link_text, "");
        var delimeter = this.text.indexOf("-");
        written_text = written_text.substring(delimeter);
        written_text = written_text.trim();
        return written_text;
    }
    get activityType() {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        let activity_type = this.text;
        //Cuts out the extra stuff at the end ('-' and 'with' often come after the activity name)
        let comment_exist = activity_type.indexOf("-");
        if (comment_exist != -1) {
            activity_type = activity_type.substring(0, comment_exist);
        }
        let no_comment = activity_type.indexOf("with");
        if (no_comment != -1) {
            activity_type = activity_type.substring(0, no_comment);
        }
        //If there is a distance traveled in km mi ('mi' and 'km' often come before the activity name)
        let in_miles = activity_type.indexOf(" mi ");
        let in_km = activity_type.indexOf(" km ");
        if (in_km != -1) {
            activity_type = activity_type.substring(in_km + 3);
        }
        else if (in_miles != -1) {
            activity_type = activity_type.substring(in_miles + 3);
        }
        //If there is a time duration of the activity (activity often comes before ' in ' and after 'a' when it is a duration prompt)
        let beginning_delimeter = activity_type.indexOf(" a");
        let end_delimeter = activity_type.indexOf(" in ");
        if (in_km == -1 && in_miles == -1 && beginning_delimeter != -1 && end_delimeter != -1) {
            activity_type = activity_type.substring(beginning_delimeter + 3, end_delimeter);
            //gets rid of a or an since we trim the extra white space anyways it doesn't matter if there is an extra white space in the case that it is an "a" 
        }
        //Removes any excess whitespace
        activity_type = activity_type.trim();
        return activity_type;
    }
    get distance() {
        if (this.source != 'completed_event') {
            return 0;
        }
        var km_to_mi = 1.60934;
        //TODO: prase the distance from the text of the tweet
        let distance = this.text;
        //Cuts out the extra stuff at the end ('-' and 'with' often come after the activity name)
        let comment_exist = distance.indexOf("-");
        if (comment_exist != -1) {
            distance = distance.substring(0, comment_exist);
        }
        let no_comment = distance.indexOf("with");
        if (no_comment != -1) {
            distance = distance.substring(0, no_comment);
        }
        //If there is a time duration of the activity, if there is a duration then distance is not applicable
        let in_miles = distance.indexOf("mi");
        let in_km = distance.indexOf("km");
        let beginning_delimeter = distance.indexOf(" a");
        let end_delimeter = distance.indexOf(" in ");
        if (in_km == -1 && in_miles == -1 && beginning_delimeter != -1 && end_delimeter != -1) {
            return 0;
        }
        //looks for the first digit in distance and gets it
        let delimeter = distance.search(/\d/);
        if (delimeter != -1) {
            distance = distance.substring(delimeter);
            distance = distance.trim().split(" ")[0];
        }
        // converts distance to mi if needed
        let total_distance = 0;
        if (in_km != -1) {
            total_distance = +distance / km_to_mi;
        }
        else if (in_miles != -1) {
            total_distance = +distance;
        }
        return total_distance;
    }
    getHTMLTableRow(rowNumber) {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        if (!this.written) {
            return "";
        }
        var link_text = /(https):\/\/t\.co[a-zA-Z0-9\/\-]+/;
        let written_text = this.text;
        //finds the index of the start of link and gets only the link
        let link = this.text.substring(written_text.search(link_text));
        link = link.split(" ")[0];
        //replaces the link with an 'a' tag and 'href' to create a hyperlink
        written_text = written_text.replace(link_text, "<a href=\"" + link + "\">" + link + "</a>");
        //returns a new row of the table with the row number, activity type, and text
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + written_text + "</td></tr>";
    }
}
