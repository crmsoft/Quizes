'use strict';

define(['raphael'],function(Raphael){

	var hold = { }, paper;

	 Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
	    var paper = this,
	        rad = Math.PI / 180,
	        chart = this.set();
	    function sector(cx, cy, r, startAngle, endAngle, params) {
	        var x1 = cx + r * Math.cos(-startAngle * rad),
	            x2 = cx + r * Math.cos(-endAngle * rad),
	            y1 = cy + r * Math.sin(-startAngle * rad),
	            y2 = cy + r * Math.sin(-endAngle * rad);
	        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
	    }
	    var angle = 0,
	        total = 0,
	        start = 0,
	        process = function (j) {
	            var value = values[j],
	                angleplus = 360 * value / total,
	                popangle = angle + (angleplus / 2),
	                color = Raphael.hsb(start, .5, .5),
	                ms = 500,
	                delta = 30,
	                bcolor = Raphael.hsb(start, 1, 1),
	                p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3}),
	                txt = paper.text(cx + (r + delta + -5) * Math.cos(-popangle * rad), cy + (r + delta + 0) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
	            p.mouseover(function () {
	                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
	                txt.stop().animate({opacity: 1}, ms, "elastic");
	            }).mouseout(function () {
	                p.stop().animate({transform: ""}, ms, "elastic");
	                txt.stop().animate({opacity: 0}, ms);
	            });
	            angle += angleplus;
	            chart.push(p);
	            chart.push(txt);
	            start += .1;
	        };
	    for (var i = 0, ii = values.length; i < ii; i++) {
	        total += values[i];
	    }
	    for (i = 0; i < ii; i++) {
	        process(i);
	    }
	    return chart;
	};

	 hold.init = function( id,w,h ){
		paper = Raphael(id,w,h);
	}

	hold.drawMessage = function(txt,counter,x,y,fSize,i,del){
                if( ++counter < txt[i].length ){

                    paper.text( counter*x, y, txt[i][counter] )
                    .attr({fill:'blue', "font-size": fSize, opacity: 0})
                    .animate({opacity: 1}, del, function(){
                        hold.drawMessage( txt, counter, x, y, fSize, i, del );
                    });

                }else if( txt[++i] ){
                	hold.drawMessage( txt, 0, x, y*3, fSize, i, del);
                }
        };
	
	hold.bublik = function( results ){
           		var g = results.total / 100;
           		var b = results.bits * g;
           		var a = Math.abs(results.total - results.bits) * g;
           		if(a && b != 0)
           			paper.pieChart( 375, 300, 105, [a,b], ['-','+'], '#22a' );
           		else if( results.bits === results.total ){
           			succOrNot('green',results.total+"/"+results.bits);
           		}else{
           			succOrNot('red',results.total+"/0");
           		}
           		paper.text( 700,400, 'Home' )
           			.attr({fill:'white','font-size':25,'cursor':'pointer'})
           			.click(function(){ window.location.reload(); });
           	}

      function succOrNot( cl, m ){
      		var j = paper.circle( 375, 300, 105 ).attr({fill:cl});
           					paper.text( 370, 300, m ).attr({fill:'white','font-size':55,"stroke-width": 3});
           			j.stop().mouseover(function () { this.animate({transform: "s1.1 1.1 " + 375 + " " + 300 }, 750, "elastic") });
           			j.stop().mouseout(function () { this.animate({transform: "" + 375 + " " + 300 }, 750, "elastic") });
      }

     return hold;
});