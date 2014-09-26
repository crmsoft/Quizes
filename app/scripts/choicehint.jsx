'use strict'; // use save mode
////////////////////////////
//????????????????????????//
////////////////////////////
define(['react','mustache','jsx!navigation', 'jsx!conf'], function(React,Mustache,Navigation,Conf){


	var makeCHQ = React.createClass({
		
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

		showHint:function( e ){
			e.preventDefault();

			$('.tooltip-hint').toggle();
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
		        url: 'templates/choicehint.mst',
		        dataType: 'text',  // TypeError: this.tail.search is not a function___[Break On This Error]
		    }).success(function (template) {
		    		            this.setState({ template : template });
		    		        }.bind(this));
		},

		checkAnswer: function( e ){

			var answer = $(e.target).text().toLowerCase();

			this.setState({ userAttempt : (this.state.userAttempt + 1) });
			
			if( answer === this.state.data[  this.state.questIndex ].answer ){
				this.goToNext();
				this.props.cntrl.setUserResult( this.state.questIndex, 1 );
				this.interactWithUser( "up" );
			}else{
				if( this.state.userCanTry <= this.state.userAttempt ){	// skip question if answer wrong 
					this.goToNext();
					this.props.cntrl.setUserResult( this.state.questIndex, 0 );
				}

				this.interactWithUser( "left" );
			}
		},

		interactWithUser:function(dir){
			$('.shake').effect( "shake", { direction: dir, times: 2, distance: 5}, 250 );
		},

		goToNext: function(){

			if( (this.state.data.length - 1) === this.state.questIndex){
				Conf.measureUserPerformance(this.props.cntrl.getResults());
				return;
			}

			this.setState({ userAttempt : 0 });     // new question new chances

			this.setState({ questIndex : this.state.questIndex + 1 });
			this.getFreshTemplate();
		},

		getFreshTemplate:function(){
			var scelet = Mustache.render( this.state.template, { 
																question : this.state.data[  this.state.questIndex ].question,
																ch1      : this.state.data[  this.state.questIndex ].choices[0] || '?',
																ch2      : this.state.data[  this.state.questIndex ].choices[1] || '?',
																ch3      : this.state.data[  this.state.questIndex ].choices[2] || '?',
																ch4      : this.state.data[  this.state.questIndex ].choices[3] || '?',
																hint     : this.state.data[  this.state.questIndex ].hint || 'think'
															} );
				this.setState({ view : scelet });
		},

		render:function(){
			return(<div dangerouslySetInnerHTML={{__html:this.state.view}}></div>);
		}
	});
	
	
	var obj5 = React.createClass({

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
			if( Conf.sourceOfCurr ){ 
				// load data from server
				$.get('questions/'+Conf.sourceOfCurr+'.json', function( result ){
					if( result.questions && result.canTry ){
						this.refs.userInput.refreshData( result );   // --force update state of a child
						this.setState({ dataLn:result.questions.length });	   // can not update this way... ?
					}else{
						alert('The JSON file is builded wrong...?');
						//window.location.reload( );
					}
				}.bind(this)).fail(function( a,b ){
					//alert('Sorry but I can not load data from Server ! \nLet\'s try again later?');
					console.log(a,b);
					//window.location.reload();
				});
			}else{
				alert('The souce of Questions not specified.\nCheck config.js for more info!!!');
				window.location.reload();
			}
		},

		handleAnswer:function(){
			$('.quest-gen').bind('click', function(e){

				if( e.target.nodeName === 'BUTTON' ){
					this.refs.userInput.checkAnswer( e );	
				}else if( e.target.nodeName === 'A' ){
					this.refs.userInput.showHint( e );
				}

			}.bind(this));
		},

		render:function(){
			return(
					<div>
						<Navigation.res ref={'updateNav'} total={ this.state.dataLn } />
						<div className='quest-gen' >
							<div className='shake'>
								<makeCHQ it={ this.state.data } cntrl={ this.state.control } ref={'userInput'}/>
							</div>
						</div>
					</div>
				);
		},
	});

	return { res : <obj5 /> };
	

});