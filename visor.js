const apiKey = localStorage.getItem("TF_API_KEY");

if (!apiKey) {
  alert("No hay API key. Volviendo al inicio.");
  window.location.href = "index.html";
}

const map = new maplibregl.Map({
  container: 'map',
  style: 'atlas.json',
  center: [-3.7, 40.4],
  zoom: 5,
  transformRequest: (url) => {
    if (url.includes("tile.thunderforest.com")) {
      return { url: url + "?apikey=" + apiKey };
    }
    return { url };
  }
});

// Controles de zoom
map.addControl(new maplibregl.NavigationControl(), 'top-right');

// Buscador de ubicaciones
async function searchLocation() {
  const query = document.getElementById("search").value.trim();
  if (!query) return;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.length) {
    alert("No se encontró la ubicación");
    return;
  }

  const { lat, lon } = data[0];

  map.flyTo({
    center: [parseFloat(lon), parseFloat(lat)],
    zoom: 13,
    speed: 0.8
  });
}
