export interface Booking {
  id: number;
  listRooms:  [
    {
      id: number;
      roomId: number;
      bookingId: number;
      quantityRoom: number;
      quantityRoomExcess: number;
    }
  ];
  start: string;
  end: string;
  status: number;
  totalPrice: number;
  userId: number;
  dateCreated: string;
  statusCheckIn: number;
  checkInTime: string;
}

export interface BookingPayment {
  id: number;
  paymentDate: Date;
  status: number;
  bookingId: number;
  paymentIntentId0?: string | null;
  clientSecret0?: string | null;
  paymentIntentId1?: string | null;
  clientSecret1?: string | null;
  paymentIntentId2?: string | null;
  clientSecret2?: string | null;
}

export interface BookingPackage {
  id: number;
  listPackages:  [
    {
      id: number;
      packageId: number;
      bookingPackageId: number;
      quantity: number;
      start: string;
      end: string;
      checkInTime: string;
      checkInDate: number;
    }
  ];
  totalPriceBookingPackage: number;
  dateCreated: string;
  status: number;
  userId: number;
}

export interface BookingPackagePayment {
  id: number;
  paymentDate: Date;
  status: number;
  bookingPackageId: number;
  paymentIntentId0?: string | null;
  clientSecret0?: string | null;
  paymentIntentId1?: string | null;
  clientSecret1?: string | null;
  paymentIntentId2?: string | null;
  clientSecret2?: string | null;
}