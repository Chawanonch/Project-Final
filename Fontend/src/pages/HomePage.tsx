import { Container, Grid } from '@mui/material';
import roomReviewImage from '../images/_53885583-4a0f-49b1-9dbe-57cc27707558.jpg';
import roomReviewImage1 from '../images/_636dcd0a-9e1a-4361-9a16-e18217d640b4.jpg';
import { useAppSelector } from '../store/store';
import { Button, Card, CardContent, CardCover, Stack } from '@mui/joy';
import { folderImage } from '../components/api/agent';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';
import { formatNumberWithCommas, windowSizes } from '../components/Reuse';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function HomePage() {
  const { room, roomType } = useAppSelector((state) => state.room);
  // const { comment } = useAppSelector((state) => state.comment);
  // const { packageAll } = useAppSelector((state) => state.package);
  // const { softpower, softpowerType } = useAppSelector((state) => state.softpower);
  const navigate = useNavigate()
  const windowSize = windowSizes();

  return (
    <div style={{ marginTop: -16 }}>
        {/* รูปบนสุด */}
        <div style={{ backgroundColor: "#000", minWidth: "100%",minHeight:200, height: 550}}>
          <img src={roomReviewImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div>
            <h4 style={{ position: 'absolute', bottom: 230, left: 100, color: '#fff' }}>เยี่ยมชมรีสอร์ทเราได้ที่นี่</h4>
            <h1 style={{ position: 'absolute', bottom: 170, left: 100, color: '#fff' }}>ศรีวัฒนธรรมรีสอร์ท</h1>
          </div>
        </div>
        {/* ส่วน 1 เกี่ยวกับรีอสร์ด*/}
        {/* ส่วนซ้าย: ข้อความ */}
        <Container sx={{ padding:10 }}>
          <Grid container >
            <Grid item xs={windowSize < 1183 ? 12 : 7} sm={windowSize < 1183 ? 6:7} md={windowSize < 1183 ? 4:7}>
              <div>
                <h1>ยินดีต้อนรับสู่รีสอร์ทแม่ฮองสอน - สวรรค์ท่องเที่ยวแห่งศิลปะและวัฒนธรรม</h1>
                <p>เราเชิญทุกท่านสัมผัสประสบการณ์ท่องเที่ยวที่อันล้ำค่าในที่สุด ในแม่ฮองสอน, เราไม่เพียงแต่มีความงามของธรรมชาติและบรรยากาศที่สงบ, แต่ยังเต็มไปด้วยศิลปะและวัฒนธรรมที่ยิ่งใหญ่. นี่คือเรื่องราวของที่นี่ที่ทำให้แม่ฮองสอนเป็นที่รู้จักของนักท่องเที่ยวทั่วโลก.</p>
                <div style={{ marginTop: 20 }}></div>
                <h1>สัมผัสวัฒนธรรมท้องถิ่น</h1>
                <p>ที่นี่, วัฒนธรรมและประเพณีของชุมชนถูกนำเสนออย่างลงตัว. คุณสามารถมีโอกาสในการร่วมกิจกรรมที่นำเสนอวัฒนธรรมท้องถิ่น เช่น การทำงานศิลปะ, การฝึกซ้อมการแสดง, หรือการเข้าร่วมพิธีกรรมทางศาสนาที่อันสวยงาม.</p>
                <div style={{ marginTop: 20 }}></div>

                <h1>อาหารท้องถิ่น</h1>
                <p>ที่นี่, คุณจะได้พบกับรสชาติที่เป็นเอกลักษณ์ของอาหารท้องถิ่น. ลองสัมผัสกับรสน้ำที่มีลิ้นและอาหารสดใหม่ที่จะทำให้ประทับใจ.</p>
                <div style={{ marginTop: 20 }}></div>

                <h1>ที่พักที่สะดวกสบาย</h1>
                <p>พักผ่อนในที่พักที่เตรียมพร้อมให้คุณได้สัมผัสถึงความอบอุ่นและบรรยากาศที่เป็นมิตร. ทุกที่พักถูกออกแบบเพื่อให้คุณได้พักผ่อนและสดชื่น.</p>
                <div style={{ marginTop: 20 }}></div>
              </div>
            </Grid>
            {/* ส่วนขวา: รูปภาพ */}
            <Grid item xs={windowSize < 1183 ? 12 : 5} sm={windowSize < 1183 ? 6:5} md={windowSize < 1183 ? 4:5}>
              <div style={{ position: 'relative', flex: 1 }}>
                <img src={roomReviewImage1} alt="รูปภาพ" style={{ width: '100%', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: -20, left: 0, width: '25%', height: '25%', borderRadius: '50%', backgroundColor: '#DCF2F1' }} />
                <div style={{ position: 'absolute', bottom: 20, right: 0, width: '25%', height: '25%', borderRadius: '50%', backgroundColor: '#DCF2F1' }} />
              </div>
            </Grid>
          </Grid>
        </Container>
        {/* ส่วน 2 ห้องพัก*/}
        <Container sx={{ padding:10 }}>
          <h1 style={{ textAlign: "center" }}>ห้องพักของเรา</h1>
          <div style={{ marginTop: 20 }}></div>
          <Grid container spacing={2}>
            {room.slice(0, 6).map((item,index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ minWidth: 200 ,minHeight: 250}} size="lg" variant="outlined" key={item.id}>
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
                    <h4 style={{color:"#fff"}}>
                      {formatNumberWithCommas(item.price)} THB / ต่อคืน
                    </h4>
                    <h4 style={{color:"#fff"}}>
                      {roomType.find((type) => type.id === item.roomTypeId)?.name || 'ไม่พบข้อมูล'}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <GroupsIcon style={{ marginRight: '8px' }} color="warning" />
                      <h4 style={{color:"#fff"}}>
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
                  color="neutral"
                  endDecorator={<KeyboardArrowRight />} sx={{ width: 250, height: 50 }} onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate("/building")
            }}>ดูห้องพักเพิ่มเติม</Button>
          </div>
        </Container>
        {/* ส่วน 3 แสดงความคิดเห็น*/}
        <div style={{padding:10}}>
          <Container>
            <h1 style={{ textAlign: "center" }}>แสดงความคิดเห็น</h1>
            <div style={{ marginTop: 20 }}></div>
            <Grid container spacing={2}>
              {room.slice(0, 3).map((item,index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ minWidth: 280 ,minHeight: 250}} size="lg" variant="outlined" key={item.id}>
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
                      <h4 style={{color:"#fff"}}>
                        {formatNumberWithCommas(item.price)} THB / ต่อคืน
                      </h4>
                      <h4 style={{color:"#fff"}}>
                        {roomType.find((type) => type.id === item.roomTypeId)?.name || 'ไม่พบข้อมูล'}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <GroupsIcon style={{ marginRight: '8px' }} color="warning" />
                        <h4 style={{color:"#fff"}}>
                          {item.quantityPeople} คน
                        </h4>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <br></br>
          </Container>
        </div>
        {/* ส่วน 4 ซอฟต์พาวเวอร์*/}
        <div style={{padding:10}}>
          <Container>
            <h1 style={{ textAlign: "center" }}>ซอฟต์พาวเวอร์</h1>
            <div style={{ marginTop: 20 }}></div>
            <Grid container spacing={2}>
              {room.slice(0, 3).map((item,index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ minWidth: 280 ,minHeight: 250}} size="lg" variant="outlined" key={item.id}>
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
                      <h4 style={{color:"#fff"}}>
                        {formatNumberWithCommas(item.price)} THB / ต่อคืน
                      </h4>
                      <h4 style={{color:"#fff"}}>
                        {roomType.find((type) => type.id === item.roomTypeId)?.name || 'ไม่พบข้อมูล'}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <GroupsIcon style={{ marginRight: '8px' }} color="warning" />
                        <h4 style={{color:"#fff"}}>
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
                    color="neutral"
                    endDecorator={<KeyboardArrowRight />} sx={{ width: 250, height: 50 }} onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate("/softpower")
              }}>ดูห้องพักเพิ่มเติม</Button>
            </div>
          </Container>
        </div>
        {/* ส่วน 5 แพ็กเกจ*/}
        <div style={{padding:10}}>
          <Container>
            <h1 style={{ textAlign: "center" }}>แพ็กเกจ</h1>
            <div style={{ marginTop: 20 }}></div>
            <Grid container spacing={2}>
              {room.slice(0, 3).map((item,index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ minWidth: 280 ,minHeight: 250}} size="lg" variant="outlined" key={item.id}>
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
                      <h4 style={{color:"#fff"}}>
                        {formatNumberWithCommas(item.price)} THB / ต่อคืน
                      </h4>
                      <h4 style={{color:"#fff"}}>
                        {roomType.find((type) => type.id === item.roomTypeId)?.name || 'ไม่พบข้อมูล'}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <GroupsIcon style={{ marginRight: '8px' }} color="warning" />
                        <h4 style={{color:"#fff"}}>
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
                    color="neutral"
                    endDecorator={<KeyboardArrowRight />} sx={{ width: 250, height: 50 }} onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate("/package")
              }}>ดูห้องพักเพิ่มเติม</Button>
            </div>
          </Container>
        </div>
    </div>
  );
}
