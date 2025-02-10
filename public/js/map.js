 // Initialize the map
 var map = L.map('map').setView([28.6139, 77.2090], 9); // Center at [latitude, longitude], zoom level 13
    
 // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        
    }).addTo(map);

 // Add a sample marker
    L.marker([28.639,  77.2090])
    .addTo(map)
    .bindPopup('Sample Property')
    .openPopup();

    

    