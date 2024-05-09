export const geocode = async (address: string, city: string, postalCode: number) => {
  try {
    const url = `https://api.mapbox.com/search/geocode/v6/forward?address=${address}&place=${city}&postcode=${postalCode}&access_token=${process.env.NEXT_PUBLIC_MAP_API}`;
    const response = await fetch(url);
    const data: MapResponse = await response.json()
    return data.features[0].geometry.coordinates
  } catch (error) {
    console.error(error)
    return null
  }
}

interface MapResponse {
  features: Feature[];
}

interface Feature {
  geometry: Geometry;
}

interface Geometry {
  coordinates: number[];
}