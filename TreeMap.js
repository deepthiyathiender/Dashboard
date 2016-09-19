function BuildTreeMap(data) {

    var min = 10000000000;
    var max = 0;

    var children = [];
    for(var item in data){
        children.push({
            name: SectoRatingMap["SectorID"][item],
            size: data[item]
        });

            children.sort(
                function (a, b) {
                    return b.size - a.size
                }
            );

        if(data[item] > max) max = data[item];
        if(data[item] < min) min = data[item];
    }

    debugger;
    var tree = {
        name: "tree",
        children: children.slice(0,8)
    };
    
    var innerWidth = 580;
    var innerHeight = 340;


    var colors = ["#BEE2E6", "#94C6E7", "#4FBEE3", "#008ED6", "#036E9D", "#0055A5", "#025565", "#28C7DC", "#01304A", "#00829C"];

    var width = innerWidth - 40,
        height = innerHeight - 40,
        color = d3.scale.quantize()
            .domain([min, max])
            .range(colors);

        div = d3.select("#SectorTree").append("div")
            .style("position", "relative");

    var treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function (d) {
            return d.size;
        })
        .sort(function(a,b) { return a.size - b.size; });

    var node = div.datum(tree).selectAll(".treemap")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "treemap")
        .call(position)
        .style("background-color", function (d) {
            return d.name == 'tree' ? '#000' : color(d.size);
        })
        .append('div')
        .on('click', function(d){
            // $("#ratingSector-overlay").css({"opacity": 1, "z-index": "999", "height": "300px"});
            // DisplayDendo(SectoRatingMap["Rating"][d]);
        })
        .style("font-size", function (d) {
            // compute font size based on sqrt(area)
            return Math.max(8, 0.15 * Math.sqrt(d.area)) + 'px';
        })
        .html(function (d) {
            return d.children ? null : d.name + "<br/>"+ FormatMoney(d.size);
        })
        .style("color", "#000")
        ;

    function position() {
        this.style("left", function (d) {
                return d.x + "px";
            })
            .style("top", function (d) {
                return d.y + "px";
            })
            .style("width", function (d) {
                return Math.max(0, d.dx - 2) + "px";
            })
            .style("height", function (d) {
                return Math.max(0, d.dy - 2) + "px";
            });
    }
}