import { Box, Container, Grid } from '@mui/material';
// import roomReviewImage from '../images/qest5mt3oKu9msEegqi-o.jpg';
// import roomReviewImage1 from '../images/home1.png';
import { useAppSelector } from '../store/store';
import { CardContent, CardCover } from '@mui/joy';
import { baseUrlServer, folderImage } from '../components/api/agent';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';
import { formatNumberWithCommas, windowSizes } from '../components/Reuse';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { routes } from '../components/Path';
import { motion } from 'framer-motion';
import 'yet-another-react-lightbox/styles.css';
import { CommentSection, CommentPackageSection }from '../components/Section';
import { Slide } from 'react-slideshow-image';
import { useEffect, useState } from 'react';
import { Softpower } from '../components/models/softpower';
import Lottie from "lottie-react";
import loadingMain from "../components/Animation/LoadingMain.json";
import { Card, Button, Chip, Divider, List, ListItem, ListItemDecorator, CardActions} from "@mui/joy";
import Check from '@mui/icons-material/Check';
import Close from "@mui/icons-material/Close";
import InfoIcon from '@mui/icons-material/Info';

export default function HomePage() {
  const { room, roomType } = useAppSelector((state) => state.room);
  const { comment, commentPackage } = useAppSelector((state) => state.comment);
  const { bookings, bookingPackages } = useAppSelector((state) => state.booking);
  const { packageAll } = useAppSelector((state) => state.package);
  const { softpower, softpowerType, loading } = useAppSelector((state) => state.softpower);
  const { users } = useAppSelector((state) => state.user);
  const [showPackageSection, setShowPackageSection] = useState(false);
  const roomReviewImage = baseUrlServer + "qest5mt3oKu9msEegqi-o.jpg";
  const roomReviewImage1 = baseUrlServer + "home1.png";
  
  const handleToggleSection = () => {
    setShowPackageSection(!showPackageSection);
  };

  const navigate = useNavigate()
  const windowSize = windowSizes();
  const [currentImage, setCurrentImage] = useState<Softpower | null>(null);

  const handleSlideChange = (_previous: number, current: number) => {
    setCurrentImage(softpower[current]);
  };

  useEffect(() => {
    if (softpower) setCurrentImage(softpower[0])
  }, [softpower])

  return (
    <div style={{ marginTop: -16 }}>
      
      <div style={{ width: "100%", height: 550 }}>
        <img src={roomReviewImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          style={{ 
            position: 'absolute', 
            bottom: windowSize < 768 ? 120 : 170, 
            left: '10%', 
            color: '#fff', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start' 
          }}
        >
          <h4 style={{ margin: 0, paddingBottom: 10 }}>เยี่ยมชมรีสอร์ทเราได้ที่นี่</h4>
          <h1 style={{ margin: 0 }}>ศรีวัฒนธรรมรีสอร์ท</h1>
        </motion.div>
      </div>
      
      <Container sx={{ marginTop: 10 }}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={10} sm={8} md={7}>
            <div data-aos="fade-right" >
              <h1>ยินดีต้อนรับสู่รีสอร์ทแม่ฮองสอน - สวรรค์ท่องเที่ยวแห่งศิลปะและวัฒนธรรม</h1>
              <p>เราเชิญทุกท่านสัมผัสประสบการณ์ท่องเที่ยวที่อันล้ำค่าในที่สุด 
                ในแม่ฮองสอน, เราไม่เพียงแต่มีความงามของธรรมชาติและบรรยากาศที่สงบ, 
                แต่ยังเต็มไปด้วยศิลปะและวัฒนธรรมที่ยิ่งใหญ่. นี่คือเรื่องราวของที่นี่ที่ทำให้แม่ฮองสอนเป็นที่รู้จักของนักท่องเที่ยวทั่วโลก.</p>
              <div style={{ marginTop: 20 }}></div>
              <h1>สัมผัสวัฒนธรรมท้องถิ่น</h1>
              <p>ที่นี่, วัฒนธรรมและประเพณีของชุมชนถูกนำเสนออย่างลงตัว.
                 คุณสามารถมีโอกาสในการร่วมกิจกรรมที่นำเสนอวัฒนธรรมท้องถิ่น เช่น การทำงานศิลปะ, การฝึกซ้อมการแสดง, 
                 หรือการเข้าร่วมพิธีกรรมทางศาสนาที่อันสวยงาม.</p>
              <div style={{ marginTop: 20 }}></div>

              <h1>อาหารท้องถิ่น</h1>
              <p>ที่นี่, คุณจะได้พบกับรสชาติที่เป็นเอกลักษณ์ของอาหารท้องถิ่น. ลองสัมผัสกับรสน้ำที่มีลิ้นและอาหารสดใหม่ที่จะทำให้ประทับใจ.</p>
              <div style={{ marginTop: 20 }}></div>

              <h1>ที่พักที่สะดวกสบาย</h1>
              <p>พักผ่อนในที่พักที่เตรียมพร้อมให้คุณได้สัมผัสถึงความอบอุ่นและบรรยากาศที่เป็นมิตร. ทุกที่พักถูกออกแบบเพื่อให้คุณได้พักผ่อนและสดชื่น.</p>
              <div style={{ marginTop: 20 }}></div>
            </div>
          </Grid>
          <Grid item xs={10} sm={8} md={5} alignItems="center">
            <div style={{ position: 'relative', flex: 1 }} data-aos="fade-left">
              <img src={roomReviewImage1} alt="รูปภาพ" style={{ width: '100%',height:windowSize < 1183 ? 250:400, borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: -20, left: 0, width: '25%', height: '25%', borderRadius: '50%', backgroundColor: '#DCF2F1' }} />
              <div style={{ position: 'absolute', bottom: 20, right: 0, width: '25%', height: '25%', borderRadius: '50%', backgroundColor: '#DCF2F1' }} />
            </div>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ marginTop: 5 }}>
        {comment.length > 0 &&
          <div onClick={handleToggleSection} style={{cursor: "pointer" }}>
            <p style={{ textAlign: "center" }} data-aos="fade-down">{!showPackageSection ? "Comment":"CommentPackage"}</p>
            <h1 style={{ textAlign: "center" }} data-aos="fade-down">{!showPackageSection ? "แสดงความคิดเห็น":"แสดงความคิดเห็นแพ็กเกจ"}</h1>
            <div style={{ marginTop: 20 }}></div>
          </div>
        }
        {!showPackageSection ? 
          <CommentSection comments={comment} bookings={bookings} users={users} folderImage={folderImage} />
          :
          <CommentPackageSection commentPackages={commentPackage} bookingPackages={bookingPackages} users={users} folderImage={folderImage} />
        }

        <br></br>
      </Container>

      <Box sx={{ marginTop: 5 }}></Box>

      {room.length > 0&&
        <Container >
          <>
            <p style={{ textAlign: "center" }} data-aos="fade-down">Room</p>
            <h1 style={{ textAlign: "center" }} data-aos="fade-down">ห้องพัก</h1>
            <div style={{ marginTop: 20 }}></div>
          </>
          
          <Grid container spacing={2} justifyContent="center">
            {room && room.slice(0, 6).map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ minWidth: 200, minHeight: 250 }} data-aos="flip-down" size="lg" variant="outlined" key={item.id}>
                  <CardCover>
                    <img
                      src={folderImage + item.image}
                      loading="lazy"
                      alt=""
                    />
                  </CardCover>
                  <CardCover
                    sx={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                    }}
                  />
                  <CardContent sx={{ justifyContent: 'flex-end' }}>
                    <h4 style={{ color: "#fff" }}>
                      {formatNumberWithCommas(item.price)} THB / ต่อคืน
                    </h4>
                    <h4 style={{ color: "#fff" }}>
                      {roomType.find((type) => type.id === item.roomTypeId)?.name || 'ไม่พบข้อมูล'}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <GroupsIcon style={{ marginRight: '8px' }} color="warning" />
                      <h4 style={{ color: "#fff" }}>
                        {item.quantityPeople} คน
                      </h4>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <br></br>
          <div style={{ textAlign: "center" }}>
            <Button variant="soft"
              color="primary"
              endDecorator={<KeyboardArrowRight />} sx={{ width: 250, height: 50 }} onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate(routes.building)
              }}>ดูห้องพักเพิ่มเติม</Button>
          </div>
        </Container>
      }

      {softpower.length > 0 && 
        <Container sx={{ marginTop: 10 }}>
          <>
            <p style={{ textAlign: "center" }} data-aos="fade-down">Softpower</p>
            <h1 style={{ textAlign: "center" }} data-aos="fade-down">ซอฟต์พาวเวอร์</h1>
            <div style={{ marginTop: 20 }}></div>
          </>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={windowSize < 1183 ? 9 : 5}>
              {!loading ?
                <div style={{ position: 'relative', flex: 1 }} data-aos="fade-right">
                  <div className="slide-container">
                    <Slide onChange={handleSlideChange}>
                      {softpower && softpower.slice(0, 3).map((slideImage, index) => (
                        <div key={index} style={{
                          minWidth: windowSize < 1183 ? 150 : 450, maxHeight: windowSize < 1183 ? 200 : 350
                        }} >
                          <img
                            style={{
                              width: "100%", maxHeight: "100%", borderRadius: 100
                              ,objectFit: 'cover'
                            }}
                            src={folderImage + slideImage.image}
                          />
                        </div>
                      ))}
                    </Slide>
                  </div>
                </div>
                : <Lottie animationData={loadingMain}></Lottie>}
            </Grid>

            <Grid item xs={windowSize < 1183 ? 10 : 7}>
              <Card data-aos="fade-left" sx={{ minWidth:250, maxHeight: 400, overflow: "auto"}}>
                {currentImage && (
                  <Grid container item xs={12}>
                    <Grid item xs={12}><h1>{currentImage.name}</h1></Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 1.5}><h4>ประเภท</h4></Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 10.5}>
                      <p>: {softpowerType.find((type) => type.id === currentImage.softpowerTypeId)?.name || 'ไม่พบข้อมูล'}</p>
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 1.5}><h4>ชื่ออื่น </h4></Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 10.5}>
                      <p>: {currentImage.importantName}</p>
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 1.5}><h4>คืออะไร </h4></Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 10.5}>
                      <p>: {currentImage.whatIs}</p>
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 1.5}><h4>ที่มา </h4></Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 10.5}>
                      <p>: {currentImage.origin}</p>
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 1.5}><h4>ส่งเสริม </h4></Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 10.5}>
                      <p>: {currentImage.promoteSoftpower}</p>
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 1.5}><h4>คุณค่า </h4></Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 10.5}>
                      <p>: {currentImage.valueSoftpower}</p>
                    </Grid>
                  </Grid>
                )}
              </Card>
              <Grid item xs={12} justifyContent={windowSize < 1183 ? "start" : "space-between"} display={windowSize < 1183 ? "":"flex"} mt={2}>
                  <Button data-aos="fade-right" variant="soft"
                  color="primary"
                  endDecorator={<KeyboardArrowRight />} sx={{ minWidth: 150, height: 50 }} onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    navigate(`${routes.softpower}/${currentImage?.id}`)
                  }}>สามารถอ่านต่อได้ที่นี่</Button>
                  {windowSize < 1183 && <div style={{ marginTop:5 }}></div>}
                  <Button data-aos="fade-left" variant="soft"
                  color="primary"
                  endDecorator={<KeyboardArrowRight />} sx={{ minWidth: 150, height: 50 }} onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    navigate(routes.softpower)
                  }}>ซอฟต์พาวเวอร์อื่น</Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      }
      {packageAll.length > 0 && 
        <Container sx={{ marginTop: 10 }}>
          <>
            <p style={{ textAlign: "center" }} data-aos="fade-down">Package</p>
            <h1 style={{ textAlign: "center" }} data-aos="fade-down">แพ็กเกจ</h1>
            <div style={{ marginTop: 20 }}></div>
          </>

          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {!loading && packageAll ? packageAll.slice(0, 2).map((item, index) => (
              <Grid item xs={12} md={6} key={index} >
                <Card size="lg" variant="outlined" sx={{ minWidth: 200, minHeight: 250, marginBottom: 3 }} data-aos="flip-down">
                  <Chip size="sm" variant="outlined" color="neutral" >
                    {item.roomPackages.length > 0 && item.softpowerPackages.length > 0 ? "ทั้งหมด" : item.roomPackages.length > 0 ? "ห้องพัก" : "บริการ"}
                  </Chip>
                  <h2>{item.name}</h2>
                  <Divider inset="none" />
                  <List size="sm" sx={{ mx: 'calc(-1 * var(--ListItem-paddingX))' }}>
                    <ListItem>
                      <ListItemDecorator>
                        {item.roomPackages.length > 0 ?
                          <Check /> : <Close />
                        }
                      </ListItemDecorator>
                      <span>ห้องพัก</span>
                    </ListItem>
                    <ListItem>
                      <ListItemDecorator>
                        {item.softpowerPackages.length > 0 ?
                          <Check /> : <Close />
                        }
                      </ListItemDecorator>
                      <span>บริการซอฟต์พาวเวอร์</span>
                    </ListItem>
                    <ListItem>
                      <ListItemDecorator>
                        <Check />
                      </ListItemDecorator>
                      <span>เหมาะสำหรับ {item.quantityPeople} คน</span>
                    </ListItem>
                    <ListItem>
                      <ListItemDecorator>
                        <InfoIcon color="error" />
                      </ListItemDecorator>
                      <span>{item.precautions}</span>
                    </ListItem>
                    <ListItem>
                      <ListItemDecorator>
                        {item.quantity !== 0 ?
                          <Check /> : <Close />
                        }
                      </ListItemDecorator>
                      <span>เหลือแพ็กเกจ {item.quantity} จำนวน</span>
                    </ListItem>
                  </List>
                  <Divider inset="none" />
                  <CardActions>
                    <h4 style={{ marginRight: 'auto' }}>
                      {formatNumberWithCommas(item.totalPrice)}฿{' '}
                      <span>
                        / 1 แพ็กเกจ
                      </span>
                    </h4>
                  </CardActions>
                </Card>
              </Grid>
            )) : <Lottie animationData={loadingMain}></Lottie>}
          </Grid>
          <div style={{ textAlign: "center" }}>
            <Button variant="soft"
              color="primary" data-aos="fade-down"
              endDecorator={<KeyboardArrowRight />} sx={{ width: 250, height: 50 }} onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate(routes.package)
              }}>ดูแพ็กเกจเพิ่มเติม</Button>
          </div>
        </Container>
      }
    </div>
  );
}
