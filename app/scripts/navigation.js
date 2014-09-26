/** @jsx React.DOM */
'use strict';

	var obj3 = React.createClass({displayName: 'obj3',

		getInitialState: function() {
		    return {	
		    			data          : 'Loading...',
		    			secondsElapsed: 0,
		    			minutesElapsed: 0,
		    			userTime      : '00:00 min',
		    			onQuestion    : 1,
		    			userGuess	  : 0,
		    			totalQuestion : 0,
		    			template      : null,
		    		};
		},

		setUserResult:function( res, isScored ){

			this.setState({ onQuestion : (res+1) });
			this.setState({ userGuess  : (this.state.userGuess + isScored)  });
			// refresh UI 
			this.updateNavigation( );
		},

		getResults:function(){
			return { 
					time  : this.state.userTime,
					total : this.props.total,
					bits  : this.state.userGuess,
					};
		},

		updateNavigation:function(){
			//
			this.setState({ data :  Mustache.render( this.state.template, { 
														on    : this.state.onQuestion, 
														total : this.props.total,
														guess : this.state.userGuess,
														time  : this.state.userTime
													  })
						});
		},

		tick: function() {

			// one more second
		    this.setState( {secondsElapsed: this.state.secondsElapsed + 1} );

		    // if minut pass
		    if( this.state.secondsElapsed == 60 ){
		    	this.setState( {minutesElapsed: this.state.minutesElapsed + 1} );
		    	this.setState( {secondsElapsed: 0} );
		    } 
		    // set updated time 
		    this.setState({ userTime: (("0"+ this.state.minutesElapsed ).slice(-2) + ':' + ("0"+ this.state.secondsElapsed).slice(-2) + ' min') });
		    // show user fresh info 
		    this.updateNavigation( );

		},

		componentDidMount: function() {
			// "GET" navigation template & set def
			this.getUserNavigation();
			// run time
			this.interval = setInterval(this.tick, 999);
		},

		getUserNavigation: function(){
			// here is templating ?
			$.ajax({
		        type: 'GET',
		        url: 'templates/navigation.mst',
		        dataType: 'text',  // !important
		    }).success(function(template){
				var res = Mustache.render( template, { 
														on    : this.state.onQuestion, 
														total : this.state.totalQuestion,
														guess : this.state.userGuess,
														time  : this.state.userTime,
													  } );

				this.setState({ data     : res      });
				this.setState({ template : template });

			}.bind(this));
		},

		componentWillUnmount: function() {
			// clear on unset
		    clearInterval(this.interval);
		},

		render:function(){
						  // by def react escaping html tags 
						  // so to set template need to say to not escape given...
						  // when ever the state of data var is changed 
						  // the component will be rerendered...
			return ( React.DOM.div({dangerouslySetInnerHTML: {__html: this.state.data}}) );
		},
	});

	var navigation = obj3;