'use strict'; // use save mode
////////////////////////////
//????????????????????????//
////////////////////////////
define([	
			'react',
			'jquery',
			'jsx!conf',
			'jsx!trueFalse',
			'jsx!userInput',
			'jsx!choices',
			'jsx!choicehint'
		], 
		
function( React, $, config, qType1, qType2, qType3, qType4 ){

	var row = React.createClass({

		handleClick:function(e){
			var quizType = $(e.target).attr('type');
			var renderIt;
			switch( quizType ){
				case 'trueFalse'  : renderIt = qType1; break;
				case 'userInput'  : renderIt = qType2; break;
				case 'choices'    : renderIt = qType3; break;
				case 'choiceHint' : renderIt = qType4; break;
				case 'failStop'   : renderIt = qType1; break;
				default 		  : console.log('oop what is that?');
			}

			if( renderIt ){
				config.sourceOfCurr = $(e.target).attr('src');
				
				React.renderComponent( renderIt.res, document.getElementById('page-content') );
			}
		},

		render:function(){
			var res = this.props.td.map(function(item){
					return <td 
								onClick={this.handleClick} 
								className='hand' 
								src={item.src} 
								type={item.Qtype} 
								key={Math.random()}>
								{item.name}
							</td>;
				}.bind(this));
			return(
					<tr>{res}</tr>
				);
		},
	});

	var makeGrid = React.createClass({
		render:function(){
			var res = [], src = this.props.data;

			if ( src.headers.length > 2){

				for(var i=0; i <= src.headers.length / src.perLine; i++ ){
					var from = i*src.perLine, to = i*src.perLine+src.perLine;
					res.push(<row td={src.headers.slice( from, to )} key={Math.random()} />);
				}

			}else{
				res.push(<row td={src.headers}/>);
			}	
				return(
					<tbody>
						{res}
					</tbody>
					);
		},
	});

	var obj1 = React.createClass({

		componentDidMount:function(){
			this.makeGridNice();
		},

		render:function(){
			return(
					<div className='divcenter'>
						<table>
							<makeGrid data={config.startPage} />
						</table>
					</div>
				);
		},

		makeGridNice:function(){
			// make nice !
			var l = $('.divcenter table tr:last td').length, f = $('.divcenter table tr:first td').length;
			if( l != f ){
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
	
	React.renderComponent( <obj1 />, document.getElementById('page-content') );
});