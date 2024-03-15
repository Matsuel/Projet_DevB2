export interface City {
    name: string;
    zip: string;
    gps : {
        lat: string;
        lon: string;
    };
    department: {
        name: string;
        code: string;
    };
    region: string;
}