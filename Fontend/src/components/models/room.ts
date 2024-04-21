export interface Room {
  id: number;
  buildingId: number;
  roomTypeId: number;
  quantityRoom: number;
  quantityPeople: string;
  detail: string;
  price: number;
  image: string;
  roomImages: [
    {
      id: number;
      image: string;
      roomId: number;
    }
  ];
}

export interface RoomType {
  id: number;
  name: string;
}
