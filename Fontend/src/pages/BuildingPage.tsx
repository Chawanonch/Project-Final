import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { folderImage } from '../components/api/agent';
import { useAppDispatch, useAppSelector } from '../store/store';
import { getBuildingAndRoom } from '../store/features/room&BuildingSlice';
import { AspectRatio, Button, Card, CardContent, Input, Stack } from '@mui/joy'
import { useNavigate } from 'react-router-dom';
import { getBookingByUser } from '../store/features/bookingSlice';
import NavigationIcon from '@mui/icons-material/Navigation';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const BuildingPage = () => {
  const dispatch = useAppDispatch();
  const { building, room } = useAppSelector((state) => state.room);
  const { bookings } = useAppSelector((state) => state.booking);
  const { token } = useAppSelector((state) => state.user);
  const [start, setStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [end, setEnd] = useState<string>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
  );
  const daysDiff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (24 * 60 * 60 * 1000));

  const navigate = useNavigate()
  const fetchData = async () => {
    await dispatch(getBuildingAndRoom());
    if(token !== "") await dispatch(getBookingByUser());
  };
  useEffect(() => {
    fetchData();
  }, []);

  const navigateToRoomPage = (buildingId: number) => {
    navigate(`/rooms/${buildingId}?start=${start}&end=${end}`)
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
      const bookedRoomCount = bookingsForBuilding.reduce((total, booking) => total + booking.listRooms.reduce((acc, listRoom) => acc + listRoom.quantityRoom, 0), 0);
      const allCount = sumRoom + bookedRoomCount;
      const checkCount  = bookedRoomCount;
      return {allCount, checkCount};
  };
  
  return (
    <Container>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
            <h4>เลือกวันที่</h4>
            <Input type="date" slotProps={{
              input: {
                min: new Date().toISOString().split('T')[0],
              },
            }} name="start" value={start.toString().split('T')} onChange={
              (e) => {
                setStart(e.target.value)
                if (new Date(e.target.value) >= new Date(end)) {
                  setEnd(new Date(new Date(e.target.value).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                }
              }} />
            <h4>ถึง</h4>
            <Input type="date" slotProps={{
              input: {
                min: start
                  ? new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
                  : new Date().toISOString().split('T')[0],
              },
            }} name="end" value={end.toString().split('T')} onChange={(e) => setEnd(e.target.value)} />
            {start && end && <h4>
              {new Date(start).toLocaleDateString()} ถึง {new Date(end).toLocaleDateString()} จอง {daysDiff} คืน
              </h4>
            }
          </Stack>
        </Grid>
        {building.map((item, index) => {
          const countRoom = getRoomCount(item.id)
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ minWidth: 250 }} size="lg" variant="outlined" >
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
                    <div style={{display:"flex",alignItems:"center"}}>
                      <h4>
                        ห้องว่าง {countRoom.allCount} 
                        {countRoom.checkCount > 0 &&
                         <NavigationIcon color='success' sx={{fontSize:15}} />
                        }
                        {" "}ห้อง
                      </h4>
                    </div>
                  </div>
                  <Button
                    size="md"
                    variant="soft"
                    color="neutral"
                    endDecorator={<KeyboardArrowRight />}
                    aria-label="Explore Bahamas Islands"
                    sx={{ ml: 'auto', alignSelf: 'end', fontWeight: 600,fontFamily: 'Sarabun' }}
                    onClick={() => navigateToRoomPage(item.id)}
                    disabled={start && end && countRoom.allCount !== 0 ? false : true}
                  >
                    ดูห้องพัก
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default BuildingPage;
