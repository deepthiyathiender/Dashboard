function DisplayDendo(data, type) {
    debugger;

    var creditMap = {};
    var ratingMap = {};
    var cptyMapRating = {};
    var secMap = {};
    var cptyMapSector = {};
    var treeData = [];

    queue()
        .defer(d3.csv, "https://raw.githubusercontent.com/deepthiyathiender/Dendograms/master/creditLimit.csv", function (data) {
            if (!(data["Coverage-Counterparty"] in creditMap)) {
                creditMap[data["Coverage-Counterparty"]] = {
                    name: data["Coverage-Counterparty"],
                    rating: data.Rating,
                    alloc: data.Allocation,
                    "product-exp": []
                };

                creditMap[data["Coverage-Counterparty"]]["product-exp"].push(data["Product Exposure"]);
            }
            else {
                creditMap[data["Coverage-Counterparty"]]["product-exp"].push(data["Product Exposure"]);
            }


            if (!(data["Rating"] in ratingMap)) {

                ratingMap[data["Rating"]] = [];

                ratingMap[data["Rating"]].push(creditMap[data["Coverage-Counterparty"]]);
                cptyMapRating[creditMap[data["Coverage-Counterparty"]].name] = "";
            }
            else {
                if (!([data["Coverage-Counterparty"]][0] in cptyMapRating)) {
                    ratingMap[data["Rating"]].push(creditMap[data["Coverage-Counterparty"]]);
                    cptyMapRating[creditMap[data["Coverage-Counterparty"]].name] = "";
                }
            }

            if (!(data["Sector"] in secMap)) {

                secMap[data["Sector"]] = [];

                secMap[data["Sector"]].push(creditMap[data["Coverage-Counterparty"]]);
                cptyMapSector[creditMap[data["Coverage-Counterparty"]].name] = "";

            }
            else {
                if (!([data["Coverage-Counterparty"]][0] in cptyMapSector)) {
                    secMap[data["Sector"]].push(creditMap[data["Coverage-Counterparty"]]);
                    cptyMapSector[creditMap[data["Coverage-Counterparty"]].name] = "";
                }
            }
        })
        .await(function(){
            switch(type) {
                case "Rating":

                    var cptys = [];

                    for (cpty in ratingMap[data]) {
                        var exps = [];

                        for (exp in ratingMap[data][cpty]["product-exp"]) {


                            var newExp;
                            switch (ratingMap[data][cpty]["product-exp"][exp]) {
                                case "PE_IRS":
                                case "PE_IRS1":
                                    newExp = "IRS Deals";
                                    break;
                                case "PE_BND":
                                case "PE_BND1":
                                    newExp = "Bonds";
                                    break;
                                case "PE_EQU":
                                case "PE_EQU1":
                                    newExp = "Equities";
                                    break;
                                case "PE_FXS":
                                case "PE_FXS1":
                                    newExp = "FX Swaps";
                                    break;
                                case "PE_FXO":
                                case "PE_FXO1":
                                    newExp = "Fx OTC Deals";
                                    break;
                                case "PE_LD":
                                case "PE_LD1":
                                    newExp = "L&D Deals";
                                    break;
                            }


                            exps.push({
                                "name": newExp,
                                "parent": ratingMap[data][cpty].name
                            })
                        }


                        cptys.push({
                            "name": ratingMap[data][cpty].name,
                            "parent": data,
                            "alloc": parseInt(ratingMap[data][cpty].alloc.replace(/,/g, "").replace(/ /g, "")),
                            "children": exps
                        })
                    }

                    treeData = [
                        {
                            "name": data,
                            "parent": "null",
                            "children": cptys
                        }
                    ];

                    break;

                case "Sectors":

                    var cptysSec = [];

                    for (cpty in secMap[data]) {
                        var expsSec = [];

                        for (exp in secMap[data][cpty]["product-exp"]) {


                            var newExpSec;
                            switch (secMap[data][cpty]["product-exp"][exp]) {
                                case "PE_IRS":
                                case "PE_IRS1":
                                    newExpSec = "IRS Deals";
                                    break;
                                case "PE_BND":
                                case "PE_BND1":
                                    newExpSec = "Bonds";
                                    break;
                                case "PE_EQU":
                                case "PE_EQU1":
                                    newExpSec = "Equities";
                                    break;
                                case "PE_FXS":
                                case "PE_FXS1":
                                    newExpSec = "FX Swaps";
                                    break;
                                case "PE_FXO":
                                case "PE_FXO1":
                                    newExpSec = "Fx OTC Deals";
                                    break;
                                case "PE_LD":
                                case "PE_LD1":
                                    newExpSec = "L&D Deals";
                                    break;
                            }


                            expsSec.push({
                                "name": newExpSec,
                                "parent": secMap[data][cpty].name
                            })
                        }


                        cptysSec.push({
                            "name": secMap[data][cpty].name,
                            "parent": data,
                            "alloc": parseInt(secMap[data][cpty].alloc.replace(/,/g, "").replace(/ /g, "")),
                            "children": expsSec
                        })
                    }

                    treeData = [
                        {
                            "name": SectoRatingMap.SectorID[data],
                            "parent": "null",
                            "children": cptysSec
                        }
                    ];
                    break;
            }


            // -------------------- DRAW TREE ----------------------


            var margin = {top: 70, right: 20, bottom: 20, left: 90},
                width = 500 - margin.right - margin.left,
                height = 200 - margin.top - margin.bottom;

            var i = 0,
                duration = 750,
                root;

            var tree = d3.layout.tree()
                .size([height, width]);

            var diagonal = d3.svg.diagonal()
                .projection(function (d) {
                    return [d.y, d.x];
                });

            var svg = d3.select("#tree").append("svg")
                .attr("width", width)
                .attr("height", 300)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            debugger;
            
            
            treeData = [
                treeData[0]
            ];

            root = treeData[0];
            root.x0 = height / 0.4;
            root.y0 = 0;

            update(root);
            collapseAll();

            d3.select(self.frameElement).style("height", "300px");

            function update(source) {

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                nodes.forEach(function (d) {
                    d.y = d.depth * 100;
                });

                // Update the nodes…
                var node = svg.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id || (d.id = ++i);
                    });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                    })
                    .on("click", click);

                nodeEnter.append("circle")
                    .attr("r", 8)
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });

                nodeEnter.append("text")
                    .attr("x", function (d) {
                        return d.children || d._children ? -13 : 13;
                    })
                    .attr("dy", ".25em")
                    .attr("text-anchor", function (d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function (d) {
                        return d.name;
                    })
                    .style("fill-opacity", 1e-5);

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });

                nodeUpdate.select("circle")
                    .attr("r", 8)
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + source.y + "," + source.x + ")";
                    })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 8);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the links…
                var link = svg.selectAll("path.link")
                    .data(links, function (d) {
                        return d.target.id;
                    });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function (d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function (d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            function click(d) {

                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }

                d.highlight = true;
                update(d);
            }

            function collapse(d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            }

            function collapseAll() {
                root.children.forEach(collapse);
                collapse(root);
                update(root);
            }
        });

}