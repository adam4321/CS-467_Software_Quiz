/******************************************************************************
**  Description:  GRAPHIC PAGE - client side javascript file that handles
**                the dynamic behavior for the page
**
**  Contains:     goBack
**                buildGraphics
******************************************************************************/

/* GO BACK - Function to go back to last page ------------------------------ */
function goBack() {
    window.history.back();
}

/* BUILD GRAPHICS - Function to build graphics from job posting responses -- ******************
** 
**  JSON object details where the value of the property for times is the time in minutes
**  and the value of the property for scores is the score percentage
**  corresponding to the details of each, <percentage> and <frequency> for times and
**  scores respectively
**  ... indicates more unique properties in the below example.
**  e.g.
**  data: { times: { 0: <percentage>, 1: <percentage>, ... },
**         scores: { 90: <frequency>, 80: <frequency>, ... },
**         total_responses: 5 }
**********************************************************************************************/
function buildGraphics(data) {
    console.log(data.times);
    console.log(data.scores);
    console.log(data.total_responses);
    // set the dimensions and margins of the graph
    var width = 320
        height = 320
        margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#my_dataviz")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    var data = data.times

    // set the color scale
    var color = d3.scaleOrdinal()
    .domain(data)
    .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
    .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function(d){ return d.data.key + " min"})
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("font-size", 17)
}

/* =================== GRAPHIC DATA FETCH FUNCTION ======================== */

window.onload = function() {

    // Capture the id from the url
    const params = new URL(location.href).searchParams;
    const job_id_param = params.get('id');
    let rankings_check = document.getElementById("no-posting-txt");
    //If rankings are available generate graphics through fetch API
    if (rankings_check.innerText === ""){
        // String that holds the form data
        let data = {job_id: job_id_param}
        
        // submit a POST request
        fetch('/graphic', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
        })
        .then(response => response.json())
        .then(data => {
        
        // Use d3 to build the graphics based on responses
        buildGraphics(data.graphic_data);
        
    });
  }
    
}
