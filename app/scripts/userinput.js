'use strict';
////////////////////////////
//????????????????????????//
////////////////////////////
	var makeUIQ = React.createClass({displayName: 'makeUIQ',

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
		        url: 'templates/userinput.mst',
		        dataType: 'text',  // TypeError: this.tail.search is not a function___[Break On This Error]
		    }).success(function (template) {
		    		            this.setState({ template : template });
		    		        }.bind(this));
		},

		checkAnswer: function( ){

			this.setState({ userAttempt : (this.state.userAttempt + 1) });

			var answer = $('.userinput').val().toLowerCase().trim();
			console.log(answer + " == " + this.state.data[  this.state.questIndex ].answer.toLowerCase());
			if( answer === this.state.data[  this.state.questIndex ].answer.toLowerCase() ){
				this.goToNext();
				this.props.cntrl.setUserResult( this.state.questIndex, 1 );
				this.interactWithUser( "up" );
			}else{
				if( this.state.userCanTry == this.state.userAttempt ){	// skip question if answer wrong 
					this.goToNext();
					this.props.cntrl.setUserResult( this.state.questIndex, 0 );
				}

				this.interactWithUser( "left" );
			}
		},

		interactWithUser:function(dir){
			$('.shake').effect( "shake", { direction: dir, times: 2, distance: 5}, 250 );
		},

		getFreshTemplate:function(){
			var rendered = Mustache.render( this.state.template, { question : this.state.data[  this.state.questIndex ].question } );
				this.setState({ view : rendered });
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

		render:function(){
			return(
					React.DOM.div({dangerouslySetInnerHTML: {__html:this.state.view}})
				);
		}
	});


	var obj4 = React.createClass({displayName: 'obj4',

		getInitialState:function(){
			return {
					data    : [{ question:'',answer:'' }],
					control : null,
					dataLn  : 0,
				  };
		},

		componentDidMount: function() {
			this.handleAnswer();
			this.setState({ control:this.refs.updateNav });
			this.loadServerData();
		},

		loadServerData:function(){
			// check if is var is set ==> src of questions/file.json
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
			$('.quest-gen').bind('click keydown', function(e){
						// pressed enter key or submit button check answer !
				if( e.target.nodeName === 'BUTTON' || ((e.keyCode || e.which) === 13)){
					this.refs.userInput.checkAnswer(  );	
				}

			}.bind(this));
		},

		render:function(){
			return(
					React.DOM.div(null, 
						navigation({ref: 'updateNav', total:  this.state.dataLn}), 
						React.DOM.div({className: "quest-gen"}, 
							React.DOM.div({className: "shake"}, 
								makeUIQ({it:  this.state.data, cntrl:  this.state.control, ref: 'userInput'})
							)
						)
					)
					);
		}
	});

	var userinput = obj4(null)