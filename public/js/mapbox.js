// Find the map element
export const displayMap = ( mapElement ) => {
    if (mapElement) {
        //console.log('hello by nithin');

        

        mapboxgl.accessToken = 'pk.eyJ1Ijoibml0aGljczIwMDQiLCJhIjoiY21jeGJ0NWQzMDRqeDJsczhvaXp6bHJuZyJ9.20JxSXNexsVpSnwnsDRbdQ';

        //Mapbox GL JS is a JavaScript library for:Creating interactive maps in the browser
        const map = new mapboxgl.Map({
            container: 'map',
            //style: 'mapbox://styles/nithics2004/cmcxc9kke004b01s91fzk1li1',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-118.113491, 34.111745],
            zoom: 1
        });

        //new mapboxgl.LngLatBounds() = = = =  Create a fresh bounding box object using the LngLatBounds blueprint provided by Mapbox
        //That new object has special methods like .extend() and .getCenter() that help you calculate and manage map bounds
        const bounds = new mapboxgl.LngLatBounds();

        locations.forEach(loc => {
            //Create a blank HTML element in memory (a <div>).
            const el = document.createElement('div');
            //Give it the class name marker so we can style it (e.g. red circle).
            el.className = 'marker';

            //Create a Mapbox marker object, and tell it to use our custom HTML el as the marker's shape.
            new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            })
                //Set the location (longitude and latitude) where the marker should appear on the map.
                .setLngLat(loc.coordinates).addTo(map);

            new mapboxgl.Popup({
                offset: 30
            }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`).addTo(map);

            //Expand the bounding box to include this location, so we can later zoom out to show all markers.
            bounds.extend(loc.coordinates);
        });

        map.fitBounds(bounds, {
            padding: {
                top: 200,
                bottom: 150,
                left: 200,
                right: 200
            }
        });

    } else {
        console.error('#map element not found!');
    }

};


