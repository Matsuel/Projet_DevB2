import { Monitor, ReviewsMonitor } from "./Monitor";

export type AutoEcoleInterface = {
    name: string;
    mail: string;
    address: string;
    zip: number;
    city: string;
    pics: string;
    monitors: Monitor[];
    phone: string;
    card: boolean;
    cheque: boolean;
    especes: boolean;
    qualiopi: boolean;
    label_qualite: boolean;
    qualicert: boolean;
    garantie_fin: boolean;
    datadocke: boolean;
    cpf: boolean;
    aide_apprentis: boolean;
    permis1: boolean;
    fin_francetravail: boolean;
    formations: string[];
    students: string[];
    note: number;
};

export type AutoEcoleInfos = {
    autoEcole: AutoEcoleInterface;
    reviews: ReviewAutoEcole[];
    monitorsReviews: ReviewsMonitor[];
};

export type ReviewAutoEcole = {
    rate: number;
    comment: string;
    creatorId: string;
};

export type AutoEcoleReview = {
    stars: number;
    comment: string;
  }

export type AutoEcoleIdName = {
    _id: string;
    name: string;
};