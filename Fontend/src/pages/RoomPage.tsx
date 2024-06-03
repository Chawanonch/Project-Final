import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { clearRoomInBasket, createRoomInBasket, removeRoomFromBasket } from '../store/features/room&BuildingSlice';
import { useEffect, useRef, useState } from 'react';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { Breadcrumbs, Button, Card, CardContent, CardOverflow, IconButton, Input, Link, Modal, ModalClose, ModalDialog, ModalDialogProps, Stack, Typography } from '@mui/joy';
import { folderImage } from '../components/api/agent';
import BoyIcon from '@mui/icons-material/Boy';
import { Room } from '../components/models/room';
import { bookingRoomUser, getBookingByUser } from '../store/features/bookingSlice';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { convertToBuddhistYear, convertToGregorianYear, formatNumberWithCommas } from '../components/Reuse';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Close from "@mui/icons-material/Close";
import NavigationIcon from '@mui/icons-material/Navigation';
import { windowSizes } from '../components/Reuse';
import { routes } from '../components/Path';
import Lottie from "lottie-react";
import loadingMain from "../components/Animation/LoadingMain.json";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Slide } from 'react-slideshow-image';
import WeekendIcon from '@mui/icons-material/Weekend';

const RoomPage = () => {
  const { id } = useParams();
  
  const { room, roomType, building, basketRoom, loading } = useAppSelector((state) => state.room);
  const { bookings } = useAppSelector((state) => state.booking);
  const { token } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [showAll, setShowAll] = useState(false);
  const windowSize = windowSizes();

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
  const { start:startSend, end:endSend } = location.state || {};

  const [open, setOpen] = useState<boolean>(false);
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [layout, setLayout] = useState<ModalDialogProps['layout'] | undefined>(
    undefined,
  );

  const openModel = (item: Room, totalQuantity: number) => {
    if (start && end) {
      setDetailRoom(item)
      setOpen(true)
      setCountRoom(1)
      setTotalQuantity(totalQuantity)
    } else alert("กรุณาป้อนวันที่จอง")
  };

  const closeModel = () => {
    setDetailRoom(null)
    setOpen(false)
  };
  useEffect(() => {
    if (startSend || endSend) {
      setStart(startSend || "")
      setEnd(endSend || "")
    }
  }, [])

  const toggleShowAll = (index: number) => {
    setShowAll(!showAll)
    setExpandedRooms((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const navigateToBuildingPage = () => {
    navigate(routes.building)
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
        listRoom.roomId === room.id ? quantityTotal + listRoom.quantityRoom - listRoom.quantityRoomExcess : quantityTotal, 0), 0);

    return {
      ...room,
      totalQuantity: room.quantityRoom + bookedRoomCountForRoom,
      bookedRoomCountForRoom: bookedRoomCountForRoom, // เพิ่ม property ใหม่
    };
  });
  const itemsPerPage = 3;

  const paginatedRoom = updatedRooms && updatedRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(value);
  };

  const allSelectRoom = () => {
    let totalQuantityExcess = 0;
    if (token !== "") {
      if (detailRoom) {
        const item1 = room.find((x) => x.id === detailRoom.id)
        
        if (item1 !== undefined && item1 !== null) {
          const matchingBookings = bookingsForBuilding.filter((booking) =>
            booking.listRooms.some((listRoom) => listRoom.roomId === item1.id)
          );
      
          const bookedRoomCountForRoom = matchingBookings.reduce((total, booking) =>
            total + booking.listRooms.reduce((quantityTotal, listRoom) =>
              listRoom.roomId === item1.id ? quantityTotal + listRoom.quantityRoom : quantityTotal, 0), 0);
      
          const checkRoom = item1.quantityRoom + bookedRoomCountForRoom

          if(countRoom > checkRoom){
            Swal.fire({
              position: "center",
              icon: 'info',
              title: 'คุณป้อนห้องพักเกินจำนวน !',
              showConfirmButton: false,
              timer: 1000
            });
            return;
          }

          if (countRoom > item1.quantityRoom){
            totalQuantityExcess = countRoom - item1.quantityRoom;
          }
          
          const basketRoom = {
            ...detailRoom,
            quantityRoomBuy: countRoom,
            quantityRoomExcessBuy: totalQuantityExcess,
          };
          dispatch(createRoomInBasket({ token, basketRoom }));
          closeModel()
        }
      }
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(routes.login)
    }
  };

  const removeRoom = (id: number) => {
    dispatch(removeRoomFromBasket({token, id}))
  };

  const bookingRoomList = async () => {
    if (start && end && countRoom && basketRoom) {
      const item = await dispatch(bookingRoomUser({ start, end, basketRoom }));
      if (item.payload !== "" && item.payload !== undefined) {
        await dispatch(getBookingByUser());
        closeModel()
        await dispatch(clearRoomInBasket())
        Swal.fire({
          position: "center",
          icon: 'success',
          title: 'เสร็จสิ้น โปรดไปหน้าชำระเงิน !',
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
                <Grid item xs={windowSize < 1183 ? 12 : 1.5}>
                  <h2>{building.find((bui) => bui.id === Number(id))?.name || 'ไม่พบข้อมูล'}</h2>
                </Grid>
                <Grid item xs={windowSize < 1183 ? 12 : 9}>
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
                      <Grid item xs={windowSize < 1183 ? 12 : 2} sx={{ marginLeft: windowSize < 1183 ? 0 : 1 }}>
                        <h4>ถึง</h4>
                        <Input type="date" slotProps={{
                          input: {
                            min: start
                              ? convertToBuddhistYear(new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000)
                                .toISOString()
                                .split('T')[0])
                              : convertToBuddhistYear(new Date().toISOString().split('T')[0]),
                          },
                        }} name="end" value={convertToBuddhistYear(end)} onChange={(e) => 
                        {
                          const value = e.target.value;
                          if (value === '') {
                            setEnd('');
                            return;
                          }
                          const newYear = convertToGregorianYear(e.target.value)
                          setEnd(newYear)
                        }} />
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
            </div>
            <div>
            </div>
          </div>

          <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 0 }}>
            <Grid item xs={windowSize < 1183 ? 12 : 8}>
              {!loading ? paginatedRoom.map((item, index) => {
                return (
                  <Card sx={{ marginBottom: 3, minWidth: 100 }} orientation="horizontal" size="md" variant="outlined" key={index}>
                    <Grid container spacing={2}>
                      <Grid item xs={windowSize < 1183 ? 12 : 6}>
                        <CardOverflow>
                          <img
                            src={folderImage + item.image}
                            loading="lazy"
                            alt="error image"
                            style={{ minWidth: 150, borderRadius: 5 }}
                          />
                        </CardOverflow>
                      </Grid>
                      <Grid item xs={windowSize < 1183 ? 12 : 6}>
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
                              <p style={{ display: 'flex', alignItems: 'center' }}>
                                <WeekendIcon style={{ marginRight: '8px' }} />
                                จำนวนห้องที่ว่าง {item.totalQuantity}{item.bookedRoomCountForRoom > 0 &&
                                  <NavigationIcon color='success' sx={{ fontSize: 15 }} />
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
                                    color="primary"
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
                      </Grid>
                    </Grid>
                  </Card>
                )
              }) : <Lottie animationData={loadingMain}></Lottie>}
              <Grid container justifyContent="center">
                {updatedRooms && updatedRooms.length > 0 &&
                  <Pagination
                    count={Math.ceil(updatedRooms.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{ marginTop: 2 }}
                  />
                }
              </Grid>
            </Grid>
            {windowSize > 1183 &&
              <Grid item xs={4}>
                <Card size="lg" variant="outlined" sx={{ minWidth: 100, position: "sticky", top: 100 }}>
                  <h3>ตะกร้าห้องพัก</h3>
                  {start && end && <h4>
                    {new Date(start).toLocaleDateString()} ถึง {new Date(end).toLocaleDateString()} จอง {daysDiff} คืน
                  </h4>
                  }
                  <Box sx={{ overflow: 'auto', maxHeight: 380 }}>
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
                  </Box>
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
                    color="primary"
                    endDecorator={<KeyboardArrowRight />}
                    sx={{ fontFamily: 'Sarabun' }}
                    disabled={basketRoom.length > 0 ? false : true}
                    onClick={bookingRoomList}
                  >
                    จองทั้งหมด
                  </Button>
                </Card>
              </Grid>
            }
          </Grid>
        </Container>
      </motion.div>
      {windowSize < 1183 && basketRoom.length > 0 &&
        <Card size="lg" variant="outlined" sx={{ minWidth: "100%", position: "fixed", zIndex: 999, bottom: 0, borderRadius: 0 }}>
          <Grid container>
            <Grid item xs={6}>
              <Box sx={{ display: "flex" }}>
                <h4 onClick={() => {
                  setLayout('fullscreen');
                }}>  {formatNumberWithCommas(
                  basketRoom.reduce((total: number, pkg) => total + pkg.price * pkg.quantityRoomBuy, 0) * daysDiff
                )} บาท</h4>
                <Box><KeyboardArrowDownIcon onClick={() => {
                  setLayout('fullscreen');
                }} /></Box>
              </Box>
              <p style={{ marginTop: -10 }} onClick={() => {
                setLayout('fullscreen');
              }}>
                ดูรายละเอียด
              </p>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end" alignItems="center">
              <Button
                variant="soft"
                color="primary"
                endDecorator={<KeyboardArrowRight />}
                sx={{ fontFamily: 'Sarabun' , marginRight:5}}
                disabled={basketRoom.length > 0 ? false : true}
                onClick={bookingRoomList}
              >
                จองทั้งหมด
              </Button>
            </Grid>
          </Grid>
        </Card>
      }
      <Modal open={!!layout} data-aos="fade-up" onClose={() => setLayout(undefined)} >
        <ModalDialog layout={layout}>
          <ModalClose />
          <Box
            sx={{ overflow: 'auto', maxHeight: 400, padding: 2, marginTop: 10 }}>
            <h3>ตะกร้าห้องพัก</h3>
            {start && end && <h4>
              {new Date(start).toLocaleDateString()} ถึง {new Date(end).toLocaleDateString()} จอง {daysDiff} คืน
            </h4>
            }
            <Box sx={{ overflow: 'auto', maxHeight: 380 }}>
              {basketRoom.length > 0 &&
                basketRoom.map((selectRoom, index) => (
                  <Grid container alignItems="center" key={index}>
                    <Grid item xs={10} sx={{ marginTop: 2 }}>
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
            </Box>
            <div style={{ borderTop: '1px solid #7F8C8D', marginTop: 12 }}></div>
            {basketRoom.length > 0 ?
              <Grid container alignItems="center" sx={{ marginTop: 1 }}>
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
          </Box>
        </ModalDialog>
      </Modal>
      <Modal
        open={open}
        onClose={closeModel}
        data-aos="fade-up"
      >
        <ModalDialog layout={windowSize < 1183 ? "fullscreen" : "center"}>
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Grid container spacing={2} sx={{ maxHeight: 600, overflowY: 'auto' }}>
            <Grid item xs={12}>
              <h2>
                {roomType.find((type) => type.id === detailRoom?.roomTypeId)?.name || 'ไม่พบข้อมูล'}
              </h2>
            </Grid>
            <Grid item xs={windowSize < 1183 ? 12 : 6}>
              <div className="slide-container">
                <Slide>
                  {detailRoom && detailRoom.roomImages.map((slideImage, index) => (
                    <div key={index}>
                      <img
                        style={{
                          width: "100%",
                          height: "250vh",
                          maxWidth: "100%",
                          maxHeight: "350px", // กำหนดขนาดสูงสุดที่เหมาะสม
                          borderRadius: 5,
                          objectFit: 'cover'
                        }}
                        src={folderImage + slideImage.image}
                      />
                    </div>
                  ))}
                </Slide>
              </div>
              <div style={{ marginTop: 20 }} />
              <p>
                {detailRoom?.detail}
              </p>
            </Grid>
            <Grid container alignItems="center" gap={1} item xs={windowSize < 1183 ? 12 : 6} sx={{maxHeight:100}}>
              <Grid item xs={5} >
                <h3>จำนวนเข้าพักสูงสุด</h3>
              </Grid>
              <Grid item xs={5}>
                <h4>{detailRoom?.quantityPeople} คน</h4>
              </Grid>
              <Grid item xs={5}>
                <h3>ห้องพักที่พักได้</h3>
              </Grid>
              <Grid item xs={5}>
                <h4>{totalQuantity} ห้อง</h4>
              </Grid>
              <Grid item xs={5}>
                <h3>ราคา</h3>
              </Grid>
              <Grid item xs={5}>
                <h4>{formatNumberWithCommas(Number(detailRoom?.price))} บาท/ต่อคืน</h4>
              </Grid>
              <Grid item xs={5}>
                <h3>รายละเอียดการจอง</h3>
              </Grid>
              <Grid item xs={5}>
                <h4>จอง  {countRoom} ห้อง / {daysDiff} คืน</h4>
              </Grid>
              <Grid item xs={5}>
                <h3>จองวันที่</h3>
              </Grid>
              <Grid item xs={5}>
                <h4> {new Date(start).toLocaleDateString()} 12.30 ถึง {new Date(end).toLocaleDateString()} 10.30</h4>
              </Grid>
              <Grid item xs={5}>
                <h3>ราคารวม</h3>
              </Grid>
              <Grid item xs={5}>
                <h4>{formatNumberWithCommas(Number(detailRoom?.price) * countRoom * daysDiff)} บาท</h4>
              </Grid>
              {token !== "" &&
                <Grid item xs={5}>
                  <h3>จำนวนห้องที่ต้องการ</h3>
                </Grid>
              }
              {token !== "" &&
                <Grid item xs={5}>
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
              }
              {windowSize > 1183 &&
                <Grid item xs={12}>
                  <Button
                    variant="soft"
                    color="primary"
                    endDecorator={<KeyboardArrowRight />}
                    sx={{ fontFamily: 'Sarabun'}}
                    onClick={allSelectRoom}
                    fullWidth
                  >
                    เลือก
                  </Button>
                </Grid>
              }
            </Grid>
            <Box sx={{mt:40}}></Box>
          </Grid>
        </ModalDialog>
      </Modal>
      {open && windowSize < 1183 &&
        <Card size="lg" variant="outlined" sx={{ minWidth:"100%", position: "fixed", zIndex: 9999, bottom: 0, borderRadius: 0 }}>
          <Grid container>
            <Grid item xs={6}>
              <h4> {formatNumberWithCommas(Number(detailRoom?.price) * countRoom * daysDiff)} บาท</h4>
              <p>
                ดูรายละเอียด
              </p>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end" alignItems="center">
              <Button
                variant="soft"
                color="primary"
                endDecorator={<KeyboardArrowRight />}
                sx={{ fontFamily: 'Sarabun', marginRight:5 }}
                onClick={allSelectRoom}
              >
                เลือก
              </Button>
            </Grid>
          </Grid>
        </Card>
      }
    </div>

  );
};

export default RoomPage;
