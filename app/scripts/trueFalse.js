'use strict'; // use save mode
////////////////////////////
//????????????????????????//
////////////////////////////

	var makeTFQ = React.createClass({displayName: 'makeTFQ',
		
		getInitialState: function() {

		    return {	
		    			view        : '<h1>Loading...</h1>',
		    			questIndex  : 0,
		    			data        : this.props.it,
		    			userAttempt : 0,
		    			userCanTry  : 0,
		    			template    : { }
		    		};
		},

		componentDidMount:function(){
			this.getQuestScelet();
		},

		refreshData:function( incoming ){
			this.setState({ data       : incoming.questions });
			this.setState({ userCanTry : incoming.canTry });
			this.getFreshTemplate();
		},

		getQuestScelet: function(){
			// here is templating ?
			$.ajax({
		        type: 'GET',
		        url: 'templates/truefalse.mst',
		        dataType: 'text',  // TypeError: this.tail.search is not a function___[Break On This Error]
		    }).success(function (template) {
		    		            this.setState({ template : template });
		    		        }.bind(this));
		},

		checkAnswer: function( answer ){
			
			this.setState({ userAttempt : (this.state.userAttempt + 1) });
			
			if( answer === this.state.data[  this.state.questIndex ].answer ){
				this.props.cntrl.setUserResult( this.state.questIndex , 1 );
				this.goToNext();
				this.interactWithUser( "up" );
			}else{
				if( this.state.userCanTry == this.state.userAttempt ){	// skip question if answer wrong 
					this.props.cntrl.setUserResult( this.state.questIndex, 0 );
					this.goToNext();
				}

				this.interactWithUser( "left" );
			}
		},

		interactWithUser:function(dir){
			$('.shake').effect( "shake", { direction: dir, times: 2, distance: 5}, 250 );
		},

		goToNext: function(){

			if( (this.state.data.length - 1) === this.state.questIndex){
				myGlobal.measureUserPerformance(this.props.cntrl.getResults());
				return;
			}

			this.setState({ userAttempt : 0 });     // new question new chances

			this.setState({ questIndex : this.state.questIndex + 1 });
			this.getFreshTemplate();
		},

		getFreshTemplate:function(){
			var scelet = Mustache.render( this.state.template, { question : this.state.data[  this.state.questIndex ].question } );
				this.setState({ view : scelet });
		},

		render:function(){
			return(React.DOM.div({dangerouslySetInnerHTML: {__html:this.state.view}}));
		}
	});
	
	
	var obj2 = React.createClass({displayName: 'obj2',

		getInitialState:function(){
			return {
					data    : [{ question:'',answer:'' }],
					control : null,
					dataLn  : 0,
				  };
		},

		componentDidMount: function() {
			this.handleAnswer();
			// pass to makeTFQ control of Navigation
			this.setState({ control:this.refs.updateNav });
			this.loadServerData();
		},
		
		loadServerData:function(){
			// check if is cookie is set ==> src of questions/file.json
			if( myGlobal.sourceOfCurr ){ 
				// load data from server
				$.get('questions/'+myGlobal.sourceOfCurr+'.json', function( result ){
					if( result.questions && result.canTry ){
						this.refs.userInput.refreshData( result );   // --force update state of a child
						this.setState({ dataLn:result.questions.length });	   // can not update this way... ?
					}else{
						alert('The JSON file is builded wrong...?');
						window.location.reload( );
					}
				}.bind(this)).fail(function( ){
					alert('Sorry but I can not load data from Server ! \nLet\'s try again later?');
					window.location.reload();
				});
			}else{
				alert('The souce of Questions not specified.\nCheck config.js for more info!!!');
				window.location.reload();
			}
		},

		handleAnswer:function(){
			$('.quest-gen').bind('click', function(e){

				if( e.target.nodeName === 'BUTTON' ){
					var res = $(e.target).text().toLowerCase();
					this.refs.userInput.checkAnswer( (res === 'false') ? false : true );	
				}

			}.bind(this));
		},

		render:function(){
			return(
					React.DOM.div(null, 
						navigation({ref: 'updateNav', total:  this.state.dataLn}), 
						React.DOM.div({className: "quest-gen"}, 
							React.DOM.div({className: "shake"}, 
								makeTFQ({it:  this.state.data, cntrl:  this.state.control, ref: 'userInput'})
							)
						)
					)
				);
		},
	});

	var truefalse = obj2(null) ;
