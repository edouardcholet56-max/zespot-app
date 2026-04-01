export async function POST(req) {
  try {
    const { addresses } = await req.json();

    // Vérification clé API
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error("Clé API manquante");
    }

    if (!addresses || addresses.length < 2) {
      throw new Error("Ajoute au moins 2 adresses");
    }

    // 1. GEOCODING
    const coords = [];

    for (const address of addresses) {
      if (!address) continue;

      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );

      const geoData = await geoRes.json();

      if (geoData.status !== "OK" || !geoData.results.length) {
        throw new Error(`Adresse invalide: ${address}`);
      }

      coords.push(geoData.results[0].geometry.location);
    }

    if (coords.length === 0) {
      throw new Error("Aucune adresse valide");
    }

    // 2. POINT MOYEN
    const avgLat =
      coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;

    const avgLng =
      coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;

    // 3. PLACES API (bars)
    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${avgLat},${avgLng}&radius=1500&type=bar&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const placesData = await placesRes.json();

    if (placesData.status !== "OK" || !placesData.results.length) {
      throw new Error("Aucun bar trouvé");
    }

    // 4. SCORE (équilibre distance + rating)
    const scoredBars = placesData.results.map((bar) => {
      const rating = bar.rating || 0;

      const distance =
        Math.abs(bar.geometry.location.lat - avgLat) +
        Math.abs(bar.geometry.location.lng - avgLng);

      return {
        ...bar,
        score: rating * 2 - distance * 100,
      };
    });

    const bestBar = scoredBars.sort((a, b) => b.score - a.score)[0];

    if (!bestBar) {
      throw new Error("Aucun bar exploitable");
    }

    // 5. RESPONSE FINALE
    return Response.json({
      bar: {
        name: bestBar.name,
        address: bestBar.vicinity,
        rating: bestBar.rating || "N/A",
      },
      location: {
        lat: bestBar.geometry.location.lat,
        lng: bestBar.geometry.location.lng,
      }
    });

  } catch (err) {
    console.error("ERROR:", err);

    return Response.json(
      { error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}