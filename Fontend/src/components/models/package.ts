export interface Package {
  id: number;
  name: string;
  roomPackages: [
    {
      id: number;
      roomId: number;
      packageId: number;
    }
  ];
  quantityDay: number;
  softpowerPackages: [
    {
      id: number;
      softpowerId: number;
      packageId: number;
    }
  ];
  quantityPeople: string;
  precautions: string;
  totalPrice: number;
  quantity: number;
  date: string;
}
