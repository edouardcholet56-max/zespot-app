export async function POST(req) {
  const { addresses } = await req.json();

  // 1. Geocoding des adresses → coords
  const coords = await Promise.all(
    addresses.map(async (address) => {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();

      return data.results[0].geometry.location;
    })
  );

  // 2. Calcul point moyen (équitable)
  const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
  const avgLng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;

  // 3. Chercher bars autour
  const placesRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${avgLat},${avgLng}&radius=1500&type=bar&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );

  const placesData = await placesRes.json();

  // 4. Trier par note
  const bestBar = placesData.results
    .filter((b) => b.rating)
    .sort((a, b) => b.rating - a.rating)[0];

  return Response.json({
    bar: {
      name: bestBar.name,
      address: bestBar.vicinity,
      rating: bestBar.rating,
    },
  });
}