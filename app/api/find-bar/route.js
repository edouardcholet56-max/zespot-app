export async function POST(req) {
  try {
    const { addresses } = await req.json();

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error("API key manquante");
    }

    // 1. Geocode
    const coords = await Promise.all(
      addresses.map(async (address) => {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        const data = await res.json();

        if (!data.results.length) {
          throw new Error(`Adresse invalide: ${address}`);
        }

        return data.results[0].geometry.location;
      })
    );

    // 2. moyenne
    const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
    const avgLng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;

    // 3. bars
    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${avgLat},${avgLng}&radius=1500&type=bar&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const placesData = await placesRes.json();

    if (!placesData.results?.length) {
      throw new Error("Aucun bar trouvé");
    }

    // 4. best
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
  } catch (err) {
    console.error(err);

    return Response.json({
      error: err.message,
    });
  }
}