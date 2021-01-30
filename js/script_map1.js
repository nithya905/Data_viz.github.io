

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var padding = 30;

var inputValue = null;
var year = ["1939","1940","1941","1942","1943","1944","1945","1946"];


            
            


var svg = d3.select("body")
            .append("svg")
            
            .style("cursor", "move")
            .attr("width",width)
            .attr("height",height)
             ;



        
             svg.attr("viewBox", "-50 80 " + width + " " + height)
             .attr("preserveAspectRatio", "xMinYMin");


 
map= svg.append("g").attr("class","gmap") .attr("transform", "translate(0," + height/8 + ")");
;
             



var zoom = d3.zoom()
.scaleExtent([1, 2])
    .on("zoom", function () {
        var transform = d3.zoomTransform(this);
        map.attr("transform", transform);
    });

svg.call(zoom);  


 d3.queue().defer(d3.json, "world.topojson").defer(d3.csv,"map.csv").await(function (error, world, data) {
        if (error) {
            console.error('something went wrong: ' + error);
        }
        else {
            drawMap(world, data);
           
        }
        
    });


   


function drawMap (world,data){
             	

 var projection = d3.geoMercator().translate([width/2-35, height/2+25]).scale([width/6.8]);

 var path = d3.geoPath().projection(projection)
             

 var color = d3.scaleLinear()
 .domain([100, 10000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 50000000])
 .range(['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b']);
 




var countries = topojson.feature(world,world.objects.countries).features
 

 
 

     var dataById = {};

    data.forEach(function (d) {
       dataById[d.Nationality] = {
            
            death: +d.Death,
        }
 
        
    });
      


    

    countries.forEach(function (d) {
        d.details = dataById[d.properties.name] ? dataById[d.properties.name] : {};
 
         
    });



formatValue = d3.format(".2s");

map.selectAll("g")
   .data(countries)
   .enter()
   .append("path")
   .attr("class","incident")
   
   .attr("name", function (d) {
            
            return d.properties.name;

        })
   .attr("id", function (d) {
           
            return d.id;
        })
   .attr("d",path)
   
  .style("fill", function (d) {
            return d.details && d.details.death ? color(d.details.death *3) : undefined;
        })
   
   .on("mouseover", function(d){
       d3.select(this)
      .style("stroke", "white")
       .style("stroke-width", 1.5)
        .style("cursor", "pointer")

        ;

           d3.select(this).attr("class","incident hover");
formatValue = d3.format(".2s");
       d3.select(".country").text( d.properties.name);
        
        
         d3.select(".max").text(d.details && formatValue(d.details.death ) && "Total_deaths " + formatValue(d.details.death ) || "Not_avaliable");
        
        d3.select('.details')
                .style('visibility', "visible");
    })
   .on("mouseout", function(){
    d3.select(this)
                .style("stroke", null)
                .style("stroke-width", 0.25);
                d3.select(this).attr("class","incident");

            d3.select('.details')
                .style('visibility', "hidden");
      
    }); 
        
}


 function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    d3.queue().defer(d3.json, "world.topojson").defer(d3.csv,'data1/' + dataFile + '.csv').await(function (error, world, data) {
        if (error) {
            console.error(' something went wrong: ' + error);
        }
        else {
            drawMap(world, data);
        }
        
    });

}
