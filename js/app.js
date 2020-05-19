(function () {
    let map;
    let maplayer;
    let drops;
    let objectives;
    let highlight;
    let dropZone;
    let elementCount = 0;
    let slider;
    let german_7;
    let day = 6;
    let tiles = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: ''
        });

    map = L.map('map')
        .addLayer(tiles)
        .setView([49.41542647972486, -1.262730877610028], 7);

    map.on('click', function (e) {
        console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    });

    //create legend
    // create a Leaflet control for the legend
    const legendControl = L.control({
        position: 'bottomleft'
    });

    // when the control is added to the map
    legendControl.onAdd = function (map) {

        // create a new division element with class of 'legend' and return
        let legend = L.DomUtil.create('div', 'legend');
        // disable scrolling of map while using controls
        L.DomEvent.disableScrollPropagation(legend);

        // disable click events while using controls
        L.DomEvent.disableClickPropagation(legend);

        return legend;

    };

    // add the legend control to the map
    legendControl.addTo(map);

    legend = $('.legend').html(
        "<h3 class = 'h3Time'>June 6th 00:00 Hours</h3><div id = 'content' style = 'padding-top: 8px;'>June 6th 1944 The 502nd PIR left RAF Membury/Greenham Common for Drop Zone A, Southwest of Utah Beach in Nazi occupied Normandy.</div>"
    );

    function addObjectiveMarkers() {
        d3.json('data/d_day_objectives.json', function (error, collection) {
            if (error) {
                console.log(error);
            }
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "yellow",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            objectives = L.geoJson(collection, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map).bringToFront();

            objectives.eachLayer(function (layer) {

                const props = layer.feature.properties;

                // set the fill color of layer based on its normalized data value


                //on mouse over
                layer.on('mouseover', function () {
                    //change stroke color and bring to front
                    layer.setStyle({
                        color: '#FFFF00'
                    }).bringToFront();
                });
                //mouse off
                layer.on('mouseout', function () {
                    //reset the layer style
                    layer.setStyle({
                        color: '#000'
                    });
                });

                let content =
                    `<div><b>Objective: #${props.id} ${props.name}</b></div>`;
                layer.bindTooltip(content);


            });

        })
    }

    function addDrops() {
        d3.json('data/drops.geojson', function (error, collection) {
            if (error) {
                console.log(error);
            }
            var geojsonMarkerOptions = {
                radius: 4,
                fillColor: "#0000FF",
                color: "#20282e",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            drops = L.geoJson(collection, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);

            drops.eachLayer(function (layer) {

                //on mouse over
                layer.on('mouseover', function () {
                    //change stroke color and bring to front
                    layer.setStyle({
                        color: '#FFFF00'
                    }).bringToFront();
                });
                //mouse off
                layer.on('mouseout', function () {
                    //reset the layer style
                    layer.setStyle({
                        color: '#20282e'
                    });
                });

                layer.bindTooltip('502nd Drop Location');


            });

        })
    }

    function addDropZone() {
        d3.json('data/original_drop_zone.geojson', function (error, collection) {
            if (error) {
                console.log(error);
            }


            function areaStyle(feature) {
                return {
                    fillColor: "#0EBFE9",
                    weight: 2,
                    opacity: 1,
                    color: '#009ACD',
                    fillOpacity: 0.6
                }
            };

            dropZone = L.geoJson(collection, {
                style: areaStyle
            }).addTo(map);

            dropZone.eachLayer(function (layer) {

                //on mouse over
                layer.on('mouseover', function () {
                    //change stroke color and bring to front
                    layer.setStyle({
                        color: '#E0FFFF'
                    }).bringToFront();
                });
                //mouse off
                layer.on('mouseout', function () {
                    //reset the layer style
                    layer.setStyle({
                        color: '#009ACD'
                    });
                });

                layer.bindTooltip('502nd Planned Drop Zone');


            });

        })
    }


    function sliderui() {
        let sliderControl = L.control({
            position: 'bottomright'
        });

        // when added to the map
        sliderControl.onAdd = function (map) {

            // select an existing DOM element with an id of "ui-controls"

            slider = L.DomUtil.get("ui-controls");
            L.DomUtil.removeClass(slider, 'opacity');

            // disable scrolling of map while using controls
            L.DomEvent.disableScrollPropagation(slider);

            // disable click events while using controls
            L.DomEvent.disableClickPropagation(slider);

            // return the slider from the onAdd method
            return slider;
        }

        // add the control to the map
        sliderControl.addTo(map);

        $("#range").on("input change", function () { // when user changes
            //let time = this.value; // update the year
            let values = [1, 2, 6, 7, 8, 19]
            let input = document.getElementById('range');

            input.oninput = function () {
                return values[this.value];
            };
            let time = input.oninput(); //set default value

            let style = {
                radius: 10,
                fillColor: "red",
                color: "red",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.4
            };
            if (time < 10) {
                $(".time").html(`June 6th 0${time}:00 Hours`)
                $(".h3Time").html(`June 6th 0${time}:00 Hours`)
            } else {
                $(".time").html(`June 6th ${time}:00 Hours`)
                $("h3Time").html(`June 6th ${time}:00 Hours`)
            }

            if (time == 1) {

                map.flyTo([49.43441055086234, -1.244582527044631], 11);
                if (!map.hasLayer(drops)) {
                    addDrops()
                }
                if (!map.hasLayer(objectives)) {
                    addObjectiveMarkers()
                }
                if (map.hasLayer(highlight)) {
                    map.removeLayer(highlight)
                }
                if (!map.hasLayer(dropZone)) {
                    addDropZone()
                }

                d3.select('#content').html(
                    `<p>Between 00:48 and 01:40 the 502nd jumped from their C-47s.  Navigation errors, fog and a lack of a Eureka signal from the advanced pathfinders, the 502nd was scatterd across the Cotentin Peninsula.</p>`
                );


            } else if (time == 2) {
                //objective 1 coastal battery

                d3.select('#content').html(
                    `<p>Between 02:00 and 09:30 Lt Col Robert G. Cole assembled 75 men from the 101st and 82nd airborne to assault the coastal gun batteries.  They encountered one enemy convoy killing multiple Germans and taking 10 prisoners.  Upon reaching the outskirts of the gun battery they discovered that the battery had been dismantled and removed after an earlier air raid.</p>`
                );
                map.flyTo([49.43441055086234, -1.244582527044631],
                    13);
                if (map.hasLayer(objectives)) {
                    map.removeLayer(objectives)
                }
                if (map.hasLayer(dropZone)) {
                    map.removeLayer(dropZone)
                }
                if (map.hasLayer(highlight)) {
                    map.removeLayer(highlight)
                    highlight = L.circleMarker([49.426106018818537,
                        -1.244582527044631
                    ], style).addTo(map).bringToFront();
                } else {
                    highlight = L.circleMarker([49.426106018818537,
                        -1.244582527044631
                    ], style).addTo(map).bringToFront();
                }

                highlight.bindPopup(
                    `<h3>Coastal Battery</h3><p>In 1943 four captured Russian 122mm howitzers were placed at this location to provide artillery support in case of an amphibious landing.</p><p>Unbeknownst to the 502nd they were damaged by Lancaster bombers on May 28th and relocated further southwest.</p><div class = 'polaroid'><img width = '270px' src = 'img/A-19_122mm.jpg'></div><div class="paperclip"></div>`
                );
                highlight.openPopup();


            } else if (time == 6) {
                //objective 2 barracks
                d3.select('#content').text(
                    'Lt. Col. Cassidy landed near St. Germain-de-Varreville and at 06:30 gathered a small force to assault the WXYZ complex containing a barracks of German soldiers that were previously manning the coastal battery.  Lt. Col. Cassidy along with 15 men killed or captured about 150 German soldiers.  Near the end of the raid Lt. Col. Michaelis arrived with an additional 200 men to link up with Cassidys men.'
                );
                map.flyTo([49.437314504327446, -1.254497969481392],
                    13);
                if (map.hasLayer(objectives)) {
                    map.removeLayer(objectives)
                }
                if (map.hasLayer(dropZone)) {
                    map.removeLayer(dropZone)
                }
                if (map.hasLayer(highlight)) {
                    map.removeLayer(highlight)
                    highlight = L.circleMarker([49.424963397778185,
                        -1.254418187502317
                    ], style).addTo(map).bringToFront();
                } else {
                    highlight = L.circleMarker([49.424963397778185,
                        -1.254418187502317
                    ], style).addTo(map).bringToFront();
                }

                highlight.bindPopup(
                    `<h3>WXYZ Complex</h3><p>In 1944 farm building and Manoir at Mesieres had been pressed into service as a barracks complex for soldiers manning the nearby coastal battery.</p>`
                );
                highlight.openPopup();
            } else if (time == 7) {
                d3.select('#content').text(
                    'After capturing the WXYZ complex a defensive line was established near Foucarville'
                );
                map.flyTo([49.43612943390729, -1.259608261946174],
                    13);
                if (map.hasLayer(objectives)) {
                    map.removeLayer(objectives)
                }
                if (map.hasLayer(dropZone)) {
                    map.removeLayer(dropZone)
                }
                if (map.hasLayer(highlight)) {
                    map.removeLayer(highlight)
                    highlight = L.circleMarker([49.43612943390729, -
                        1.259608261946174
                    ], style).addTo(map).bringToFront();
                } else {
                    highlight = L.circleMarker([49.43612943390729, -
                        1.259608261946174
                    ], style).addTo(map).bringToFront();
                }

                highlight.bindPopup(
                    `<h3>Road Blocks Near Foucarville</h3><p>Despite the early success in destroying a 4 vehicle troop convoy, this position would be harrased and nearly over run all day.</p>`
                );
                highlight.openPopup();

            } else if (time == 8) {
                d3.select('#content').text(
                    'At 07:30 Lt. Col. Cole had captured Exit 3 and 4 along the causeway, however Exit 4 was covered by German artillary fire. Coles forces set an ambush for any German forces retreating through Exit 3 and 4.  An estimated 75 Germans were killed as they retreated up the exits.'
                );
                map.flyTo([49.418442985071856, -1.241967180742152],
                    13);
                if (map.hasLayer(objectives)) {
                    map.removeLayer(objectives)
                }
                if (map.hasLayer(dropZone)) {
                    map.removeLayer(dropZone)
                }
                if (map.hasLayer(highlight)) {
                    map.removeLayer(highlight)
                    highlight = L.circleMarker([49.408437106241045,
                        -1.2409282067895602
                    ], style).addTo(map).bringToFront();
                } else {
                    highlight = L.circleMarker([49.408437106241045,
                        -1.2409282067895602
                    ], style).addTo(map).bringToFront();
                }

                highlight.bindPopup(
                    `<h3>Exit 3</h3><p>The Aerial photo below shows the entire area behind the causway and west of Utah Beach flooded prior to the airborne assault.</p><div class = 'polaroid'><img width = '270px'src = 'img/causeway.jpg'></div><div class="paperclip2"></div>`
                );
                highlight.openPopup();

            } else if (time == 19) {
                d3.select('#content').text(
                    'By 19:00 the 502nd having completed all of its objectives and recovered of most of its men, began preperations to move further inland towards Carentan'
                );
                map.flyTo([49.41542999998949, -1.2692591313667048], 11);
                if (map.hasLayer(objectives)) {
                    map.removeLayer(objectives)
                }
                if (map.hasLayer(dropZone)) {
                    map.removeLayer(dropZone)
                }
                if (map.hasLayer(highlight)) {
                    map.removeLayer(highlight)
                }
                //add next day button

                if (elementCount == 0) {
                    const dayControl = L.control({
                        position: 'bottomright'
                    });

                    // when the control is added to the map
                    dayControl.onAdd = function (map) {
                        const dayBtn = L.DomUtil.create('input', 'btn');
                        dayBtn.type = 'button';
                        dayBtn.title = 'June 7th';
                        dayBtn.value = 'Next Day';
                        return dayBtn;
                    };

                    // add the button to the map
                    dayControl.addTo(map);

                    // disable click events while using controls
                    L.DomEvent.disableClickPropagation(dayControl);
                    elementCount++;
                }


            }
        });
    }

    function sliderui2() {
        let sliderControl = L.control({
            position: 'bottomright'
        });

        // when added to the map
        sliderControl.onAdd = function (map) {

            // select an existing DOM element with an id of "ui-controls"

            slider2 = L.DomUtil.get("ui-controls2");
            L.DomUtil.removeClass(slider2, 'opacity');

            // disable scrolling of map while using controls
            L.DomEvent.disableScrollPropagation(slider2);

            // disable click events while using controls
            L.DomEvent.disableClickPropagation(slider2);

            // return the slider from the onAdd method
            return slider2;
        }

        // add the control to the map
        sliderControl.addTo(map);
        //load June 7th data
        day = 7;
        moveTroops("data/german_7.geojson", "img/6th.png", 1, 2, 6, 7)
        moveTroops("data/german_7.geojson", "img/1058th.png", 1, 2, 1058, 7)
        moveTroops("data/american_7.geojson", "img/502nd.png", 1, 2, 502, 7)
        moveTroops("data/american_7.geojson", "img/501st.png", 1, 2, 501, 7)
        moveTroops("data/american_7.geojson", "img/506th.png", 1, 2, 506, 7)
        moveTroops("data/american_7.geojson", "img/327th.png", 1, 2, 327, 7)

        $("#range2").on("input change", function () { // when user changes
            let time = this.value; // update the year
            day = time;
            $(".time2").html(`June ${time}th`)
            $(".h3Time").html(`June ${time}th`)
            if (time == 7) {
                //attack on St Come-du-Mont
                map.flyTo([49.33475481560422, -1.273214772369016], 13);
                d3.select('#content').text(
                    `The 501st failed to capture St. Come-du-Mont, one of it's D-day objectives so the consolidated 506th was brought up, with the 501st behind, to capture and assault the town for it's vital highway connection to Carentan.  The 502nd covered the right flank and aided in encircling the city to prevent German forces from escaping.  The 327th Glider Infantry protected the left flank and was held in reserve.  The 506th encountered heavy resistance at the highway junction to the south at what is now called Dead Mans Corner.  By the end of June 7th 1/3 of the German 6th Paratrooper regiment surrendered but St. Come-du-Mont was still held by the Germans.`
                );
                d3.select("#d6").remove();
                d3.select("#d17").remove();
                d3.select("#d1058").remove();
                d3.select("#d502").remove();
                d3.select("#d501").remove();
                d3.select("#d506").remove();
                d3.select("#d327").remove();
                d3.select("#d1_502A").remove();
                d3.select("#d1_502B").remove();
                d3.select("#d1_502C").remove();
                d3.select("#d3_502H").remove();
                d3.select("#d3_502G").remove();
                d3.select("#d6_1").remove();
                d3.select("#d6_2").remove();
                d3.select("#d6_3").remove();
                d3.select("#d2").remove();
                moveTroops("data/german_7.geojson", "img/6th.png", 1, 2, 6, 7)
                moveTroops("data/german_7.geojson", "img/1058th.png", 1, 2, 1058, 7)
                moveTroops("data/american_7.geojson", "img/502nd.png", 1, 2, 502, 7)
                moveTroops("data/american_7.geojson", "img/501st.png", 1, 2, 501, 7)
                moveTroops("data/american_7.geojson", "img/506th.png", 1, 2, 506, 7)
                moveTroops("data/american_7.geojson", "img/327th.png", 1, 2, 327, 7)

            } else if (time == 8) {
                //remove map markers
                map.flyTo([49.33475481560422, -1.273214772369016], 13);
                d3.select('#content').text(
                    `The attack renewed at 04:45 on June 8th with a rolling artillery barrage, shifting every 4 minutes. 2,500 rounds of 105mm shells were fired in 90 minutes.  The 502nd remained to the right while the 506th, 501st and 327th assaulted the town. After an exhausting 60 hours of fighting the 506th and 501st captured the town and moved onto Carentan Highway to the south, establishing defensive positions that would repel counter attacks at 09:30 and 16:00.  The German 1058 continued to retreat without orders throughout the day, forcing the 6th FJR to pull back across the river and head to Carentan along the railroad embankment destroying 3 bridges and most of the rails along the way.`
                );
                d3.select("#d6").remove();
                d3.select("#d17").remove();
                d3.select("#d1058").remove();
                d3.select("#d502").remove();
                d3.select("#d501").remove();
                d3.select("#d506").remove();
                d3.select("#d327").remove();
                d3.select("#d1_502A").remove();
                d3.select("#d1_502B").remove();
                d3.select("#d1_502C").remove();
                d3.select("#d3_502H").remove();
                d3.select("#d3_502G").remove();
                d3.select("#d6_1").remove();
                d3.select("#d6_2").remove();
                d3.select("#d6_3").remove();
                d3.select("#d2").remove();
                moveTroops("data/german_8.geojson", "img/6th.png", 1, 2, 6, 8)
                moveTroops("data/german_8.geojson", "img/1058th.png", 1, 2, 1058, 8)
                moveTroops("data/american_8.geojson", "img/502nd.png", 1, 2, 502, 8)
                moveTroops("data/american_8.geojson", "img/501st.png", 1, 2, 501, 8)
                moveTroops("data/american_8.geojson", "img/506th.png", 1, 2, 506, 8)
                moveTroops("data/american_8.geojson", "img/327th.png", 1, 2, 327, 8)

            } else if (time == 9) {
                //remove map markers and reset map view to Carentan
                //consolidation of troops and reinforcements from Utah beach
                d3.select('#content').text(
                    `The 101st finished consolidating all troops including and setup defensive positions on the Carentan highway with the 502nd on the right next to the Douve River, the 506th on the highway proper, and the 327th to the left near Brevands.  The 501st was held in reserve to the east of 327.  Aerial recon indicated Carentan was lightly defended, and a plan of double envelopment was devised to capture the town and merge the Utah and Omaho beach heads.  The 502nd was to capture the hills to the southwest of Carentan to prevent any German withdrawl.  The 6th FJR and 1058th had retreated to Carentan the previous day, but after losing the majority of it's forces over the last three days the 1058th was not considered combat effective, leaving the defense of Carental solely to the 6th FJR.  The 6th FJR was reinforced with 2 Ost Battalions made up of captured soviet soldiers pressed into service.  They had hoped to be reinforced by the 17th SS Panzer Grenadiers Regiment, but the 507th's misdrop on d-day had placed them directly between the 17th and Carentan greatly aiding the rest of the 101st in the assualt.`
                );
                map.flyTo([49.303682080592395, -1.2464258521806684], 13);
                d3.select("#d6").remove();
                d3.select("#d17").remove();
                d3.select("#d1058").remove();
                d3.select("#d502").remove();
                d3.select("#d501").remove();
                d3.select("#d506").remove();
                d3.select("#d327").remove();
                d3.select("#d1_502A").remove();
                d3.select("#d1_502B").remove();
                d3.select("#d1_502C").remove();
                d3.select("#d3_502H").remove();
                d3.select("#d3_502G").remove();
                d3.select("#d6_1").remove();
                d3.select("#d6_2").remove();
                d3.select("#d6_3").remove();
                d3.select("#d2").remove();
                moveTroops("data/german_9.geojson", "img/6th.png", 1, 2, 6, 9)
                moveTroops("data/american_9.geojson", "img/502nd.png", 1, 2, 502, 9)
                moveTroops("data/american_9.geojson", "img/501st.png", 1, 2, 501, 9)
                moveTroops("data/american_9.geojson", "img/506th.png", 1, 2, 506, 9)
                moveTroops("data/american_9.geojson", "img/327th.png", 1, 2, 327, 9)

            } else if (time == 10) {
                //purple heart lane
                d3.select('#content').text(
                    `The 502nd led the attack on June 10th under Lt. Col. Robert Cole.  As they traversed the Carentan-Sainte-Mere-Eglise highway they found Brdige #2 unrepaired and under attach from German 88mm howitzers.  Cole sent a small group accross the river in a small boat, where they made their way to the last bridge which was blocked by a Belgian gate (anti-tank blockade.)  They were only able to move it far enough to allow one soldier at a time to pass, however they soon came under mortar and machine gun fire from a large farmhouse to the southwest of the final bridge.  By noon the bridge was still not repaired so they used materials at hand to improvise a footbridge and began their attack after 13:00.  Moving single file, crouching and crawling, they reached bridge #4 at 16:00.  Under artillery, sniper, and machine gun fire as they approached Carentan, casualties became heavy.  At 23:00 the 502nd was strafed by 2 JU 87 Stukas killing 30 men, leading to this part of the highway being called Purple Heart Lane.  The 327th finished crossing the lower Douve river at 06:00 and captured Brevands.  From there they swung east and approached Carentan, not encountering serious opposition until reaching the Vire-Taute Canal.`
                );
                d3.select("#d6").remove();
                d3.select("#d17").remove();
                d3.select("#d1058").remove();
                d3.select("#d502").remove();
                d3.select("#d501").remove();
                d3.select("#d506").remove();
                d3.select("#d327").remove();
                d3.select("#d1_502A").remove();
                d3.select("#d1_502B").remove();
                d3.select("#d1_502C").remove();
                d3.select("#d3_502H").remove();
                d3.select("#d3_502G").remove();
                d3.select("#d6_1").remove();
                d3.select("#d6_2").remove();
                d3.select("#d6_3").remove();
                d3.select("#d2").remove();
                moveTroops("data/german_10.geojson", "img/6th.png", 1, 2, 6, 10)
                moveTroops("data/american_10.geojson", "img/502nd.png", 1, 2, 502, 10)
                moveTroops("data/american_10.geojson", "img/501st.png", 1, 2, 501, 10)
                moveTroops("data/american_10.geojson", "img/506th.png", 1, 2, 506, 10)
                moveTroops("data/american_10.geojson", "img/327th.png", 1, 2, 327, 10)

            } else if (time == 11) {
                //coles charge
                d3.select('#content').text(
                    `As German fire subsided over night the 502nd moved the rest of its troops past the Belgian gate taking cover on both sides of the highway.  Scouts approached the farmhouse early in the morning, but were cut down by concentrated fire.  Lt. Col. Cole ordered artillary fire on the farmhouse, but the German fire did not subside.  at 06:15 using a smoke screen Lt. Col. Cole ordered a bayonette charge at the German positions.  The oposition was overwhelmed in close quarters combat which earned Lt. Col. Cole the Medal of Honor.  The rest of the 502nd was called up to reinforce Cole, but came under heavy mortar fire and was only able to add to Cole's defensive positions.  Repeated German counter attacks fell on the 502nd, with the final one at 18:30 nearly overwhelming the 3rd batallion.  Rolling artillery fire was called in, so close that many American troops were killed with friendly fire, but the Germans were finally pushed back.  The 327th crossed the canal via a footbridge, but as they advanced came under mortar fire and were pinned down a half mile short of Carentan.  The German 6th FRJ nearly out of ammunition withdrew during the night leaving only a small rear-guard within the city.`
                );
                map.flyTo([49.312995117070365, -1.2589214031919327], 16);
                d3.select("#d6").remove();
                d3.select("#d17").remove();
                d3.select("#d1058").remove();
                d3.select("#d502").remove();
                d3.select("#d501").remove();
                d3.select("#d506").remove();
                d3.select("#d327").remove();
                d3.select("#d1_502A").remove();
                d3.select("#d1_502B").remove();
                d3.select("#d1_502C").remove();
                d3.select("#d3_502H").remove();
                d3.select("#d3_502G").remove();
                d3.select("#d6_1").remove();
                d3.select("#d6_2").remove();
                d3.select("#d6_3").remove();
                d3.select("#d2").remove();
                moveTroops("data/d_1_502.geojson", "img/502nd.png", 1, 2, '1_502A', 11)
                moveTroops("data/d_1_502.geojson", "img/502nd.png", 1, 2, '1_502B', 11)
                moveTroops("data/d_1_502.geojson", "img/502nd.png", 1, 2, '1_502C', 11)
                moveTroops("data/d_3_502.geojson", "img/502nd.png", 1, 2, '3_502G', 11)
                moveTroops("data/d_6_1.geojson", "img/6th.png", 1, 2, '6_1', 11)
                moveTroops("data/d_6_2.geojson", "img/6th.png", 1, 2, '6_2', 11)
                moveTroops("data/d_6_3.geojson", "img/6th.png", 1, 2, '6_3', 11)

            } else if (time == 12) {
                //Carentan Captured
                d3.select('#content').text(
                    `On June 12th the 506th and 501st were brought in from their reserve positions to assist in the assault on Hill 30th just southwest of Carentan.  Their movements were covered under an all-night naval bombardmant.  At 02:00 the 506th moved down the highway passing through the 502nd's defensive positions, then cross country to the west capturing La Billonnerie at 05:00.  The 501st traveling to the east, passed the 327th, crossed the canal and reached Hill 30 by 06:30.  At 06:00 the 506th and 401st GIR 1st battalion attached to the 327th attacked Carentan capturing the city by 07:30.  By the afternoon the 506th and 501st began advancing southwest where they met heavy resistance from the 17th SS Panzergrenadiers and 6th FJR that had retreated from the city.  The Germans having the higher ground dug in and battled the Americans throughout the night.`
                );
                map.flyTo([49.303682080592395, -1.2464258521806684], 13);
                d3.select("#d6").remove();
                d3.select("#d17").remove();
                d3.select("#d1058").remove();
                d3.select("#d502").remove();
                d3.select("#d501").remove();
                d3.select("#d506").remove();
                d3.select("#d327").remove();
                d3.select("#d1_502A").remove();
                d3.select("#d1_502B").remove();
                d3.select("#d1_502C").remove();
                d3.select("#d3_502H").remove();
                d3.select("#d3_502G").remove();
                d3.select("#d6_1").remove();
                d3.select("#d6_2").remove();
                d3.select("#d6_3").remove();
                d3.select("#d2").remove();
                moveTroops("data/german_12.geojson", "img/6th.png", 1, 2, 6, 12)
                moveTroops("data/german_12.geojson", "img/6th.png", 1, 2, 17, 12)
                moveTroops("data/american_12.geojson", "img/502nd.png", 1, 2, 502, 12)
                moveTroops("data/american_12.geojson", "img/501st.png", 1, 2, 501, 12)
                moveTroops("data/american_12.geojson", "img/506th.png", 1, 2, 506, 12)
                moveTroops("data/american_12.geojson", "img/327th.png", 1, 2, 327, 12)

            } else {
                //bloody gulch/counter attack
                d3.select('#content').text(
                    `At dawn just as the Americans were set to attack the German line, they came under heavy assualt from tanks and artillery.  The 17th Panzer and 6th FJR hit the 501st hard on the left flank causing them to retreat. The left flank of the 506th also began to collapse under heavy fire, prompting the immediate dismissal of the F company commander.  The 502nd took up positions to the right of the 506th but by 13:00 they had suffered massive casualties and were on the verge of collapse.  60 tanks from the 2nd Armored Division arrived just in time to prevent the 506th and 502nd from being overrun, inflicting severe casualites on the Germans forcing them to withdraw to the southwest.  The American victory at Carentan allowed Utah and Omaha beach to be linked creating a secure lodgement for further American operations in France.`
                );
                map.flyTo([49.28566210821775, -1.2832497340930973], 14);
                d3.select("#d6").remove();
                d3.select("#d17").remove();
                d3.select("#d1058").remove();
                d3.select("#d502").remove();
                d3.select("#d501").remove();
                d3.select("#d506").remove();
                d3.select("#d327").remove();
                d3.select("#d1_502A").remove();
                d3.select("#d1_502B").remove();
                d3.select("#d1_502C").remove();
                d3.select("#d3_502H").remove();
                d3.select("#d3_502G").remove();
                d3.select("#d6_1").remove();
                d3.select("#d6_2").remove();
                d3.select("#d6_3").remove();
                d3.select("#d2").remove();
                moveTroops("data/american_13.geojson", "img/sherman.PNG", 1, 2, 2, 13)
                moveTroops("data/german_13.geojson", "img/6th.png", 1, 2, 6, 13)
                moveTroops("data/german_13.geojson", "img/6th.png", 1, 2, 17, 13)
                moveTroops("data/american_13.geojson", "img/502nd.png", 1, 2, 502, 13)
                moveTroops("data/american_13.geojson", "img/501st.png", 1, 2, 501, 13)
                moveTroops("data/american_13.geojson", "img/506th.png", 1, 2, 506, 13)

            }


        })
    }


    let url = 'data/points.geojson';

    function addToMap(url) {
        let svg = d3.select(map.getPanes().overlayPane).append("svg");

        let g = svg.append("g").attr("class", "leaflet-zoom-hide");

        d3.json(url, function (collection) {
            var featuresdata = collection.features.filter(function (d) {
                return d.properties.id == "route1"
            })

            var transform = d3.geo.transform({
                point: projectPoint
            });

            var d3path = d3.geo.path().projection(transform);

            var toLine = d3.svg.line()
                .interpolate("linear")
                .x(function (d) {
                    return applyLatLngToLayer(d).x
                })
                .y(function (d) {
                    return applyLatLngToLayer(d).y
                });

            var ptFeatures = g.selectAll("circle")
                .data(featuresdata)
                .enter()
                .append("circle")
                .attr("r", 3)
                .attr("class", "waypoints");

            var linePath = g.selectAll(".lineConnect")
                .data([featuresdata])
                .enter()
                .append("path")
                .attr("class", "lineConnect");

            var marker = g.append("image")
                .attr("id", "marker")
                //.attr("class", "travelMarker")
                .attr("xlink:href", "img/DC3_rotate_transparent.png")
                .attr("height", 150)
                .attr("width", 150)
                .attr("x", -75)
                .attr("y", -75)
                .attr("class", 'opacityIn');

            // Start and End destinations for styling
            var originANDdestination = [featuresdata[0], featuresdata[6]]

            var begend = g.selectAll(".drinks")
                .data(originANDdestination)
                .enter()
                .append("image")
                .attr("xlink:href", "img/parachute.png")
                .attr("id", function (d) {
                    return d.properties.name
                })
                .attr("class", "parachute")
                .attr("height", 20)
                .attr("width", 20)
                .attr("x", -10)
                .attr("y", -10);

            var text = g.selectAll("text")
                .data(originANDdestination)
                .enter()
                .append("text")
                .text(function (d) {
                    return d.properties.name
                })
                .attr("id", function (d) {
                    return d.properties.name + 'Text'
                })
                .attr("class", "locnames")
                .attr("y", function (d) {
                    return -10
                })


            map.on("viewreset", reset);
            map.on("zoom", reset);

            reset();
            transition();

            function reset() {
                var bounds = d3path.bounds(collection),
                    topLeft = bounds[0],
                    bottomRight = bounds[1];

                text.attr("transform",
                    function (d) {
                        return "translate(" +
                            applyLatLngToLayer(d).x + "," +
                            applyLatLngToLayer(d).y + ")";
                    });

                begend.attr("transform",
                    function (d) {
                        return "translate(" +
                            applyLatLngToLayer(d).x + "," +
                            applyLatLngToLayer(d).y + ")";
                    });

                ptFeatures.attr("transform",
                    function (d) {
                        return "translate(" +
                            applyLatLngToLayer(d).x + "," +
                            applyLatLngToLayer(d).y + ")";
                    });

                marker.attr("transform",
                    function () {
                        var y = featuresdata[0].geometry.coordinates[1]
                        var x = featuresdata[0].geometry.coordinates[0]
                        return "translate(" +
                            map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
                            map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
                    });

                svg.attr("width", bottomRight[0] - topLeft[0] + 320)
                    .attr("height", bottomRight[1] - topLeft[1] + 320)
                    .style("left", topLeft[0] - 50 + "px")
                    .style("top", topLeft[1] - 50 + "px");

                linePath.attr("d", toLine)
                g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

            } // end reset

            function transition() {
                linePath.transition()
                    .duration(10000)
                    .attrTween("stroke-dasharray", tweenDash)
                    .each('end', function () {
                        d3.select('#marker')
                            .remove();
                        //fly map to end location
                        map.flyTo([49.41542647972486, -1.262730877610028], 11);


                        map.once('moveend', function () {
                            d3.select('.lineConnect')
                                .remove();
                            d3.selectAll('.parachute')
                                .remove();
                            d3.selectAll('.locnames')
                                .remove();
                            //load map and reference blue dots for actual drop zones
                            if (!map.hasLayer(maplayer)) {
                                let imageUrl = 'img/101_drop_zone_modified.png',
                                    imageBounds = [
                                        [49.255048, -1.57559],
                                        [49.57615, -1.113130]
                                    ];
                                maplayer = L.imageOverlay(imageUrl, imageBounds)
                                    .addTo(map);
                            }
                            var overlayMaps = {
                                "Intelligence Map": maplayer
                            };
                            layerControls = L.control.layers(null, overlayMaps, {
                                "collapsed": false
                            }).addTo(map).expand();

                            //enable slider
                            sliderui()

                        })
                    })


            } //end transition

            function tweenDash() {
                return function (t) {
                    //total length of path (single value)
                    var l = linePath.node().getTotalLength();
                    interpolate = d3.interpolateString("0," + l, l + "," + l);
                    var marker = d3.select("#marker");
                    var p = linePath.node().getPointAtLength(t * l);
                    var t2 = Math.min(t + 0.05, 1);
                    var p2 = linePath.node().getPointAtLength(t2 * l);
                    var x = p2.x - p.x;
                    var y = p2.y - p.y;
                    var r = 90 - Math.atan2(-y, x) * 180 / Math.PI;
                    marker.attr("transform", "translate(" + p.x + "," + p.y +
                        ") rotate(" + r + ")"); //move marker
                    return interpolate(t);
                }
            } //end tweenDash

            function projectPoint(x, y) {
                var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            } //end projectPoint
        });

    }

    function moveTroops(url, symbol, start, end, regiment, moveDay) {
        let svg = d3.select(map.getPanes().overlayPane).append("svg");

        let g = svg.append("g").attr("class", "leaflet-zoom-hide");

        d3.json(url, function (collection) {
            var featuresdata = collection.features.filter(function (d) {
                return d.properties.regiment == regiment
            })

            var transform = d3.geo.transform({
                point: projectPoint
            });

            var d3path = d3.geo.path().projection(transform);

            var toLine = d3.svg.line()
                .interpolate("linear")
                .x(function (d) {
                    return applyLatLngToLayer(d).x
                })
                .y(function (d) {
                    return applyLatLngToLayer(d).y
                });

            var ptFeatures = g.selectAll("circle")
                .data(featuresdata)
                .enter()
                .append("circle")
                .attr("r", 3)
                .attr("class", "waypoints");

            var linePath = g.selectAll(".lineConnect")
                .data([featuresdata])
                .enter()
                .append("path")
                .attr("class", "lineConnect")
                .attr("class", 'opacity');

            var marker = g.append("image")
                .attr("id", "d" + regiment)
                //.attr("class", "travelMarker")
                .attr("xlink:href", symbol)
                .attr("height", 75)
                .attr("width", 75)
                .attr("x", -37.5)
                .attr("y", -37.5)
                .attr("class", 'opacityIn');

            // Start and End destinations for styling
            //var originANDdestination = [featuresdata[start], featuresdata[end]]



            map.on("viewreset", reset);
            map.on("zoom", reset);

            reset();
            transition();

            function reset() {
                var bounds = d3path.bounds(collection),
                    topLeft = bounds[0],
                    bottomRight = bounds[1];

                ptFeatures.attr("transform",
                    function (d) {
                        return "translate(" +
                            applyLatLngToLayer(d).x + "," +
                            applyLatLngToLayer(d).y + ")";
                    });

                marker.attr("transform",
                    function () {
                        var y = featuresdata[0].geometry.coordinates[1]
                        var x = featuresdata[0].geometry.coordinates[0]
                        return "translate(" +
                            map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
                            map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
                    });

                svg.attr("width", bottomRight[0] - topLeft[0] + 320)
                    .attr("height", bottomRight[1] - topLeft[1] + 320)
                    .style("left", topLeft[0] - 50 + "px")
                    .style("top", topLeft[1] - 50 + "px");

                linePath.attr("d", toLine)
                g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

            } // end reset

            function transition() {
                linePath.transition()
                    .duration(15000)
                    .attrTween("stroke-dasharray", tweenDash)
                    .each('end', function () {
                        if (moveDay == day) {
                            d3.select(this).call(transition); // infinite loop
                        }

                    })


            } //end transition

            function tweenDash() {
                return function (t) {
                    //total length of path (single value)
                    var l = linePath.node().getTotalLength();
                    interpolate = d3.interpolateString("0," + l, l + "," + l);
                    var marker = d3.select("#d" + regiment);
                    var p = linePath.node().getPointAtLength(t * l);

                    marker.attr("transform", "translate(" + p.x + "," + p.y +
                        ")"); //move marker
                    return interpolate(t);
                }
            } //end tweenDash

            function projectPoint(x, y) {
                var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            } //end projectPoint
        });

    }

    function applyLatLngToLayer(d) {
        var y = d.geometry.coordinates[1]
        var x = d.geometry.coordinates[0]
        return map.latLngToLayerPoint(new L.LatLng(y, x))
    }

    addToMap(url);

    $(document).on('click', '.btn', function () {
        if (this.title == 'June 7th') {
            day = 7;
            //clear map and refocus
            if (map.hasLayer(drops)) {
                map.removeLayer(drops);
            }

            if (map.hasLayer(maplayer)) {
                map.removeLayer(maplayer);
            }

            layerControls.remove(map);
            //remove next day button as this will span 2 days up to the battle of Carentan
            d3.select('.btn').remove();
            //fly to St. Con-du-mont
            map.flyTo([49.33475481560422, -1.273214772369016], 13);
            //update content to describe troop movements
            d3.select('#content').text(
                `The 501st failed to capture St. Come-du-Mont, one of it's D-day objectives so the consolidated 506th was brought up, with the 501st behind, to capture and assault the town for it's vital highway connection to Carentan.  The 502nd covered the right flank and aided in encircling the city to prevent German forces from escaping.  The 327th Glider Infantry protected the left flank and was held in reserve.  The 506th encountered heavy resistance at the highway junction to the south at what is now called Dead Mans Corner.  By the end of June 7th 1/3 of the German 6th Paratrooper regiment surrendered but St. Come-du-Mont was still held by the Germans.`
            );
            L.DomUtil.remove(slider);
            sliderui2();

        }
    });
})();