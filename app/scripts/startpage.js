/** @jsx React.DOM */
'use strict'; // use save mode
////////////////////////////
//????????????????????????//
////////////////////////////
		
	var row = React.createClass({displayName: 'row',

		handleClick:function(e){
			var quizType = $(e.target).attr('type');
			var renderIt;
			switch( quizType ){
				case 'trueFalse'  : renderIt = truefalse;  break;
				case 'userInput'  : renderIt = userinput;  break;
				case 'choices'    : renderIt = choice;     break;
				case 'choiceHint' : renderIt = choicehint; break;
				default 		  : console.log('oop what is that?');
			}

			if( renderIt ){
				myGlobal.sourceOfCurr = $(e.target).attr('src');
				
				React.renderComponent( renderIt, document.getElementById('page-content') );
			}
		},

		render:function(){
			var res = this.props.td.map(function(item){
					return React.DOM.td({
								onClick: this.handleClick, 
								className: "hand", 
								src: item.src, 
								type: item.Qtype, 
								key: Math.random()}, 
								item.name
							);
				}.bind(this));
			return(
					React.DOM.tr(null, res)
				);
		},
	});

	var makeGrid = React.createClass({displayName: 'makeGrid',
		render:function(){
			var res = [], src = this.props.data;

			if ( src.headers.length > 2){

				for(var i=0; i <= src.headers.length / src.perLine; i++ ){
					var from = i*src.perLine, to = i*src.perLine+src.perLine;
					res.push(row({td: src.headers.slice( from, to), key: Math.random()}));
				}

			}else{
				res.push(row({td: src.headers}));
			}	
				return(
					React.DOM.tbody(null, 
						res
					)
					);
		},
	});

	var obj1 = React.createClass({displayName: 'obj1',

		componentDidMount:function(){
			this.makeGridNice();
		},

		render:function(){
			return(
					React.DOM.div({className: "divcenter"}, 
						React.DOM.table(null, 
							makeGrid({data: myGlobal.startPage})
						)
					)
				);
		},

		makeGridNice:function(){
			// make nice !
			var l = $('.divcenter table tr:last td').length, f = $('.divcenter table tr:first td').length;
			if( l !== f ){
				if( ( f-l ) > 1 && l > 1 ){
					$('.divcenter table tr:last').find(':last-child').attr('colspan',2);
					$('.divcenter table tr:last').find(':first-child').attr('colspan',2);
				}else{
				 	$('.divcenter table tr:last').find(':last-child').attr('colspan',1+(f-l));
				}
			}
			// ____________
		},
	});
	
	React.renderComponent( obj1(null), document.getElementById('page-content') );
