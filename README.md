JQTweets
========

a Jquery implementation of Jason Mayes Twitter Post Fetcher, with more options for displaying as a ticker, as well as changing what content to display per tweet


basic initialisation:

	<div id="feed" class=""></div>
	
	$('#feed').gettweets();
	
	there are more options avaiable to change what you see for instance
	
	$('#feed').gettweets({
			'widgetId':'', /* 18 numeric value from the url */			
				// element id of the container of all the tweets
				'elementId':'feed', 			
				// maximum amounts tweets retrieved is 20 at any one time
				'amount':20, 
				// relevant to posts that contain images
				'imageSize':'large', 
				// show the amount retweets there are
				'retweetcounts':true, 
				// show the amount of times a favourite action has happened
				'favouritecounts':true, 
				// change date of 07 Nov to Posted on 07 Nov
				'labels':true, 
				// allow 'Reply' , 'Retweet' and 'Favourite' links to appear
				'links':true, 
				// show the exact time when the tweet was tweeted
				'exactTime':true, 
				// removes the entire time and date string fromt he DOM 
				'removeDate':false, 
				// removes any avatar images from the DOM			
				'avatars':true, 
				/* the order of the structure of the tweet to be displayed
					For instance 
					Dom Structure produced is like this:
					<li>
						<div class="section author">{contains the authors name and screen name}</div>
						<div class="section time">{contains the time and date of when the tweet was posted}</div>
						<div class="section contents">{contains the actual body content of the tweet}</div>
						<div class="section tweet-actions">{Contains the links for the counts of retweets, favourites and each of the reply, tweet and favourite this tweet links }</div>
					</li>				
					and they can be rearranged by changing the order in the array
				*/
				'order':['author','time', 'contents','tweet-actions'], 
				// changes the username that is displatyed by default to the screen name
				'screenNameOnly':true, 
				// allows filtering of the tweets to get by a screen name
				'findScreenName':'', 
				// allows you to place the tweets in a ticker mechanism created by  https://github.com/rhodimus or  https://github.com/rhodimus/jQuery-News-Ticker 			
				'ticker':false, 
				/*vTicker function to init after DOM Produced */
				'vtickercomplete':false,
				/*rain Ticker function to init after DOM Produced */
				'tickerraincomplete':false,			
		});	
