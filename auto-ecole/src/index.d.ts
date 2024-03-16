
interface City {
  name: string;
  zip: string;
  gps: {
    lat: string;
    lon: string;
  };
  department: {
    name: string;
    code: string;
  };
  region: string;
}

interface AutoEcoleSearch {
  _id: string;
  name: string;
  address: string;
  zip: number;
  city: string;
  note: number;
}