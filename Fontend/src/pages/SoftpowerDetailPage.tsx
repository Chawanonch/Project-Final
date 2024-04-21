import { Container, Grid } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';
import { folderImage } from '../components/api/agent';
import { AspectRatio, Breadcrumbs, Button, Card, CardContent, Link } from '@mui/joy';
import { motion } from 'framer-motion';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useEffect, useState } from 'react';
import { getSoftpower } from '../store/features/softpowerSlice';

export default function SoftpowerDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { softpower, softpowerType } = useAppSelector((state) => state.softpower);
  const navigate = useNavigate()
  const [page, setPage] = useState(0); // เพิ่ม state เพื่อเก็บหน้าปัจจุบัน
  const item = softpower && softpower.find((x) => x.id === Number(id));
  const itemsPerPage = 3; // จำนวนรายการต่อหน้า

  const filteredSoftpowers = softpower.filter(x => x.id !== Number(id) && x.softpowerTypeId === item?.softpowerTypeId);

  const pageCount = Math.ceil(filteredSoftpowers.length / itemsPerPage); // คำนวณจำนวนหน้าทั้งหมด

  const start = page * itemsPerPage; // ดำเนินการเริ่มต้นจากไหน
  const end = start + itemsPerPage; // และจบที่ไหน

  const goToNextPage = () => setPage(Math.min(page + 1, pageCount - 1)); // ไปหน้าถัดไป
  const goToPrevPage = () => setPage(Math.max(page - 1, 0)); // ย้อนกลับ

  const fetchData = async () => {
    await dispatch(getSoftpower());
  };

  const navigateToSoftpowerPage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate("/softpower")
  };

  const navigateToSoftpowerDetailPage = (softpowerId: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/softpower/${softpowerId}`)
    
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  
  const borderBottom = () => {
    return <div style={{ borderBottom: "1px solid #BDBDBD", marginTop: 10, marginBottom: 10 }} />
  }

  return (
    <Container>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Breadcrumbs aria-label="breadcrumbs" sx={{ padding: 0 }}>
          {['ซอฟต์พาวเวอร์'].map((item: string) => (
            <Link key={item} color="neutral" onClick={navigateToSoftpowerPage}>
              {item}
            </Link>
          ))}
          <h4>รายละเอียด</h4>
        </Breadcrumbs>
        <div style={{ marginTop: 10 }} />
        <div className="slide-container">
          <Slide>
            {item?.softpowerImages.map((slideImage, index) => (
              <div key={index}>
                <img style={{ width: '100%', maxHeight: 560 }} src={folderImage + slideImage.image} />
                {/* <span style={spanStyle}>{slideImage.caption}</span> */}
              </div>
            ))}
          </Slide>
        </div>

        <div style={{ marginTop: 10 }}>
          <h1>{item?.name && item.name}</h1>
          {borderBottom()}
          <h3>ประเภท {softpowerType.find((type) => type.id === item?.softpowerTypeId)?.name || 'ไม่พบข้อมูล'}</h3>
        </div>

        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3>ชื่ออื่น</h3>
          <p style={{ marginLeft: 10 }}>{item?.importantName && item.importantName}</p>
        </div>

        <br />
        <div>
          <h3>คืออะไร</h3>
          {borderBottom()}
          <p style={{ textIndent: "20px" }}>{item?.whatIs && item.whatIs}</p>
        </div>

        <br />
        <div>
          <h3>ที่มา</h3>
          {borderBottom()}
          <p style={{ textIndent: "20px" }}>{item?.origin && item.origin}</p>
        </div>

        <br />
        <div>
          <h3>อ้างอิง</h3>
          {borderBottom()}
          <p>{item?.refer && item.refer}</p>
        </div>

        <br />
        <br />
        <br />
        <div>
          <h3>ซอฟต์พาวเวอร์อื่นๆ ในประเภทเดียวกัน</h3>
          {borderBottom()}
          {pageCount > 0 ?
            <div>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                {filteredSoftpowers.slice(start, end).map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      variant="outlined"
                      orientation="horizontal"
                      sx={{
                        width: 320,
                        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                      }}
                    >
                      <AspectRatio ratio="1" sx={{ width: 90 }}>
                        <img
                          src={folderImage + item.image}
                          loading="lazy"
                          alt="error image"
                        />
                      </AspectRatio>
                      <CardContent>
                        <h2>
                          {item.name}
                        </h2>
                        <p>
                          ประเภท {softpowerType.find((type) => type.id === item.softpowerTypeId)?.name || 'ไม่พบข้อมูล'}
                        </p>
                        <Button
                          variant="soft"
                          color="neutral"
                          endDecorator={<KeyboardArrowRight />}
                          size="md"
                          aria-label="Explore Bahamas Islands"
                          sx={{ ml: 'auto', alignSelf: 'end', fontWeight: 600, fontFamily: 'Sarabun' }}
                          onClick={() => navigateToSoftpowerDetailPage(item.id)}
                        >
                          รายละเอียด
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <br />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <Button variant="soft"
                  color="neutral" disabled={page === 0} onClick={goToPrevPage} endDecorator={<KeyboardArrowLeft />}>
                  กลับ
                </Button>
                <Button variant="soft"
                  color="neutral" disabled={page === pageCount - 1} onClick={goToNextPage} startDecorator={<KeyboardArrowRight />}>
                  ถัดไป
                </Button>
              </div>
            </div>
            :
            <h4>ไม่พบข้อมูล</h4>
          }
          
        </div>
      </motion.div>
    </Container>
  )
}
