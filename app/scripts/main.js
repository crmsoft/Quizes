'use strict';
require.config({
  baseUrl: 'bower_components/jsx-requirejs-plugin/js/',

  paths: {
    'jquery'        : '../../jquery/dist/jquery',
    'jquery-ui'     : '../../jquery-ui/jquery-ui',
  	'raphael'	      : '../../raphael/raphael',
    'react'			    : 'react-with-addons-0.11.1',
    'JSXTransformer': 'JSXTransformer-0.11.1',
    'rafa'          : '../../../scripts/rafa',
    'conf'          : '../../../scripts/config',
    'trueFalse'     : '../../../scripts/trueFalse',
    'userInput'     : '../../../scripts/userinput',
    'choices'       : '../../../scripts/choices',
    'choicehint'    : '../../../scripts/choicehint',
    'navigation'    : '../../../scripts/navigation',
    'start'         : '../../../scripts/startpage',
    'mustache'      : '../../mustache/mustache',
  },

  jsx: {
    fileExtension: '.jsx'
  }
});

require(['jsx!start','jquery-ui'], function() {

      // velosiped ... 
    
});
