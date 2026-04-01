export async function POST(req) {
  try {
    const { addresses } = await req.json();

    console.log("ADDRESSES:", addresses);

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error("Clé API manquante");
    }

    if (!addresses || addresses.length !== 3) {
      throw new Error("3 adresses requises");
    }

    // 1. GEOCODING
    const coords = [];

    for (const address of addresses) {
      if (!address) {
        throw new Error("Une adresse est vide");
      }

      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );

      const geoData = await geoRes.json();

      console.log("GEOCODE:", geoData);

      if (geoData.status !== "OK" || !geoData.results.length) {
        throw new Error(`Adresse invalide: ${address}`);
      }

      coords.push(geoData.results[0].geometry.location);
    }

    // 2. POINT MOYEN
    const avgLat =
      coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;

    const avgLng =
      coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;

    console.log("CENTER:", avgLat, avgLng);

    // 3. PLACES API
    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${avgLat},${avgLng}&radius=1500&type=bar&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const placesData = await placesRes.json();

    console.log("PLACES:", placesData);

    if (placesData.status !== "OK" || !placesData.results.length) {
      throw new Error("Aucun bar trouvé");
    }

    // 4. CHOIX DU BAR
    const barsWithRating = placesData.results.filter((b) => b.rating);

    const bestBar =
      barsWithRating.length > 0
        ? barsWithRating.sort((a, b) => b.rating - a.rating)[0]
        : placesData.results[0];

    if (!bestBar) {
      throw new Error("Aucun bar exploitable");
    }

    // 5. RESPONSE
    return Response.json({
      bar: {
        name: bestBar.name,
        address: bestBar.vicinity,
        rating: bestBar.rating || "N/A",
      },
    });

  } catch (err) {
    console.error("ERROR:", err);

    return Response.json({
      error: err.message || "Erreur serveur",
    });
  }
}