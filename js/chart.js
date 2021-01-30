
var margin = {top: 50, right: 20, bottom: 58, left: 50},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var svg = d3.select("#stack").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top+ ")")
    ;  

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width+40], 0.40);

var y = d3.scale.linear()
    .rangeRound([height, 0],);

    var color = d3.scale.ordinal()
    .range(["#d25c4d", "#f2b447", "#008000"]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left",)
    .tickFormat(d3.format(".2s"));

    



        svg.append('text')
      .attr('x', -250)
      .attr('y', -25)
      .attr('class', 'label1')
      .text('Civilians Deaths')
      .style("font-size",18)
      .style("fill","white")
      .attr("transform", "rotate(-90)");


    var active_link = "0"; 
var legendClicked; 
var legendClassArray = []; 
var y_orig; 


d3.csv("data1/Casualties-bar1.csv", function(error, data) {
  if (error) throw error;


  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

 data.forEach(function(d) {
    var mystate = d.State;
    
    
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {mystate:mystate, name: name, y0: y0, y1: y0 += +d[name]}; });
    
    d.total = d.ages[d.ages.length - 1].y1;
   

  });

 data.sort(function(a, b) { return b.total - a.total; });
 

  x.domain(data.map(function(d) { return d.State ; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);
   
 




 var gXAxis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height)+ ")")
    .call(xAxis);



 gXAxis.selectAll("text")
    .style("text-anchor", "end")
    .attr("x", 6)
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-35)")
    .style("font-size",10)
    ;


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .attr("transform", "translate(" + (margin.left-30) + ",0)")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");


 var state = svg.selectAll(".state")
      .data(data)
    .enter()
    .append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + "0" + ",0)"; });

 
 
state.selectAll("rect")
      .data(function(d) {
        return d.ages; 
      })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("x",function(d) { 
          return x(d.mystate)
        })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .attr("class", function(d) {
        classLabel = d.name.replace(/\s/g, ''); 
        return "class" + classLabel;
      })
      .style("fill", function(d) { return color(d.name); });

      


      state.selectAll("rect")
       .on("mouseover", function(d){

          var delta = d.y1 - d.y0;
          var xPos = parseFloat(d3.select(this).attr("x"));
          var yPos = parseFloat(d3.select(this).attr("y"));
          var height = parseFloat(d3.select(this).attr("height"));

         d3.select(this).attr("stroke","white").attr("stroke-width",2).style("cursor", "pointer");
         
       
         formatValue = d3.format(".2s");
        svg.append("text")
          
          .attr("x",xPos)
          .attr("y",yPos-10)
          .attr("class","tooltip")
          .transition()
          
          .text(formatValue(delta));
      
     

         
          
       })
       .on("mouseout",function(){
          svg.select(".tooltip").remove();
          d3.select(this).attr("stroke","black").attr("stroke-width",0.3);
                                
        });


  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      //.attr("class", "legend")
      .attr("class", function (d) {
        legendClassArray.push(d.replace(/\s/g, '')); 
        return "legend";
      })
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
   
  legendClassArray = legendClassArray.reverse();

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18) 
      .attr("height", 18)
      .style("fill", color)
      .attr("id", function (d, i) {
        return "id" + d.replace(/\s/g, '');
      })
      .on("mouseover",function(){        

        if (active_link === "0") d3.select(this).style("cursor", "pointer");
        else {
          if (active_link.split("class").pop() === this.id.split("id").pop()) {
            d3.select(this).style("cursor", "pointer");
          } else d3.select(this).style("cursor", "auto");
        }
      })
      .on("click",function(d){        

        if (active_link === "0") { 
          d3.select(this)           
            .style("stroke", "white")
            .style("stroke-width", 2);

            active_link = this.id.split("id").pop();
            plotSingle(this);

          
            for (i = 0; i < legendClassArray.length; i++) {
              if (legendClassArray[i] != active_link) {
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 0.5);
              }
            }
           
        } else { 
          if (active_link === this.id.split("id").pop()) {
            d3.select(this)           
              .style("stroke", "none");

            active_link = "0"; 

           
            for (i = 0; i < legendClassArray.length; i++) {              
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 1);
            }

           
            restorePlot(d);

          }

        } 
                          
                                
      });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("fill","white")
      .style("font-size",12) 
      .text(function(d) { return d; });

  function restorePlot(d) {

    state.selectAll("rect").forEach(function (d, i) {      
     
      d3.select(d[idx])
        .transition()
        .duration(1000)        
        .attr("y", y_orig[i]);
    })

    
    for (i = 0; i < legendClassArray.length; i++) {
      if (legendClassArray[i] != class_keep) {
        d3.selectAll(".class" + legendClassArray[i])
          .transition()
          .duration(1000)
          .delay(250)
          .style("opacity", 1);
      }
    }

  }

  function plotSingle(d) {
        
    class_keep = d.id.split("id").pop();
    idx = legendClassArray.indexOf(class_keep);    
   
   
    for (i = 0; i < legendClassArray.length; i++) {
      if (legendClassArray[i] != class_keep) {
        d3.selectAll(".class" + legendClassArray[i])
          .transition()
          .duration(1000)          
          .style("opacity", 0);
      }
    }

    y_orig = [];
    state.selectAll("rect").forEach(function (d, i) {        
    
      h_keep = d3.select(d[idx]).attr("height");
      y_keep = d3.select(d[idx]).attr("y");
    
      y_orig.push(y_keep);

      h_base = d3.select(d[0]).attr("height");
      y_base = d3.select(d[0]).attr("y");    

      h_shift = h_keep - h_base;
      y_new = y_base - h_shift;

     
      d3.select(d[idx])
        .transition()
        .ease("bounce")
        .duration(1000)
        .delay(250)
        .attr("y", y_new);
   
    })    
   
  } 


/*--------------------------------------------------------------------------------------*/


    var margin1 = {top: 45, right: 50, bottom: 80, left:40};
   width1 = 800 - margin1.left - margin1.right;
    height1 = 550 - margin1.top - margin1.bottom;

var svg1 = d3.select("#scatter_and_pie").append("svg")
    .attr("class","scatter")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top*2 + ")")
    ;  

    

    var xScale = d3.scale.linear()
    .rangeRound([margin1.left, width1 - margin1.right]);


var yScale = d3.scale.linear()
    .rangeRound([height1, 0]);

var radius = d3.scale.sqrt()
    .range([5,14]);

     svg1.append('text')
      .attr('x', -250)
      .attr('y', -25)
      .attr('class', 'label1')
      .text('Total  Deaths')
      .style("font-size",18)
      .style("fill","white")
      .attr("transform", "rotate(-90)");

var xAxis1 = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5)
    .tickFormat(function(d) {
    return  d
});

var yAxis1 = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickFormat(d3.format(".2s"));




       



    var colors = d3.scale.ordinal()
    .range(["#40FFFF"/*, "#73A5C6","#528AAE","#2E5984","#1E3F66"*/]);
    



    d3.csv("data1/WW2_scatter2.csv", function(error, data1){
    
        if (error) throw error;
    data1.forEach(function(d){
       d.DeathsFinal = +d.DeathsFinal;
       d.years= +d.year;

    
      
    });
 
xScale.domain(d3.extent(data1, function(d){  return  d.years  ;  })).nice()



yScale.domain(d3.extent(data1, function(d){ return d.DeathsFinal; })).nice();

radius.domain(d3.extent(data1, function(d){ return d.DeathsFinal; })).nice(); 

/*.domain([0, d3.max(dataset, function(d) { return d[0]; })])
*/


      svg1.append('g')

      .attr('class', 'x axis1')
      .attr('transform', 'translate(0,' + ( height1-margin1.bottom+85) + ')')

       .call(xAxis1);
        
    // y-axis is translated to (0,0)
    svg1.append('g')
      
      .attr('class', 'y axis1')
      .call(yAxis1)

      .attr("transform", "translate(" + (margin.left-30) + ",0)");
      
     var div = d3.select("body").append("div")
      .attr("class", "tooltip1")
      .style("opacity", 0);

   svg1.selectAll('.bubble')
      .data(data1)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', function(d){return xScale(d.years);})
      .attr('cy', function(d){ return yScale(d.DeathsFinal); })
      .attr('r', function(d){ return radius(d.DeathsFinal ); })
      .style('fill', function(d){ return colors(d.DeathsFinal); })
      .on("mouseover",function(d) { 
        formatValue = d3.format(".2s");
         d3.select(this).attr("stroke","white").attr("stroke-width",2).style("cursor", "pointer");
         div.transition()
               .duration(100)
               .style("opacity", 1)
         div.html( formatValue(d.DeathsFinal))
         .style("left", (d3.event.pageX + 10) + "px")
         .style("top", (d3.event.pageY - 15) + "px"); })
      .on("mouseout",function(){
         
          d3.select(this).attr("stroke","black").attr("stroke-width",0.3);
          div.style("opacity", 0)
                                
        });
})



 



});


