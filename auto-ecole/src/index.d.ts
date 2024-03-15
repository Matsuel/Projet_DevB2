
interface City {
    name: string;
    zip: number;
    gps: {
      lat: number;
      long: number;
    }
  }
  
  interface AutoEcoleSearch {
    _id: string;
    name: string;
    address: string;
    zip: number;
    city: string;
  }