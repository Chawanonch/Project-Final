import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { clearRoomInBasket, createRoomInBasket, getBuildingAndRoom, removeRoomFromBasket } from '../store/features/room&BuildingSlice';
import { useEffect, useRef, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { AspectRatio, Breadcrumbs, Button, Card, CardContent, CardOverflow, IconButton, Input, Link, Modal, ModalClose, Sheet, Stack, Typography } from '@mui/joy';
import { folderImage } from '../components/api/agent';
import BoyIcon from '@mui/icons-material/Boy';
import { Room } from '../components/models/room';
import { bookingRoomUser, getBookingByUser } from '../store/features/bookingSlice';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { formatNumberWithCommas } from '../components/Reuse';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Close from "@mui/icons-material/Close";
import NavigationIcon from '@mui/icons-material/Navigation';

const RoomPage = () => {
  const { id } = useParams();
  const { room, roomType, building, basketRoom } = useAppSelector((state) => state.room);
  const { bookings } = useAppSelector((state) => state.booking);
  const { token } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [showAll, setShowAll] = useState(false);

  const [expandedRooms, setExpandedRooms] = useState(new Array(room.length).fill(false));
  const [countRoom, setCountRoom] = useState<number>(1);

  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [start, setStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [end, setEnd] = useState<string>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
  );
  const daysDiff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (24 * 60 * 60 * 1000));
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const getStart = searchParams.get('start');
  const getEnd = searchParams.get('end');
  const [open, setOpen] = useState<boolean>(false);
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  const openModel = (item: Room, totalQuantity: number) => {

    if (token !== "") {
      if (start && end) {
        setDetailRoom(item)
        setOpen(true)
        setCountRoom(1)
        setTotalQuantity(totalQuantity)
      } else alert("กรุณาป้อนวันที่จอง")
    }
    else {
      navigate("/login")
    }
  };

  const closeModel = () => {
    setDetailRoom(null)
    setOpen(false)
  };
  useEffect(() => {
    if (getStart || getEnd) {
      setStart(getStart || "")
      setEnd(getEnd || "")
    }
  }, [])

  // const bookingRoomByUser = async () => {
  //   fetchData()

  //   let totalQuantityExcess = 0;

  //   if (detailRoom) {
  //     const item1 = room.find((x) => x.id === detailRoom.id)
  //     if (item1 !== undefined) {
  //       if (countRoom > item1.quantityRoom)
  //         totalQuantityExcess = countRoom - item1.quantityRoom;

  //       console.log(countRoom)
  //       console.log(item1.quantityRoom)
  //     }
  //   }
  //   if (user[0]?.phone === "") {
  //     navigate('/settings');
  //   }
  //   if (start && end && countRoom && detailRoom?.id) {
  //     const item = await dispatch(bookingRoomUser({ start, end, quantityRoom: countRoom, quantityRoomExcess: totalQuantityExcess, roomId: detailRoom?.id }));
  //     if (item.payload !== "" && item.payload !== undefined) {
  //       setOpen(false)
  //       Swal.fire({
  //         position: "center",
  //         icon: 'success',
  //         title: 'ทำการจองเสร็จสิน ไปหน้าชำระเงิน !',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });
  //     }
  //     else {
  //       Swal.fire({
  //         position: "center",
  //         icon: 'info',
  //         title: 'กรุณาป้อนให้ถูกต้อง !',
  //         showConfirmButton: false,
  //         timer: 1000
  //       });
  //     }
  //   } else {
  //     Swal.fire({
  //       position: "center",
  //       icon: 'info',
  //       title: 'กรุณาป้อนให้ถูกต้อง !',
  //       showConfirmButton: false,
  //       timer: 1000
  //     });
  //   }
  // };

  const fetchData = async () => {
    await dispatch(getBuildingAndRoom());
    if (token !== "") await dispatch(getBookingByUser());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleShowAll = (index: number) => {
    setShowAll(!showAll)
    setExpandedRooms((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const navigateToBuildingPage = () => {
    navigate("/building")
  };

  const rooms = room.filter((x) => x.buildingId === Number(id))

  const bookingsForBuilding = bookings.filter((x) => {
    const xEndDate = new Date(x.end);
    const startDateTime = new Date(start);
    const xEndDateWithoutTime = new Date(xEndDate.getFullYear(), xEndDate.getMonth(), xEndDate.getDate());
    const startDateTimeWithoutTime = new Date(startDateTime.getFullYear() + 543, startDateTime.getMonth(), startDateTime.getDate());

    const isStartAfterEnd = startDateTimeWithoutTime.getTime() >= xEndDateWithoutTime.getTime();

    const roomIds = x.listRooms.map(room => room.roomId);

    return roomIds.some((roomId) =>
      rooms.some((room) =>
        room.id === roomId &&
        (x.status === 1 || x.status === 2) &&
        (isStartAfterEnd || xEndDateWithoutTime.getTime() === startDateTimeWithoutTime.getTime())
      )
    );
  });

  const updatedRooms = rooms.map((room) => {
    const matchingBookings = bookingsForBuilding.filter((booking) =>
      booking.listRooms.some((listRoom) => listRoom.roomId === room.id)
    );
  
    const bookedRoomCountForRoom = matchingBookings.reduce((total, booking) =>
      total + booking.listRooms.reduce((quantityTotal, listRoom) =>
        listRoom.roomId === room.id ? quantityTotal + listRoom.quantityRoom : quantityTotal, 0), 0);
  
    return {
      ...room,
      totalQuantity: room.quantityRoom + bookedRoomCountForRoom,
      bookedRoomCountForRoom: bookedRoomCountForRoom, // เพิ่ม property ใหม่
    };
  });

  const allSelectRoom = () => {
    let totalQuantityExcess = 0;

    if (detailRoom) {
      const item1 = room.find((x) => x.id === detailRoom.id)
      if (item1 !== undefined) {
        if (countRoom > item1.quantityRoom)
          totalQuantityExcess = countRoom - item1.quantityRoom;
      }
      dispatch(createRoomInBasket({ ...detailRoom, quantityRoomBuy:countRoom,  quantityRoomExcessBuy:totalQuantityExcess}));
      closeModel()
    }
  };

  const removeRoom = (id: number) => {
    dispatch(removeRoomFromBasket(id))
  };

  const bookingRoomList = async () => {
    if (start && end && countRoom && basketRoom) {
      const item = await dispatch(bookingRoomUser({ start, end, basketRoom }));
      if (item.payload !== "" && item.payload !== undefined) {
        closeModel()
        await dispatch(clearRoomInBasket())
        Swal.fire({
          position: "center",
          icon: 'success',
          title: 'ทำการจองเสร็จสิน โปรดไปหน้าชำระเงิน !',
          showConfirmButton: false,
          timer: 1500
        });
      }
      else {
        Swal.fire({
          position: "center",
          icon: 'info',
          title: 'กรุณาป้อนให้ถูกต้อง !',
          showConfirmButton: false,
          timer: 1000
        });
      }
    } else {
      Swal.fire({
        position: "center",
        icon: 'info',
        title: 'กรุณาป้อนให้ถูกต้อง !',
        showConfirmButton: false,
        timer: 1000
      });
    }
  };
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <Container>
          <div>
            <div>
              <Breadcrumbs aria-label="breadcrumbs" sx={{ padding: 0 }}>
                {['อาคาร'].map((item: string) => (
                  <Link key={item} color="neutral" onClick={navigateToBuildingPage}>
                    {item}
                  </Link>
                ))}
                <Typography>ห้องพัก</Typography>
              </Breadcrumbs>

              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid item xs={1.5}>
                  <h2>{building.find((bui) => bui.id === Number(id))?.name || 'ไม่พบข้อมูล'}</h2>
                </Grid>
                <Grid item xs={9}>
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

                  </Stack>
                </Grid>
              </Grid>
            </div>
            <div>
            </div>
          </div>

          <Grid container spacing={2} sx={{ marginTop: 0 }}>
            <Grid item xs={8}>
              {updatedRooms.map((item, index) => {
                return (
                  <Card sx={{ marginBottom: 3, minWidth:100 }} orientation="horizontal" size="lg" variant="outlined" key={index} >
                    <CardOverflow>
                      <AspectRatio ratio="1" sx={{ minWidth: 250 }}>
                        <img
                          src={folderImage + item.image}
                          loading="lazy"
                          alt="error image"
                        />
                      </AspectRatio>
                    </CardOverflow>
                    <CardContent orientation="horizontal">
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h2>
                            {roomType.find((type) => type.id === item.roomTypeId)?.name || 'ไม่พบข้อมูล'}
                          </h2>
                          <p style={{ display: 'flex', alignItems: 'center' }}>
                            <BoyIcon style={{ marginRight: '8px' }} />
                            นอนได้ {item.quantityPeople} คน

                          </p>
                          <p>
                            จำนวนห้องที่ว่าง {item.totalQuantity}{item.bookedRoomCountForRoom > 0 &&
                              <NavigationIcon color='success' sx={{fontSize:15}} />
                            }
                            {" "}
                          </p>
                          {expandedRooms[index] ? (
                            <div>
                              <p>
                                รายละเอียด {item.detail}
                              </p>
                              <Button variant="outlined" onClick={() => toggleShowAll(index)}>
                                รายละเอียดน้อยลง
                              </Button>
                            </div>
                          ) : (
                            <p>
                              {item.detail && item.detail.length > 300 ? (
                                <>
                                  รายละเอียด {item.detail.substring(0, 300)}
                                  <Button variant="outlined" onClick={() => toggleShowAll(index)}>
                                    รายละเอียดเพิ่มเติม
                                  </Button>
                                </>
                              ) : (
                                item.detail
                              )}
                            </p>
                          )}
                        </div>
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                          <div>

                          </div>
                          <div style={{ display: 'flex', alignItems: "center" }}>
                            <div style={{ textAlign: 'right' }}>
                              <h4>
                                THB {formatNumberWithCommas(item.price)}
                              </h4>
                              <h4>
                                ราคาต่อคืน
                              </h4>
                            </div>
                            <div style={{ marginLeft: 10 }}>
                              <Button
                                variant="soft"
                                color="neutral"
                                endDecorator={<KeyboardArrowRight />}
                                sx={{ fontWeight: 600, height: 50, width: 150, fontFamily: 'Sarabun' }}
                                onClick={() => openModel(item, item.totalQuantity)}
                                disabled={item.totalQuantity === 0 ? true : false}
                              >
                                จองห้องพัก
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </Grid>
            <Grid item xs={4}>
              <Card size="lg" variant="outlined">
                <h3>ตะกร้าห้องพัก</h3>
                {start && end && <h4>
                  {new Date(start).toLocaleDateString()} ถึง {new Date(end).toLocaleDateString()} จอง {daysDiff} คืน
                </h4>
                }
                {basketRoom.length > 0 &&
                  basketRoom.map((selectRoom, index) => (
                    <Grid container alignItems="center" key={index}>
                      <Grid item xs={10}>
                        <h4>{roomType.find((type) => type.id === selectRoom.roomTypeId)?.name || 'ไม่พบข้อมูล'}</h4>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton onClick={() => removeRoom(selectRoom.id)}>
                          <Close color="error" />
                        </IconButton>
                      </Grid>
                      <Grid item xs={8}>
                        <p>จำนวน</p>
                      </Grid>
                      <Grid item xs={4}>
                        <p>{selectRoom.quantityRoomBuy} ห้อง</p>
                      </Grid>
                      <Grid item xs={8}>
                        <p>ราคา</p>
                      </Grid>
                      <Grid item xs={4}>
                        <p>{formatNumberWithCommas(selectRoom.price)} บาท</p>
                      </Grid>
                    </Grid>
                  ))}
                <div style={{ borderTop: '1px solid #7F8C8D' }}></div>
                {basketRoom.length > 0 ?
                  <Grid container alignItems="center">
                    <Grid item xs={8}><h4>ราคารวม</h4></Grid>
                    <Grid item xs={4}><h4> {formatNumberWithCommas(
                      basketRoom.reduce((total: number, pkg) => total + pkg.price * pkg.quantityRoomBuy, 0) * daysDiff
                    )} บาท</h4></Grid>
                    <Grid item xs={8}><h4>จำนวนทั้งหมด</h4></Grid>
                    <Grid item xs={4}> <h4> {formatNumberWithCommas(
                      basketRoom.reduce((total: number, pkg) => total + pkg.quantityRoomBuy, 0)
                    )} ห้อง</h4></Grid>
                  </Grid>
                  : <h4>ยังไม่มีรายการ</h4>}

                <Button
                  variant="soft"
                  color="neutral"
                  endDecorator={<KeyboardArrowRight />}
                  sx={{ fontFamily: 'Sarabun' }}
                  disabled={basketRoom.length > 0 ? false : true}
                  onClick={bookingRoomList}
                >
                  จองทั้งหมด
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </motion.div>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={closeModel}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 1300,
            maxHeight: 600,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg'
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Grid container spacing={2} sx={{ maxHeight: '600px', overflowY: 'auto' }}>
            <Grid item xs={6}>
              <img
                src={folderImage + detailRoom?.image}
                alt="error image"
                width={620}
              />
              <Grid container spacing={2}>
                {detailRoom && detailRoom?.roomImages?.slice(0, 3).map((value, index) => (
                  <Grid item xs={2} key={index}>
                    <img src={folderImage + value.image} alt="Preview" width={100} />
                  </Grid>
                ))}
              </Grid>
              <div style={{ marginTop: 20 }} />
              <h2>
                {roomType.find((type) => type.id === detailRoom?.roomTypeId)?.name || 'ไม่พบข้อมูล'}
              </h2>
              <p>
                {detailRoom?.detail}
              </p>
            </Grid>
            <Grid item xs={3}>
              <h3>จำนวนเข้าพักสูงสุด</h3><div style={{ marginTop: 20 }} />

              <h3>จำนวนห้องพักที่พักได้</h3><div style={{ marginTop: 20 }} />
              <h3>ราคา</h3> <div style={{ marginTop: 20 }}></div>
              <h3>รายละเอียดการจอง</h3> <div style={{ marginTop: 20 }} />
              <h3>จองวันที่</h3> <div style={{ marginTop: 20 }} />
              <h3>ราคารวม</h3> <div style={{ marginTop: 20 }} />
              <h3>จำนวนห้องที่ต้องการ</h3> <div style={{ marginTop: 20 }} />
            </Grid>
            <Grid item xs={3} sx={{ marginLeft: -10 }}>
              <div style={{ marginTop: 5 }} />
              <h4>{detailRoom?.quantityPeople} คน</h4><div style={{ marginTop: 22 }} />
              <h4>{totalQuantity} ห้อง</h4><div style={{ marginTop: 22 }} />
              <h4>{formatNumberWithCommas(Number(detailRoom?.price))} บาท/ต่อคืน</h4><div style={{ marginTop: 24 }} />

              <h4>จอง  {countRoom} ห้อง / {daysDiff} คืน</h4><div style={{ marginTop: 23 }} />
              <h4> {new Date(start).toLocaleDateString()} 12.30 ถึง {new Date(end).toLocaleDateString()} 10.30</h4><div style={{ marginTop: 26 }} />
              <h4>{formatNumberWithCommas(Number(detailRoom?.price) * countRoom * daysDiff)} บาท</h4><div style={{ marginTop: 20 }} />
              <Input
                type="number"
                name="countRoom"
                sx={{ width: 100 }}
                defaultValue={1}
                slotProps={{
                  input: {
                    ref: inputRef,
                    min: 1,
                    max: Number(totalQuantity),
                    step: 1,
                  },
                }}
                onChange={(e) => setCountRoom(Number(e.target.value))}
              />
            </Grid>
          </Grid>
          <div>
            <Button
              variant="soft"
              color="neutral"
              endDecorator={<KeyboardArrowRight />}
              sx={{
                fontWeight: 600,
                height: 20,
                width: 500, // Make the button take the full width of the modal
                position: 'absolute',
                right: 100, // Align it to the left
                bottom: 0,
                fontFamily: 'Sarabun'
              }}
              onClick={allSelectRoom}
            >
              จองห้องพัก
            </Button>
          </div>
        </Sheet>
      </Modal>
    </div>

  );
};

export default RoomPage;
