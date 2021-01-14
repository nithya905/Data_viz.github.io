 var margin = {top: 50, right: 50, bottom: 50, left: 50},
            width = 1200 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;
 
function bubbleChart() {
    
  
   
    var radiusScale = d3.scaleSqrt().domain([100,20045800]).range([10,100]);
    var simulation = d3.forceSimulation()
                     .force('charge', d3.forceManyBody().strength(-20))
                      .force("x",d3.forceX().strength(0.05).x(width/2))
                      .force("y",d3.forceY().strength(0.05).y(height/2))
                      .force("collide",d3.forceCollide(function (d) { return radiusScale(d.Death) +8})) 
  
      
      const fillColour = d3.scaleLinear()
      .domain([100, 10000, 50000, 100000,500000,1000000, 2500000,5000000,7700000, 16000000, 20045800])
      .range(["#fff5f0","#fee3d6","#fdc9b4","#fcaa8e","#fc8a6b","#f9694c","#ef4533","#d92723","#bb151a","#970b13","#67000d"]);
  
    function createNodes(rawData) {
      
      const myNodes = rawData.map(d => ({
        ...d,
        radius: radiusScale(+d.Death),
        Death: +d.Death,
        x: Math.random() * 2000,
        y: Math.random() * 800
      }))
  
      return myNodes;
    }
  


    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");
    
    function chart(selector, rawData) {
  
      nodes = createNodes(rawData);
  
      
      svg = d3.select(selector)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "bubble_chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top+  ")")
  
      
      const elements = svg.selectAll('.bubble')
        .data(nodes, function (d) { return d.Death })
        .enter()
        .append('g')
  
      bubbles = elements
        .append('circle')
        .classed('bubble', true)
        .attr('r', function (d) { return radiusScale(d.Death)+5 })
        .attr('fill', function (d) { return fillColour(d.Death)  })
        .on("mouseover", function(d) {
            formatValue = d3.format(".2s");
            tooltip.text(d.Nationality + ": " + formatValue(d.Death));
            tooltip.style("visibility", "visible");
    })
    .on("mousemove", function(d) {
        d3.select(this).attr("stroke","white").attr("stroke-width",3).style("cursor", "pointer");
        return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseout", function(d){
        d3.select(this).attr("stroke","black").attr("stroke-width",0.3);
        
        
        
        return tooltip.style("visibility", "hidden");});
        

      labels = elements
        .append('text')
        .classed("labels",true)
        .attr('dy', '.3em')
        .style('text-anchor', 'middle')
        .style('fill','white')
        .text(function(d){ 
    
         
            if(radiusScale(d.Death) > 25){
    
                return d.Nationality; 
    
            } else {
    
              
                return "";
            }
            
        })
       
 
      simulation.nodes(nodes)
        .on('tick', ticked)
        .restart();
    }

    function ticked() {
        bubbles
          .attr('cx', function (d) { return d.x })
          .attr('cy', function (d) { return d.y })
    
        labels
        .attr('x', function (d) { return d.x })
        .attr('y', function (d) { return d.y })
      }
  
  
    return chart;
  }
 
  let myBubbleChart = bubbleChart();
  
 
  function display(data) {
    myBubbleChart('#vis', data);
  }
  

  d3.csv('data1/bubble.csv').then(display);

