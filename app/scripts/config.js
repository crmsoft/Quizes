/** @jsx React.DOM */
'use strict';

	var myGlobal = {
			startPage   : { },
			conclusions : { },
			sourceOfCurr: ' ',
			userResult  : { }
	};

	//________________________________________________________________________________________________________________
	//================================================================================================================|
	//	     [head 1]	[head 2]   ==> perLine 2 																	  |
	//----------------------------------------------------------------------------------------------------------------|
	//	     [head 1]	 																							  |
	//		 [head 2]  			   ==> perLine 1 																	  |
	//================================================================================================================|
	//       Qtype : trueFalse     ==> user have 2 choices ['true','false'] 										  |
	//----------------------------------------------------------------------------------------------------------------|
	//       Qtype : userInput     ==> user types in input, not case sensetive "AA==aa" is true 					  |
	//----------------------------------------------------------------------------------------------------------------|
	//       Qtype : choices       ==> user have 4 choices ['ch1','ch2','ch3','ch4']								  |
	//----------------------------------------------------------------------------------------------------------------|
	//       Qtype : choiceHint    ==> same as choices but there will be one more button - on click hint will be shown|
	//----------------------------------------------------------------------------------------------------------------|
	//       Qtype : failStop      ==> same as trueFalse but on fail quiz will stop...								  |
	//================================================================================================================|
	//  	 src is JSON file that located in app/questions/fileName.json 	=> src:'filename'						  |
	//----------------------------------------------------------------------------------------------------------------|
	//		 to learn how to build json file see app/questions/example.json 										  |
	//================================================================================================================|
	//________________________________________________________________________________________________________________|

	  myGlobal.startPage = {
					        'headers' : [
							                { name:'Mixed',	   Qtype:'trueFalse',  src:'truefalse'  },
							                { name:'Math' 	 , Qtype:'userInput',  src:'userinput'	},
							                { name:'Science' , Qtype:'choices',	   src:'choices'	},
							                { name:'History' , Qtype:'choiceHint', src:'choicehint'	},
							                { name:'True or False',	    Qtype:'trueFalse',  src:'true'}
					              		],
					        'perLine' : 2,
					       };

	   


	myGlobal.measureUserPerformance = function( results ) {

		if( ! results ){
			alert('Error !');
			window.location.reload();
		}		
		

		var userChart = React.createClass({displayName: 'userChart',

		componentDidMount:function(){
			$('body').css('background','#666');
		},

		render:function(){
			return( 
					React.DOM.div(null, 
						React.DOM.div({className: "res-banner"}, 
							React.DOM.h1(null, "Test Results !!!")
						), 
						React.DOM.div({className: "quest-gen", id: "user-chart"}
							
						)
					)
					);
			},
		});

		React.renderComponent( userChart(null), document.getElementById('page-content') );



			var message = [],mDelay = 50,bDelay = 750;
			message.push(' You did it in ' + results.time + 'ute');
			message.push(' You have scored ' + results.bits + ' from ' + results.total);

			for(var y in message){
				bDelay += message[y].length * mDelay;
			}

			myRafa.init('user-chart',750,450);
            myRafa.drawMessage(message, 0,26,40,50,0,mDelay);
            console.log(bDelay);
            setTimeout(function() { myRafa.bublik( results ); }, bDelay );

           	
           	
	}
