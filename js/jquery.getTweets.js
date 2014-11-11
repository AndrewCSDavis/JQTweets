/*********************************************************************
*  #### Twitter Post Fetcher v9.0 ####
*  Coded by Jason Mayes 2013. A present to all the developers out there.
*  www.jasonmayes.com
*  Please keep this disclaimer with my code if you use it. Thanks. :-)
*  Got feedback or questions, ask here: 
*  http://www.jasonmayes.com/projects/twitterApi/
*  Updates will be posted to this site.
*********************************************************************/


/*********************************
Original Repo : https://github.com/jasonmayes/Twitter-Post-Fetcher
Idea to convert original JS plugin to use JQuery for better traversing of the DOM

*********************************/


(function($) {

    $.fn.gettweets = function(options) {
	
		/* set config defaults */
		options = $.extend({
			// widget id that must be grabbed from the url on creation of a twitter widget	
			/* when creating a widget in your twitter account you must grab the id from the url 
			
								"https://twitter.com/settings/widgets/ {388060813702864896} /edit" 
			
			only after creation does this id appear and work			
			
			*/
			'widgetId':'388060813702864896', 			
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
			'complete':function(){				
				var v = this.toString();				
					if(v == 'tickerrain'){
						$('#feed').find('ul').newsTicker({
							max_rows: 2,
							row_height: 85,
							speed: 600,
							direction: 'up',
							duration: 4000,
							autostart: 0,
							pauseOnHover: 0,
							prevButton:  $('#previous'),
							nextButton:  $('#next'),
						});								
					}
					if(v == 'vticker'){
						$('#feed').vTicker();		
					}
			}
		}, options);	
		/*make sure that the widget id from twitter exists and the element id exists before adding script to page*/
		if(options.widgetId != '' && options.elementId != ''){
			var script = $('<script></script>');
			script.attr('type',"text/javascript");
			script.attr('src',"//cdn.syndication.twimg.com/widgets/timelines/"+options.widgetId+"?&lang=en&callback=callback&rnd="+Math.random());
			if(options.ticker === true){
				if(options.vticker === true){
					var tickercss = $('<link/>');
					tickercss.attr('href','css/ticker-style.css');
					tickercss.attr('rel','stylesheet');
					tickercss.attr('type',"text/css");				
					var tickerjs = $('<script></script>');
					tickerjs.attr('type',"text/javascript");
					tickerjs.attr('src','js/jquery.ticker.js');
					$('head').append(tickercss);
					$('head').append(tickerjs);
				} 
				if(options.tickerrain === true){
					var raincss = $('<link/>');
					raincss.attr('href','css/font-awesome.css');
					raincss.attr('rel','stylesheet');
					raincss.attr('type',"text/css");
					var tickercss = $('<link/>');
					tickercss.attr('href','css/newsTicker-style.css');
					tickercss.attr('rel','stylesheet');
					tickercss.attr('type',"text/css");	
					
					var tickerjs = $('<script></script>');
					tickerjs.attr('type',"text/javascript");
					tickerjs.attr('src','js/jquery.newsTicker.js');					
					$('head').append(raincss);
					$('head').append(tickercss);					
					$('head').append(tickerjs);
					
				}
									
			}
			
			$('head').append(script);	
		}   		
		callback = function(e){
				
				var stream = $(e.body)[0].children[2];
				
				var list = $(stream)[0].firstElementChild;
				
				var ol = $(list)[0].children;
				var ul = $('<ul id="tweets-ticker" class="tweets"></ul>');				
				var lis = [];
				var a = 0;
				var screenname = 'https://twitter.com/'+options.findScreenName;
				
				$(ol).each(function(){
					
					var filtered = $(this).find('a.profile').attr('href');

					if(screenname == filtered || screenname == 'https://twitter.com/'){ // finds either filtered screenname tweets or all if options.findScreenName is equal to https://twitter.com
				
						
						if(a < options.amount){
							
							var li = $('<li></li>');
							var children = $(this)[0].children;						
							
							if(options.links === false && $(children).find('ul.tweet-actions').length > 0){											
								$(children).find('ul.tweet-actions').remove();							
							}
							
							if(options.retweetcounts === false && $(children).find('.stats-narrow').length > 0){																		
								var anchor = $(children).find('.stats-narrow').find('a')[0];
								$(anchor).remove();							
								$(children).find('.stats-wide').remove();
							}
							
							if(options.favouritecounts === false && $(children).find('.stats-narrow').length > 0){																		
								var anchor = $(children).find('.stats-narrow').find('a')[1];
								$(anchor).remove();							
								$(children).find('.stats-wide').remove();
							}
							
							if(options.labels === true && $(children).find('time').length > 0){
								$(children).find('time').replaceWith($(children).find('time').attr('aria-label'));
							}
							
							$.each(children,function(){
								var elements = $(this)[0].children;							
								var div = $('<div></div>');
								var author = $('<div class="author"></div>');							
								if(options.screenNameOnly === true){
										$(this).find('.p-nickname').remove();
								}else{
										$(this).find('.full-name').find('.p-name').remove();
								}
								author.append($(this).find('.profile'));														
								
								
								$.each(elements,function(){
										var tag = $(this)[0].children;
										
										
										tag = $(tag)[0];
										var tags = $(tag);
										
										if($(tag).length > 0){										
											var img = tags.find('img');											
											var images = decodeURIComponent(img.attr('data-srcset'));
											if(images != 'undefined'){																				
												images = images.split(',');
												var imgs = $(images);
												var large = imgs[0].split(' '),reg = imgs[1].split(' '),small = imgs[2].split(' ');																						
												var largeurl = large[0], regurl = reg[0], smallurl = small[0];
												if(options.imageSize == 'small'){
													img.attr('src',smallurl);
												}
												if(options.imageSize == 'medium'){
													img.attr('src',regurl);
												}
												if(options.imageSize == 'large'){
													img.attr('src',largeurl);
												}																						
											}
											
											
										}
										
										if($(this).is('.e-entry-title')){ /*controls section with entry contents*/
											var contents = $('<div class="contents"></div>');
											contents.append(this);
											div.attr('class','section contents');
											div.append(contents);
										}else	if($(this).is('.u-url')){ /*controls positioning of section with time and author*/										
											var time = $('<div class="time"></div>');										
											
											time.append(this);
											
											var datetime = new Date($(this).attr('data-datetime'));
											var hours = (datetime.getHours()< 10) ? '0'+datetime.getHours():datetime.getHours();
											var mins = (datetime.getMinutes()< 10) ? '0'+datetime.getMinutes():datetime.getMinutes();
											var seconds = (datetime.getSeconds()< 10) ? '0'+datetime.getSeconds():datetime.getSeconds();
											var buildtime = 'Time Posted: '+hours+':'+mins+':'+seconds;
											
											if(options.exactTime === true){
												var copy = time.find('.u-url').clone();
												copy.text(buildtime);
												copy.addClass('exact-time');
												time.find('.u-url').after(copy);
											}
											if(options.removeDate === false){
												div.append(time);
											}
											
											if(options.avatars === false){
												author.find('.avatar').remove();												
											}
											
											div.attr('class','section author');
											div.append(author);
										}else if($(this).is('.tweet-actions')){ /*appends all other content such as tweet actions*/
											var others = $('<div class="tweet-actions"></div>');
											others.append(this);
											div.attr('class','section tweet-actions');
											div.append(others);
										}
										
										
								});
								
								li.append(div);
							});
							ul.append(li);
						}
						a++;
					}
				});	
				var order = options.order;
				
				$('#'+options.elementId).append(ul);							
				$('#'+options.elementId).find('ul').find('li').each(function(){
						var li = $(this);
						var gettime = li.find('.time').clone();
						li.find('.time').remove();
						gettime.addClass('section');
						li.append(gettime);
						
						li.find('div').each(function(){
							var th = $(this);								
							if(th.children().length == 0){								
								th.remove();
							}							
						});
						$.each(order,function(ind,el){
							var div = li.find('div.section.'+el);
							
							if(div.length > 0){
								li.append(div);								
							}else{
								var newdiv = $('<div class="section '+el+'"></div>')
								li.append(newdiv);
							}							
							
						});
				
				});
				if(options.ticker === true){
					console.log(options.tickerrain);
					console.log(options.vticker);
					if(options.tickerrain === true){
						$('#tweets-ticker').after($('<a id="next" href="#"></a>'));
						$('#tweets-ticker').before($('<a id="previous" href="#"></a>'));
						options.complete.call('tickerrain');
					}
					if(options.vticker === true){
						options.complete.call('vticker');
					}
				}
		}
		
    }
	
}(jQuery));
