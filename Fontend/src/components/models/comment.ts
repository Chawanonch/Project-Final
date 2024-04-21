export interface Comment {
  id: number;
  text: string;
  star: number;
  bookingId: number;
  commentImages: [
    {
      id: number;
      image: string;
      commentId: number;
    }
  ];
}

export interface CommentPackage {
  id: number;
  text: string;
  star: number;
  bookingPackageId: number;
  commentPackageImages: [
    {
      id: number;
      image: string;
      commentPackageId: number;
    }
  ];
}
