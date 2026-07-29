const schoolCenter: [number, number] = [13.0094, 80.0111];

function offsetPoint(index: number, total: number): [number, number] {
  const spread = Math.max(total, 2);
  const angle = (index / spread) * Math.PI * 1.2 + Math.PI * 0.15;
  const radius = 0.01 + index * 0.004;
  const lat = schoolCenter[0] + Math.sin(angle) * radius;
  const lng = schoolCenter[1] + Math.cos(angle) * radius;
  return [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
}

export function parseRouteStops(description?: string | null) {
  const text = (description || "").trim();
  if (!text) return [] as string[];

  const jsonMatch = text.match(/^stops_json:(\[.*\])$/s);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed)) {
        return parsed
          .map((value) => String(value || "").trim())
          .filter(Boolean);
      }
    } catch {
      // ignore and fall back
    }
  }

  if (text.includes(" to ")) {
    return text
      .split(" to ")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [text];
}

// Keep the sync version for initial render/fallback
export function buildRoutePath(description?: string | null) {
  const stopNames = parseRouteStops(description);
  const coordinates = stopNames.map((stop, index) => ({
    name: stop,
    point: offsetPoint(index, stopNames.length),
  }));

  return {
    stopNames,
    coordinates,
    polyline: coordinates.map((item) => item.point),
    school: schoolCenter,
  };
}

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  // Add Chennai, India context to improve accuracy for local addresses
  const query = encodeURIComponent(`${address}, Chennai, Tamil Nadu, India`);
  const cacheKey = `geocode_${query}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return [parsed.lat, parsed.lon];
    }
  } catch (e) {
    // ignore cache errors
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      localStorage.setItem(cacheKey, JSON.stringify({ lat, lon }));
      // Be polite to the Nominatim API
      await new Promise(r => setTimeout(r, 500));
      return [lat, lon];
    }
  } catch (e) {
    console.error("Geocoding failed for", address, e);
  }
  return null;
}

function calculateDistance(a: [number, number], b: [number, number]) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// Optimizes the route to minimize distance, ending at the school
function optimizeRoute(stops: { name: string; point: [number, number] }[]) {
  if (stops.length <= 1) return stops;

  const optimized = [];
  const unvisited = [...stops];
  
  // Start from the point FURTHEST from the school to create a logical inbound route
  unvisited.sort((a, b) => calculateDistance(b.point, schoolCenter) - calculateDistance(a.point, schoolCenter));
  
  let current = unvisited.shift()!;
  optimized.push(current);

  while (unvisited.length > 0) {
    // Find the closest next point
    let closestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(current.point, unvisited[i].point);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    }

    current = unvisited.splice(closestIdx, 1)[0];
    optimized.push(current);
  }

  return optimized;
}

export async function buildRoutePathAsync(description?: string | null) {
  const stopNames = parseRouteStops(description);
  const coordinates: { name: string; point: [number, number] }[] = [];

  for (let index = 0; index < stopNames.length; index++) {
    const name = stopNames[index];
    const geoPoint = await geocodeAddress(name);
    // Fallback to offset point if geocoding fails
    coordinates.push({
      name,
      point: geoPoint || offsetPoint(index, stopNames.length)
    });
  }

  const optimizedCoordinates = optimizeRoute(coordinates);

  return {
    stopNames,
    coordinates: optimizedCoordinates,
    polyline: optimizedCoordinates.map((item) => item.point),
    school: schoolCenter,
  };
}
