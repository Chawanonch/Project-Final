import { Select, Option, Card, CardContent, Stack, AspectRatio, Button, FormControl, Input } from "@mui/joy";
import { Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getSoftpower } from "../store/features/softpowerSlice";
import { folderImage } from "../components/api/agent";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

export default function SoftpowerPage() {
  const dispatch = useAppDispatch();
  const { softpower, softpowerType } = useAppSelector((state) => state.softpower);
  const [selectType, setSelectType] = useState<number | null>(0);
  const [searchName, setSearchName] = useState<string>("");
  const navigate = useNavigate()

  const navigateToDetailPage = (softpowerId: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/softpower/${softpowerId}`)
  };

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectType(newValue)
  };

  const fetchData = async () => {
    await dispatch(getSoftpower());
  };

  const filterResult = softpower && softpower.filter(x => 
    (selectType === 0 || x.softpowerTypeId === selectType) &&
    (searchName === "" || x.name.toLowerCase().includes(searchName.toLowerCase()))
  );
  
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <Container>
      <Grid container spacing={2} justifyContent="start" alignItems="center">
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
            <FormControl sx={{ width: "auto" }}>
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
                sx={{ borderRadius: 8, width: 600 }}
              />
            </FormControl>
            <FormControl sx={{ width: "auto" }}>
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
          </Stack>
        </Grid>
        {filterResult.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ minWidth: 250 }} >
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
                    color="neutral"
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
        ))}
      </Grid>
    </Container>
  )
}
