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
	// Geojson

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

	var settlement2000Layer = L.geoJson();
	$.getJSON('data/Settlements_2000.geojson', function(geojsonFeature) {
		settlement2000Layer.addData(geojsonFeature);
	});

	var settlement5000Layer = L.geoJson();
	$.getJSON('data/Settlements_5000.geojson', function(geojsonFeature) {
		settlement5000Layer.addData(geojsonFeature);
	});

	var settlement10000Layer = L.geoJson();
	$.getJSON('data/Settlements_10000.geojson', function(geojsonFeature) {
		settlement10000Layer.addData(geojsonFeature);
	});

	//=============
	// Data Layers

	var overlayMaps = {
		'Settlement layer': settlementLayer,
		'Settlement layer > 2000': settlement2000Layer,
		'Settlement layer > 5000': settlement5000Layer,
		'Settlement layer > 10000': settlement10000Layer
	};

	var controls = L.control.layers(baseMaps, overlayMaps);

	var map = new L.Map('map', {
		center: new L.LatLng(51.505, -0.09),
		zoom: 13,
		layers: [layer_OSM, settlementLayer]
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