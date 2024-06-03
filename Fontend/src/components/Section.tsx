import { useState } from 'react';
import { Grid,  Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Avatar, Card, CardContent} from '@mui/joy';

export const CommentSection = ({ comments, bookings, users, folderImage }:any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleImageClick = (images:any, index:number) => {
    setCurrentImages(images.map((img: {image:string} ) => ({ src: folderImage + img.image })));
    setCurrentIndex(index);
    setOpen(true);
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {comments.slice(0, 2).map((item: { bookingId: number; star: number | null | undefined; text: string; commentImages: { image: string; }[]; }, index:number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ minWidth: 200, minHeight: 250, boxShadow: 'lg' }}  data-aos="flip-down" size="lg" variant="outlined">
              <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
                <Avatar src={"https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png"} sx={{ '--Avatar-size': '4rem' }} />
                <h2>
                  {users.find((u:{id:number}) => u.id === bookings.find((bo:{id:number}) => bo.id === item.bookingId)?.userId)?.username || "ไม่ระบุ"}
                </h2>
                <Rating
                  name="hover-feedback"
                  value={item.star}
                  precision={0.5}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  style={{ opacity: 1 }}
                  disabled
                />
                <h4>{item.star ? item.star + " คะแนน" : ""}</h4>
                <p style={{ marginTop: 10, marginBottom: 10 }}>
                  {item.text}
                </p>
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: 300 }}>
                  {item.commentImages && item.commentImages.map((slideImage: { image : string}, index1:number) => (
                    <div key={index1} style={{ flex: '0 0 auto', marginRight: '8px' }}>
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: 5,
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        src={folderImage + slideImage.image}
                        onClick={() => handleImageClick(item.commentImages, index1)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={currentImages}
        index={currentIndex}
      />
    </>
  );
};

export const CommentPackageSection = ({ commentPackages, bookingPackages, users, folderImage }:any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleImageClick = (images:any, index:number) => {
    setCurrentImages(images.map((img: {image:string} ) => ({ src: folderImage + img.image })));
    setCurrentIndex(index);
    setOpen(true);
  };
  
  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {commentPackages.slice(0, 2).map((item: { bookingPackageId: number; star: number | null | undefined; text: string; commentImages: { image: string; }[]; }, index:number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ minWidth: 200, minHeight: 250, boxShadow: 'lg' }}  data-aos="flip-down" size="lg" variant="outlined">
              <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
                <Avatar src={"https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png"} sx={{ '--Avatar-size': '4rem' }} />
                <h2>
                  {users.find((u:{id:number}) => u.id === bookingPackages.find((bo: {id:number} ) => bo.id === item.bookingPackageId)?.userId)?.username || "ไม่ระบุ"}
                </h2>
                <Rating
                  name="hover-feedback"
                  value={item.star}
                  precision={0.5}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  style={{ opacity: 1 }}
                  disabled
                />
                <h4>{item.star ? item.star + " คะแนน" : ""}</h4>
                <p style={{ marginTop: 10, marginBottom: 10 }}>
                  {item.text}
                </p>
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: 300 }}>
                  {item.commentImages && item.commentImages.map((slideImage: { image : string}, index1:number) => (
                    <div key={index1} style={{ flex: '0 0 auto', marginRight: '8px' }}>
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: 5,
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        src={folderImage + slideImage.image}
                        onClick={() => handleImageClick(item.commentImages, index1)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={currentImages}
        index={currentIndex}
      />
    </>
  );
};
