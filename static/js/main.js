$(function() {
	var layer_MQ = new L.tileLayer(
		'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',{
			attribution: 'Data, imagery and map information provided by MapQuest, <a href=" http://www.openstreetmap.org/" title="OpenStreetMap">OpenStreetMap</a>  and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" title="CC-BY-SA">CC-BY-SA</a>',
			maxZoom: 18, subdomains: '1234'
		}
	),
	layer_OSM = new L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
			attribution: '&copy <a href=" http://www.openstreetmap.org/" title="OpenStreetMap">OpenStreetMap</a>  and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" title="CC-BY-SA">CC-BY-SA</a>',
			maxZoom: 18, subdomains: 'abc'
		}
	),
	layer_MapBox = new L.tileLayer(
		'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',{
			maxZoom: 18, attribution: 'MapBox Streets',
			subdomains:'abcd'   
		}
	),
	layer_CloudMate = new L.tileLayer(
		'http://{s}.tile.cloudmade.com/ad132e106cd246ec961bbdfbe0228fe8/997/256/{z}/{x}/{y}.png',{
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
			maxZoom: 18,
			subdomains:'abc'   
		}
	)

	var baseMaps = {
		'OpenStreetMap': layer_OSM,
		'OSM MapQuest': layer_MQ,
		'Mapbox Streets': layer_MapBox,
		'CloudMate': layer_CloudMate
	};

	//============
	// Settlements

	var geojsonMarkerOptions = {
	    radius: 8,
	    fillColor: "#ff7800",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8
	};

	var settlementLayer = L.geoJson();
	var markers = new L.MarkerClusterGroup();

	$.getJSON('data/CES_Settlements.geojson', function(geojsonFeature) {
		for (var i in geojsonFeature.features) {
			var feature = geojsonFeature.features[i];
	        var marker = new L.Marker(
	        	new L.LatLng(
	        		feature.geometry.coordinates[1], 
	        		feature.geometry.coordinates[0]
	        	)
	        );
	        var popupContent = '<dl>';
	        for (var key in feature.properties) {
	        	value = feature.properties[key];
	        	popupContent += "<dt><strong>"+key+"</strong></dt><dd>" + value + "</dd>"
	        };
	        popupContent +='</dl>';
	        marker.bindPopup(popupContent);
	        markers.addLayer(marker);
	    }
	    settlementLayer.addLayer(markers);
	});

	//============
	// Settlements heat map
	var settlementHeatLayer = new L.TileLayer.HeatCanvas("Heat Canvas", map, {},
                        {'step':0.3, 'degree':HeatCanvas.QUAD, 'opacity':0.5});

	$.getJSON('data/CES_Settlements.geojson', function(geojsonFeature) {
		for (var i in geojsonFeature.features) {
			var feature = geojsonFeature.features[i];
	        settlementHeatLayer.pushData(feature.geometry.coordinates[1], feature.geometry.coordinates[0], 20);
	    }
	});

	//============
	// Waterpoints

	var waterDotOption = {
	    radius: 4,
	    fillColor: "69C5FF",
	    color: "lightblue",
	    weight: 1,
	    opacity: 0.7,
	    fillOpacity: 0.5
	};

	var waterLayer = L.geoJson(null, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, waterDotOption);
	    }});
	var markers2 = new L.MarkerClusterGroup();

	$.getJSON('data/CES_waterpoints.geojson', function(geojsonFeature) {
	    waterLayer.addData(geojsonFeature);
	});

	//=====================
	// Other geoJSON layers

	var LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: 'lhttp://leaflet.cloudmade.com/dist/images/marker-shadow.png',
            iconSize:     [38, 95],
            shadowSize:   [50, 64],
            iconAnchor:   [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor:  [-3, -76]
        }
    });

    var yellowDotOption = {
	    radius: 8,
	    fillColor: "yellow",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8
	};

	var orangeDotOption = {
	    radius: 8,
	    fillColor: "orange",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8
	};

	var redDotOption = {
	    radius: 8,
	    fillColor: "red",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8
	};

	var settlement2000Layer = L.geoJson(null, {
		    pointToLayer: function (feature, latlng) {
		        return L.circleMarker(latlng, yellowDotOption);
		    }
		});
	$.getJSON('data/Settlements_2000.geojson', function(geojsonFeature) {
		settlement2000Layer.addData(geojsonFeature);
	});

	var settlement5000Layer = L.geoJson(null, {
		    pointToLayer: function (feature, latlng) {
		        return L.circleMarker(latlng, orangeDotOption);
		    }
		});
	$.getJSON('data/Settlements_5000.geojson', function(geojsonFeature) {
		settlement5000Layer.addData(geojsonFeature);
	});

	var settlement10000Layer = L.geoJson(null, {
		    pointToLayer: function (feature, latlng) {
		        return L.circleMarker(latlng, redDotOption);
		    }
		});
	$.getJSON('data/Settlements_10000.geojson', function(geojsonFeature) {
		settlement10000Layer.addData(geojsonFeature);
	});


	var myStyle = {
	    "color": "lightblue",
	    "weight": 1,
	    "opacity": 0.65
	};
	var waterwaysLayer = L.geoJson(null, {style: myStyle});
	$.getJSON('data/CES_waterways_CDE_2008.geojson', function(geojsonFeature) {
		waterwaysLayer.addData(geojsonFeature);
	});

	var imageUrl = 'data/sudan-hydrogeology.png',
    imageBounds = [[2.08, 21.36], [23.7, 38.4]];

	imageLayer = L.imageOverlay(imageUrl, imageBounds, {opacity: 0.4});

	//=============
	// Data Layers

	var overlayMaps = {
		'Water': waterLayer,
		'Settlement layer': settlementLayer,
		'Settlement heatmap': settlementHeatLayer,
		'Settlement layer > 2000': settlement2000Layer,
		'Settlement layer > 5000': settlement5000Layer,
		'Settlement layer > 10000': settlement10000Layer,
		'Waterways': waterwaysLayer,
		'Water points': waterLayer,
		'Image Layer': imageLayer
	};

	var controls = L.control.layers(baseMaps, overlayMaps);

	var map = new L.Map('map', {
		center: new L.LatLng(51.505, -0.09),
		zoom: 13,
		layers: [layer_OSM, settlement10000Layer, settlement5000Layer, settlement2000Layer]
	})

	var bounding = L.polygon([[6.29, 30.11],[3.47, 32.31]]);
	map.fitBounds(bounding.getBounds());

	controls.addTo(map)

	/*
		L.tileLayer('http://{s}.tile.cloudmade.com/ad132e106cd246ec961bbdfbe0228fe8/997/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		maxZoom: 18
	}).addTo(map);

	var positions = [[1,2]];

	var polygon = L.polyline(positions, {fill: false}).addTo(map);

	map.fitBounds(polygon.getBounds());
	*/

	//================
	// Locate the user

	//map.locate({setView: true, maxZoom: 16});

	function onLocationFound(e) {
		var radius = e.accuracy / 2;

		L.marker(e.latlng).addTo(map)
			.bindPopup("You are within " + radius + " meters from this point").openPopup();

		L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);

	function onLocationError(e) {
		alert(e.message);
	}

	map.on('locationerror', onLocationError);

});