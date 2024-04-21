export interface Softpower {
  id: number;
  name: string;
  importantName: string;
  whatIs: string;
  origin: string;
  refer: string;
  softpowerTypeId: number;
  image: string;
  softpowerImages: [
    {
      id: number;
      image: string;
      softpowerId: number;
    }
  ];
}

export interface SoftpowerType {
  id: number;
  name: string;
}
