import { Select, Option, Card, CardContent, Stack, AspectRatio, Button, FormControl, Input } from "@mui/joy";
import { Container, Grid, Pagination } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../store/store";
import { folderImage } from "../components/api/agent";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { windowSizes } from "../components/Reuse";
import { routes } from "../components/Path";
import Lottie from "lottie-react";
import loadingMain from "../components/Animation/LoadingMain.json";

export default function SoftpowerPage() {
  const { softpower, softpowerType, loading } = useAppSelector((state) => state.softpower);
  const [selectType, setSelectType] = useState<number | null>(0);
  const [searchName, setSearchName] = useState<string>("");
  const navigate = useNavigate()
  const windowSize = windowSizes();

  const navigateToDetailPage = (softpowerId: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`${routes.softpower}/${softpowerId}`)
  };

  const handleChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectType(newValue)
  };

  const filterResult = softpower && softpower.filter(x => 
    (selectType === 0 || x.softpowerTypeId === selectType) &&
    (searchName === "" || x.name.toLowerCase().includes(searchName.toLowerCase()))
  );
  
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 6;

  const paginatedSp = filterResult && filterResult.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(value);
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
            <Grid container>
              <Grid item xs={windowSize < 1183 ? 12 : 6}>
                <FormControl>
                  <h4>
                    ค้นหาชื่อซอฟต์พาวเวอร์
                  </h4>
                  <Input
                    placeholder="ค้นหา..."
                    startDecorator={
                      <Button sx={{ width: 40 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
                      </Button>
                    }
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    sx={{ borderRadius: 8}}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={windowSize < 1183 ? 4:1.85} sx={{marginLeft:windowSize < 1183 ? 0:1}}>
                <FormControl>
                  <h4>ประเภทซอฟต์พาวเวอร์</h4>
                  <Select defaultValue={0} onChange={handleChange}> 
                    <Option value={0}>
                      ทั้งหมด
                    </Option>
                    {softpowerType.map((type) => (
                      <Option key={type.id} value={type.id}>
                        {type.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        {!loading ? paginatedSp.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card size="md" variant="outlined">
                <AspectRatio minHeight="120px" maxHeight="200px">
                  <img
                    src={folderImage + item.image}
                    loading="lazy"
                    alt="error image"
                  />
                </AspectRatio>
                <CardContent orientation="horizontal">
                  <div>
                    <div>
                      <h2>{item.name}</h2>
                    </div>
                    <p>ประเภท {softpowerType.find((type) => type.id === item.softpowerTypeId)?.name || 'ไม่พบข้อมูล'}</p>
                  </div>
                  <Button
                    variant="soft"
                    color="primary"
                    endDecorator={<KeyboardArrowRight />}
                    size="md"
                    aria-label="Explore Bahamas Islands"
                    sx={{ ml: 'auto', alignSelf: 'end', fontWeight: 600 ,fontFamily: 'Sarabun' }}
                    onClick={() => navigateToDetailPage(item.id)}
                  >
                    รายละเอียด
                  </Button>
                </CardContent>
              </Card>
          </Grid>
        )):<Lottie animationData={loadingMain}></Lottie>}
      </Grid>
      {paginatedSp.length <= 0 && <h4 style={{marginBottom:140,marginTop:10}}>ไม่พบข้อมูล</h4>}
      <Grid container justifyContent="center">
        {filterResult && filterResult.length > 0 &&
          <Pagination
            count={Math.ceil(filterResult.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{marginTop:2}}
          />
        }
      </Grid>
    </Container>
  )
}
