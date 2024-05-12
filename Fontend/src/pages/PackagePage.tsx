import { Select, Option, Card, Stack, Button, Chip, Divider, List, ListItem, ListItemDecorator, CardActions, IconButton, FormControl, Input, Modal, ModalDialog } from "@mui/joy";
import { Box, Container, Grid, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { clearPackageInBasket, createPackageInBasket, getPackage, removePackageFromBasket } from "../store/features/packageSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { formatNumberWithCommas } from "../components/Reuse";
import Check from '@mui/icons-material/Check';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Close from "@mui/icons-material/Close";
import { Package } from "../components/models/package";
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import { bookingPackage } from "../store/features/bookingSlice";
import Swal from "sweetalert2";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { folderImage } from "../components/api/agent";
import { windowSizes } from '../components/Reuse';

export default function PackagePage() {
  const dispatch = useAppDispatch();
  const { packageAll, basketPackage } = useAppSelector((state) => state.package);
  const { room, roomType } = useAppSelector((state) => state.room);
  const { softpower, softpowerType } = useAppSelector((state) => state.softpower);
  const [selectType, setSelectType] = useState<number | null>(0);
  const [searchName, setSearchName] = useState<string>("");
  const [quantityBuy] = useState<number>(1);
  const [startTime, setStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const windowSize = windowSizes();

  const [openR, setOpenR] = useState<boolean>(false);
  const [openS, setOpenS] = useState<boolean>(false);

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectType(newValue)
  };

  const fetchData = async () => {
    await dispatch(getPackage());
  };

  const allSelectPackage = (item: Package) => {
    dispatch(createPackageInBasket({ ...item, quantityBuy, startTime }));
  };

  const removePackage = (id: number) => {
    dispatch(removePackageFromBasket(id))
  };

  const bookingPackageList = async () => {
    const item = await dispatch(bookingPackage({ basketPackage }));
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ทำการบันทึกการจองแพ็กเกจเสร็จสิน",
        showConfirmButton: false,
        timer: 1000
      });
      await dispatch(clearPackageInBasket())
    }
    else {
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'เกิดข้อผิดพลาดกรุณาลองใหม่ !',
        showConfirmButton: false,
        timer: 1000
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const filteredPackages = packageAll && packageAll.filter(item => {
    let selectTypeFilter = false;
    if (selectType === 0) {
      selectTypeFilter = true;
    } else if (selectType === 1) {
      selectTypeFilter = item.roomPackages.length > 0;
    } else if (selectType === 2) {
      selectTypeFilter = item.softpowerPackages.length > 0;
    }

    const searchNameFilter = searchName === "" || item.name.toLowerCase().includes(searchName.toLowerCase());

    return selectTypeFilter && searchNameFilter;
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 3;

  const paginatedPackage = filteredPackages && filteredPackages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(value);
  };
  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
              <Grid container>
                <Grid item xs={windowSize < 1183 ? 12 : 6}>
                  <FormControl>
                    <h4 >
                      ค้นหาชื่อแพ็กเกจ
                    </h4>
                    <Input
                      placeholder="ค้นหา..."
                      startDecorator={
                        <Button sx={{ width: 40 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
                        </Button>
                      }
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      sx={{ borderRadius: 8 }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={windowSize < 1183 ? 4 : 2} sx={{ marginLeft: windowSize < 1183 ? 0 : 1 }}>
                  <FormControl>
                    <h4>ประเภทแพ็กเกจ</h4>
                    <Select defaultValue={0} onChange={handleChange}>
                      <Option value={0}>
                        ทั้งหมด
                      </Option>
                      <Option value={1}>
                        ห้องพัก
                      </Option>
                      <Option value={2}>
                        บริการ
                      </Option>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={windowSize < 1183 ? 12 : 8}>
            {paginatedPackage.map((item, index) => (
              <Card size="lg" variant="outlined" sx={{ marginBottom: 3 }} key={index}>
                <Chip size="sm" variant="outlined" color="neutral">
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
                    {item.roomPackages.length > 0 &&
                      <div>
                        <IconButton
                          color="neutral"
                          onClick={() => {
                            setOpenR(true)
                          }}
                        >
                          <ManageSearchIcon />
                        </IconButton>
                        <Modal open={openR} onClose={() => setOpenR(false)}>
                          <ModalDialog>
                            <h2>ข้อมูลห้องพัก</h2>
                            <TableContainer style={{ maxHeight: '200px' }} component={Paper}>
                              <Table sx={{ minWidth: 600 }} aria-label="caption table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="left"><h3>ชื่อ</h3></TableCell>
                                    <TableCell align="left"><h3>นอนได้</h3></TableCell>
                                    <TableCell align="left"><h3>รูปภาพ</h3></TableCell>
                                  </TableRow>
                                </TableHead>
                                {item.roomPackages.map((value, index: number) => {
                                  return (
                                    <TableBody key={index}>
                                      <TableRow>
                                        <TableCell component="th" scope="row">
                                          <p>
                                            {roomType.find((spt) => spt.id === softpower.find((sp) => sp.id === value.roomId)?.softpowerTypeId)?.name || 'ไม่พบข้อมูล'}
                                          </p>
                                        </TableCell>
                                        <TableCell align="left">
                                          <p>
                                            {room.find((sp) => sp.id === value.roomId)?.quantityPeople || 'ไม่พบข้อมูล'}
                                          </p>
                                        </TableCell>
                                        <TableCell align="left">
                                          <div style={{ display: 'flex' }}>
                                            {room.find((sp) => sp.id === value.roomId)?.roomImages.map((value: { image: string; }, index: number) => (
                                              <img
                                                key={index}
                                                src={folderImage + value.image}
                                                alt={`Image ${index}`}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }}
                                              />
                                            ))}
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  )
                                })}
                              </Table>
                            </TableContainer>
                          </ModalDialog>
                        </Modal>
                      </div>
                    }
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>
                      {item.softpowerPackages.length > 0 ?
                        <Check /> : <Close />
                      }
                    </ListItemDecorator>
                    <span>บริการซอฟต์พาวเวอร์</span>
                    {item.softpowerPackages.length > 0 &&
                      <div>
                        <IconButton
                          color="neutral"
                          onClick={() => {
                            setOpenS(true)
                          }}
                        >
                          <ManageSearchIcon />
                        </IconButton>
                        <Modal open={openS} onClose={() => setOpenS(false)}>
                          <ModalDialog>
                            <h2>ข้อมูลซอฟต์พาวเวอร์</h2>
                            <TableContainer style={{ maxHeight: '200px' }} component={Paper}>
                              <Table sx={{ minWidth: 600 }} aria-label="caption table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="left"><h3>ชื่อ</h3></TableCell>
                                    <TableCell align="left"><h3>ประเภท</h3></TableCell>
                                    <TableCell align="left"><h3>รูปภาพ</h3></TableCell>
                                  </TableRow>
                                </TableHead>
                                {item.softpowerPackages.map((value, index: number) => {
                                  return (
                                    <TableBody key={index}>
                                      <TableRow>
                                        <TableCell component="th" scope="row">
                                          <p>
                                            {softpower.find((sp) => sp.id === value.softpowerId)?.name || 'ไม่พบข้อมูล'}
                                          </p>
                                        </TableCell>
                                        <TableCell align="left">
                                          <p>
                                            {softpowerType.find((spt) => spt.id === softpower.find((sp) => sp.id === value.softpowerId)?.softpowerTypeId)?.name || 'ไม่พบข้อมูล'}
                                          </p>
                                        </TableCell>
                                        <TableCell align="left">
                                          <div style={{ display: 'flex' }}>
                                            {softpower.find((sp) => sp.id === value.softpowerId)?.softpowerImages.map((value: { image: string; }, index: number) => (
                                              <img
                                                key={index}
                                                src={folderImage + value.image}
                                                alt={`Image ${index}`}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }}
                                              />
                                            ))}
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  )
                                })}
                              </Table>
                            </TableContainer>
                          </ModalDialog>
                        </Modal>
                      </div>
                    }
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
                  <Input type="date" slotProps={{
                    input: {
                      min: new Date().toISOString().split('T')[0],
                    },
                  }} name="start" value={startTime.toString().split('T')} onChange={
                    (e) => {
                      setStart(e.target.value)
                    }} />
                  <Button
                    variant="soft"
                    color="primary"
                    endDecorator={<KeyboardArrowRight />}
                    onClick={() => allSelectPackage(item)}
                    sx={{ fontFamily: 'Sarabun' }}
                  >
                    จองเลย
                  </Button>
                </CardActions>
              </Card>
            ))}
            <Grid container justifyContent="center">
              {paginatedPackage && paginatedPackage.length > 0 &&
                <Pagination
                  count={Math.ceil(paginatedPackage.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  sx={{ marginTop: 2 }}
                />
              }
            </Grid>
          </Grid>
          <Grid item xs={windowSize < 1183 ? 12 : 4} position={windowSize < 1183 ? "fixed" : "unset"} sx={{ bottom: 0, zIndex: 999 }}>
            <Card size="lg" variant="outlined">
              {windowSize > 1183 ?
                <>
                  <h3>ตะกร้าแพ็กเกจ</h3>
                  {basketPackage.length > 0 &&
                    basketPackage.map((selectPackage, index) => (
                      <Grid container alignItems="center" key={index}>
                        <Grid item xs={10}>
                          <h4>{selectPackage.name}</h4>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton onClick={() => removePackage(selectPackage.id)}>
                            <Close color="error" />
                          </IconButton>
                        </Grid>
                        <Grid item xs={8}>
                          <p>จำนวน</p>
                        </Grid>
                        <Grid item xs={4}>
                          <p>{selectPackage.quantityBuy} จำนวน</p>
                        </Grid>
                        <Grid item xs={8}>
                          <p>ราคา</p>
                        </Grid>
                        <Grid item xs={4}>
                          <p>{formatNumberWithCommas(selectPackage.totalPrice)} บาท</p>
                        </Grid>
                        <Grid item xs={8}>
                          <p>วันที่ไป</p>
                        </Grid>
                        <Grid item xs={4}>
                          <p>{selectPackage.startTime}</p>
                        </Grid>
                      </Grid>
                    ))}
                  <div style={{ borderTop: '1px solid #7F8C8D' }}></div>
                  {basketPackage.length > 0 ?
                    <Grid container alignItems="center">
                      <Grid item xs={8}><h4>ราคารวม + ค่าบริการ</h4></Grid>
                      <Grid item xs={4}><h4> {formatNumberWithCommas(
                        basketPackage.reduce((total: number, pkg) => total + pkg.totalPrice * pkg.quantityBuy, 0)
                      )} บาท</h4></Grid>
                      <Grid item xs={8}><h4>จำนวนทั้งหมด</h4></Grid>
                      <Grid item xs={4}> <h4> {formatNumberWithCommas(
                        basketPackage.reduce((total: number, pkg) => total + pkg.quantityBuy, 0)
                      )} จำนวน</h4></Grid>
                    </Grid>
                    : <h4>ยังไม่มีรายการ</h4>}
                    </> : 
                    <>9999</>
              }
              <Button
                variant="soft"
                color="primary"
                endDecorator={<KeyboardArrowRight />}
                sx={{ fontFamily: 'Sarabun' }}
                disabled={basketPackage.length > 0 ? false : true}
                onClick={bookingPackageList}
                fullWidth
              >
                จองทั้งหมด
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
