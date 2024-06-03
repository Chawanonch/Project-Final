import { useState } from 'react';
import { Container, Grid, Pagination } from '@mui/material';
import { folderImage } from '../components/api/agent';
import { useAppSelector } from '../store/store';
import { AspectRatio, Button, Card, CardContent, Input, Stack } from '@mui/joy'
import { useNavigate } from 'react-router-dom';
import NavigationIcon from '@mui/icons-material/Navigation';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { routes } from '../components/Path';
import Lottie from "lottie-react";
import loadingMain from "../components/Animation/LoadingMain.json";
import { convertToBuddhistYear, convertToGregorianYear, windowSizes } from '../components/Reuse';

const BuildingPage = () => {
  const { building, room, loading} = useAppSelector((state) => state.room);
  const { bookings } = useAppSelector((state) => state.booking);
  const [start, setStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [end, setEnd] = useState<string>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
  );
  const daysDiff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (24 * 60 * 60 * 1000));

  const navigate = useNavigate()

  const navigateToRoomPage = (buildingId: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`${routes.rooms}/${buildingId}`, {
      state: { start, end }
    });
  };

  const getRoomCount = (buildingId: number) => {
    const roomsForBuilding = room.filter((r) => r.buildingId === buildingId);
    const bookingsForBuilding = bookings.filter((x) => {
      const xEndDate = new Date(x.end);
      const startDateTime = new Date(start);
      const xEndDateWithoutTime = new Date(xEndDate.getFullYear(), xEndDate.getMonth(), xEndDate.getDate());
      const startDateTimeWithoutTime = new Date(startDateTime.getFullYear() + 543, startDateTime.getMonth(), startDateTime.getDate());
      const isStartAfterEnd = startDateTimeWithoutTime.getTime() >= xEndDateWithoutTime.getTime();

      return roomsForBuilding.some((room) =>
        x.listRooms.some((listRoom) =>
          listRoom.roomId === room.id &&
          (x.status === 1 || x.status === 2) &&
          (isStartAfterEnd || startDateTimeWithoutTime.getTime() > xEndDateWithoutTime.getTime())
        )
      );
    });

    const sumRoom = roomsForBuilding.reduce((total, room) => total + room.quantityRoom, 0);
    const bookedRoomCount = bookingsForBuilding.reduce((total, booking) => total + booking.listRooms.reduce((acc, listRoom) => acc + listRoom.quantityRoom - listRoom.quantityRoomExcess, 0), 0);
    const allCount = sumRoom + bookedRoomCount ;
    const checkCount = bookedRoomCount;
    return { allCount, checkCount };
  };
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 6;
  const filterBuilding = building && building;

  const paginatedBuilding = filterBuilding && filterBuilding.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(value);
  };
  const windowSize = windowSizes();

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
            <Grid container alignItems="center" >
              <Grid item xs={windowSize < 1183 ? 12 : 2}>
                <h4>เลือกวันที่</h4>
                <Input type="date" slotProps={{
                  input: {
                    min: convertToBuddhistYear(new Date().toISOString().split('T')[0]),
                  },
                }} name="start" value={convertToBuddhistYear(start)} onChange={
                  (e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setStart('');
                      return;
                    }
                    const newYear = convertToGregorianYear(e.target.value)
                    setStart(newYear)
                    if (new Date(newYear) >= new Date(end)) {
                      setEnd(new Date(new Date(newYear).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                    }
                  }} />
              </Grid>
              <Grid item xs={windowSize < 1183 ? 12 : 2} sx={{marginLeft:windowSize < 1183 ? 0:1}}>
                <h4>ถึง</h4>
                <Input type="date" slotProps={{
                  input: {
                    min: start
                      ? convertToBuddhistYear(new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split('T')[0])
                      : convertToBuddhistYear(new Date().toISOString().split('T')[0]),
                  },
                }} name="end" value={convertToBuddhistYear(end)} onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setEnd('');
                    return;
                  }
                  const newYear = convertToGregorianYear(e.target.value)
                  setEnd(newYear)
                }
                } />
              </Grid>
              <Grid item xs={windowSize < 1183 ? 12 : 3} sx={{marginLeft:windowSize < 1183 ? 0:1, marginTop:windowSize < 1183 ? 0:2}}>
                {start && end && <h4>
                  {new Date(start).toLocaleDateString()} ถึง {new Date(end).toLocaleDateString()} จอง {daysDiff} คืน
                </h4>
                }
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        {!loading && paginatedBuilding ? paginatedBuilding.map((item, index) => {
          const countRoom = getRoomCount(item.id)
          return (
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
                    <p>ที่ตั้ง {item.location}</p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={{ color: countRoom.allCount === 0 ? "#C83B55" : "#000" }}>
                        ห้องว่าง {countRoom.allCount}
                        {countRoom.checkCount > 0 &&
                          <NavigationIcon color='success' sx={{ fontSize: 15 }} />
                        }
                        {" "}ห้อง
                      </h4>
                    </div>
                  </div>
                  <Button
                    size="md"
                    variant="soft"
                    color="primary"
                    endDecorator={<KeyboardArrowRight />}
                    aria-label="Explore Bahamas Islands"
                    sx={{ ml: 'auto', alignSelf: 'end', fontWeight: 600, fontFamily: 'Sarabun' }}
                    onClick={() => navigateToRoomPage(item.id)}
                    disabled={start && end && countRoom.allCount !== 0 ? false : true}
                  >
                    ดูห้องพัก
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        }):<Lottie animationData={loadingMain}></Lottie>}
      </Grid>
      <Grid container justifyContent="center">
        {building && building.length > 0 &&
          <Pagination
            count={Math.ceil(building.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ marginTop: 2 }}
          />
        }
      </Grid>
    </Container>
  );
};

export default BuildingPage;
