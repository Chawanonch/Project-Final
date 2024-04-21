//#region import
import { Button, FormControl, IconButton, Input, Modal, ModalDialog, Stack, Select as JoySelect, switchClasses, Switch, FormLabel, Select, Chip } from '@mui/joy'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Option from '@mui/joy/Option';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getBuildingAndRoom } from '../../store/features/room&BuildingSlice';
import { useEffect, useState } from 'react';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Booking, BookingPackage } from '../../components/models/booking';
import { bookingRoom, checkInUser, getBookingAdmin, cancelBooking, removeManyBookingAdmin, checkInUserPackage, removeManyBookingPackageAdmin, getBookingPackageAdmin, bookingPackageAdmin, cancelBookingPackage } from '../../store/features/bookingSlice';
import { getUserAdmin } from '../../store/features/userSlice';
import { Room, RoomType } from '../../components/models/room';
import { Building } from '../../components/models/building';
import { Users } from '../../components/models/user';
import Swal from 'sweetalert2';
import { formatNumberWithCommas } from '../../components/Reuse';
import { Package } from '../../components/models/package';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
//#endregion

export default function BookingAdmin() {
  const dispatch = useAppDispatch();
  const { bookings, bookingPackages } = useAppSelector((state) => state.booking);
  const { users } = useAppSelector((state) => state.user);
  const { room, roomType, building } = useAppSelector((state) => state.room);
  const { packageAll } = useAppSelector((state) => state.package);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryP, setSearchQueryP] = useState("");

  const [filteredBooking, setFilteredBooking] = useState<Booking[]>([]);
  const [filteredBookingPacakge, setFilteredBookingPacakge] = useState<BookingPackage[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [openP, setOpenP] = useState<boolean>(false);
  const [openCheckInP, setOpenCheckInP] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [idP, setIdP] = useState<number>(0);
  const [idCheckInP, setIdCheckInP] = useState<number>(0);

  const [selectionModel, setSelectionModel] = useState([]);
  const [selectionModelP, setSelectionModelP] = useState([]);
  const [selectStatus, setSelectStatus] = useState<number | null>(5);
  const [selectStatusP, setSelectStatusP] = useState<number | null>(5);

  const [checked, setChecked] = useState<boolean>(false);

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return 'รอดำเนินการ';
      case 1:
        return 'มัดจำเสร็จสิน';
      case 2:
        return 'ชำระเสร็จสิน';
      case 3:
        return 'ยกเลิกการจอง';
      default:
        return '';
    }
  };

  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };
  const handleSelectionBookingPackageModelChange = (newSelectionModelP) => {
    setSelectionModelP(newSelectionModelP);
  };
  const handleDeleteSelectedRows = async () => {
    const item = await dispatch(removeManyBookingAdmin(selectionModel))
    console.log(item)
    if (item.payload !== "" && item.payload !== undefined && item.payload !== "Remove error") {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ทำการลบข้อมูลการจองหลายรายการสำเร็จ !",
        showConfirmButton: false,
        timer: 1000
      });
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
    fetchData()
  };
  const handleDeleteSelectedRowsBookingPackage = async () => {
    const item = await dispatch(removeManyBookingPackageAdmin(selectionModelP))
    if (item.payload !== "" && item.payload !== undefined && item.payload !== "Remove error") {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ทำการลบข้อมูลการจองหลายรายการสำเร็จ !",
        showConfirmButton: false,
        timer: 1000
      });
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
    fetchData()
  };

  const columnsBooking: GridColDef[] = [
    { field: 'id', headerName: 'รหัส', width: 80 },
    {
      field: 'start',
      headerName: 'เวลาที่เริ่ม',
      width: 110,
      valueFormatter: (params) => {
        const date = new Date(params.value as string);
        return date.toISOString(); // Adjust the date format as needed
      },
    },
    {
      field: 'end',
      headerName: 'เวลาที่สิ้นสุด',
      width: 110,
      valueFormatter: (params) => {
        const date = new Date(params.value as string);
        return date.toISOString(); // Adjust the date format as needed
      },
    },
    {
      field: 'status',
      headerName: 'สถานะชำระเงิน',
      width: 120,
      renderCell: (params) => (
        <span style={{
          color: params.value === 0 ? "#000" :
            params.value === 1 ? "#DEAA22" :
              params.value === 2 ? "#28DE22" :
                params.value === 3 ? "#DE2222" :
                  "#000"
        }}>
          {getStatusLabel(params.value as number)}
        </span>
      ),
    },
    {
      field: 'userId',
      headerName: 'ผู้ใช้',
      width: 80,
      renderCell: (params) => (
        <span>
          {users.find((users) => users.id === params.value)?.username || 'ไม่พบข้อมูล'}
        </span>
      ),
    },
    {
      field: 'totalPrice', headerName: 'ราคารวม', width: 100,
      renderCell: (params) => (
        <span>
          {formatNumberWithCommas(params.value).toString()}
        </span>
      ),
    },
    {
      field: 'listRooms', headerName: 'ห้องพัก', width: 80,
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          {params.value && params.value.map((value: { roomId: number; }, index: number) => (
            <span key={index}>
              [{value.roomId}]
            </span>
          ))}
        </div>
      )
    },
    {
      field: 'check',
      headerName: 'เช็คอิน',
      width: 80,
      renderCell: (params) => {
        if (params.row.status === 2) {
          return (
            <Switch
              color={params.row.statusCheckIn === 0 ? 'success' : 'danger'}
              checked={params.row.statusCheckIn === 0 ? false : true}
              onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                setChecked(event.target.checked)
                const item = await dispatch(checkInUser(params.row.id))
                if (item.payload !== "" && item.payload !== undefined) {
                  Swal.fire({
                    position: "center",
                    icon: params.row.statusCheckIn === 0 ? "success" : "error",
                    title: params.row.statusCheckIn === 0 ? "เช็คอินเสร็จสิน" : "ยกเลิกเช็คอินเสร็จสิน",
                    showConfirmButton: false,
                    timer: 1000
                  });
                } else {
                  Swal.fire({
                    position: "center",
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาดกรุณาลองใหม่ !',
                    showConfirmButton: false,
                    timer: 1000
                  });
                }
                fetchData();
              }}
              sx={{
                '--Switch-thumbSize': '16px',
                '--Switch-trackWidth': '40px',
                '--Switch-trackHeight': '24px',
                '--Switch-trackBackground': '#EE5E52',
                '&:hover': {
                  '--Switch-trackBackground': '#EE5E52',
                },
                [`&.${switchClasses.checked}`]: {
                  '--Switch-trackBackground': '#5CB176',
                  '&:hover': {
                    '--Switch-trackBackground': '#5CB176',
                  },
                },
              }}
            />
          )
        }
        else {
          return <span />;
        }
      },
    },
    {
      field: 'checkInTime',
      headerName: 'วันที่เช็คอิน',
      width: 85,
      renderCell: (params) => {
        if (params.row.statusCheckIn === 1) {
          const date = new Date(params.value as string);
          return date.toISOString(); // Adjust the date format as needed
        } else {
          return ''; // หรือค่าอื่น ๆ ตามที่ต้องการแสดง
        }
      },
    },
    {
      field: 'Edit',
      headerName: 'ปุ่มแก้ไข',
      width: 80,
      renderCell: (params) => {
        if (params.row.status === 0) {
          return (
            <IconButton
              color="primary"
              onClick={() => {
                setId(params.row.id)
                setOpen(true)
              }}
            >
              <AutoFixHighIcon />
            </IconButton>
          );
        }
        else {
          return <span />;
        }
      },
    },
    {
      field: 'Remove',
      headerName: 'ปุ่มยกเลิก',
      width: 80,
      renderCell: (params) => {
        if (params.row.status !== 3) {
          return (
            <IconButton
              color="danger"
              onClick={async () => {
                const item = await dispatch(cancelBooking(params.row.id));
                if (item.payload !== "" && item.payload !== undefined) {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "ยกเลิกการจองเสร็จสิน !",
                    showConfirmButton: false,
                    timer: 1000
                  });
                } else {
                  Swal.fire({
                    position: "center",
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาดกรุณาลองใหม่ !',
                    showConfirmButton: false,
                    timer: 1000
                  });
                }
                fetchData();
              }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          );
        } else {
          return <span />;
        }
      },
    },
  ];
  const columnsBookingPackage: GridColDef[] = [
    { field: 'id', headerName: 'รหัส', width: 80 },
    {
      field: 'status',
      headerName: 'สถานะชำระเงิน',
      width: 120,
      renderCell: (params) => (
        <span style={{
          color: params.value === 0 ? "#000" :
            params.value === 1 ? "#DEAA22" :
              params.value === 2 ? "#28DE22" :
                params.value === 3 ? "#DE2222" :
                  "#000"
        }}>
          {getStatusLabel(params.value as number)}
        </span>
      ),
    },
    {
      field: 'userId',
      headerName: 'ผู้ใช้',
      width: 80,
      renderCell: (params) => (
        <span>
          {users.find((users) => users.id === params.value)?.username || 'ไม่พบข้อมูล'}
        </span>
      ),
    },
    {
      field: 'totalPriceBookingPackage', headerName: 'ราคารวม', width: 100,
      renderCell: (params) => (
        <span>
          {formatNumberWithCommas(params.value)}
        </span>
      ),
    },
    {
      field: 'listPackages', headerName: 'แพ็กเกจ', width: 80,
      renderCell: (params) => (
        <div>
          <IconButton
            color="neutral"
            onClick={() => {
              setIdCheckInP(params.row.id)
              setOpenCheckInP(true)
            }}
          >
            <ManageSearchIcon />
          </IconButton>
          <Modal open={openCheckInP && idCheckInP === params.row.id} onClose={() => setOpenCheckInP(false)}>
            <ModalDialog>
              <h2>ข้อมูลแพ็กเกจ</h2>
              <TableContainer style={{ maxHeight: '200px'}} component={Paper}>
                <Table sx={{ minWidth: 1200 }} aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center"><h3>ชื่อแพ็กเกจ</h3></TableCell>
                      <TableCell align="center"><h3>เช็คอินได้ตั้งแต่</h3></TableCell>
                      <TableCell align="center"><h3>เช็คอิน</h3></TableCell>
                      <TableCell align="center"><h3>วันที่เช็คอิน</h3></TableCell>
                    </TableRow>
                  </TableHead>
                  {params.value && params.value.map((value, index: number) => {
                    let itemDS;
                    let itemDE;
                    let itemDC;

                    if (value.start && value.end && value.checkInTime) {
                      itemDS = new Date(value.start);
                      itemDS.setFullYear(itemDS.getFullYear() - 543);
                      itemDE = new Date(value.end);
                      itemDE.setFullYear(itemDE.getFullYear() - 543);
                      itemDC = new Date(value.checkInTime);
                      itemDC.setFullYear(itemDC.getFullYear() - 543);
                    }
                    return (
                      <TableBody key={index}>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            <p>
                              {packageAll.find((pck) => pck.id === value.packageId)?.name || 'ไม่พบข้อมูล'}
                            </p>
                          </TableCell>
                          <TableCell align="center">
                            <p>
                              {itemDS?.toLocaleString('th-TH', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                              })} ถึงวันที่ {itemDE?.toLocaleString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </TableCell>
                          <TableCell align="center">
                            {params.row.status === 2 ?
                              <Switch
                              color={value.checkInDate === 0 ? 'success' : 'danger'}
                              checked={value.checkInDate === 0 ? false : true}
                              onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                setChecked(event.target.checked)
                                const item = await dispatch(checkInUserPackage(value.id));
                                if (item.payload !== "" && item.payload !== undefined) {
                                  Swal.fire({
                                    position: "center",
                                    icon: value.checkInDate === 0 ? "success" : "error",
                                    title: value.checkInDate === 0 ? "เช็คอินเสร็จสิน" : "ยกเลิกเช็คอินเสร็จสิน",
                                    showConfirmButton: false,
                                    timer: 1000
                                  });
                                } else {
                                  Swal.fire({
                                    position: "center",
                                    icon: 'error',
                                    title: 'เกิดข้อผิดพลาดกรุณาลองใหม่ !',
                                    showConfirmButton: false,
                                    timer: 1000
                                  });
                                }
                                fetchData();
                              }}
                              sx={{
                                '--Switch-thumbSize': '16px',
                                '--Switch-trackWidth': '40px',
                                '--Switch-trackHeight': '24px',
                                '--Switch-trackBackground': '#EE5E52',
                                '&:hover': {
                                  '--Switch-trackBackground': '#EE5E52',
                                },
                                [`&.${switchClasses.checked}`]: {
                                  '--Switch-trackBackground': '#5CB176',
                                  '&:hover': {
                                    '--Switch-trackBackground': '#5CB176',
                                  },
                                },
                              }}
                              />:<p style={{color:"#DE2222"}}>ยังไม่ได้ชำระเงิน</p>
                            }
                          </TableCell>
                          <TableCell align="center">
                            {value.checkInDate === 1 ?
                              <p style={{color:"#28DE22"}}> 
                                เช็คอินวันที่ {" "}
                                {itemDC?.toLocaleString('th-TH', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute:'numeric',
                                  second:'numeric'
                                })}
                              </p> :
                              <p style={{color:"#DE2222"}}>ยังไม่ได้ทำการเช็คอิน</p>
                            }
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
      )
    },
    {
      field: 'Edit',
      headerName: 'ปุ่มแก้ไข',
      width: 80,
      renderCell: (params) => {
        if (params.row.status === 0) {
          return (
            <IconButton
              color="primary"
              onClick={() => {
                setIdP(params.row.id)
                setOpenP(true)
              }}
            >
              <AutoFixHighIcon />
            </IconButton>
          );
        }
        else {
          return <span />;
        }
      },
    },
    {
      field: 'Remove',
      headerName: 'ปุ่มยกเลิก',
      width: 80,
      renderCell: (params) => {
        if (params.row.status !== 3) {
          return (
            <IconButton
              color="danger"
              onClick={async () => {
                const item = await dispatch(cancelBookingPackage(params.row.id));
                if (item.payload !== "" && item.payload !== undefined) {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "ยกเลิกการจองเสร็จสิน !",
                    showConfirmButton: false,
                    timer: 1000
                  });
                } else {
                  Swal.fire({
                    position: "center",
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาดกรุณาลองใหม่ !',
                    showConfirmButton: false,
                    timer: 1000
                  });
                }
                fetchData();
              }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          );
        } else {
          return <span />;
        }
      },
    },
  ];
  const fetchData = async () => {
    await dispatch(getBookingAdmin());
    await dispatch(getBookingPackageAdmin());
    await dispatch(getUserAdmin());
    await dispatch(getBuildingAndRoom());
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = bookings && bookings.filter(x =>
      (selectStatus === 5 || x.status === selectStatus) &&
      (searchQuery === "" || x.start.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredBooking(filtered);
  }, [searchQuery, bookings, setSelectStatus, selectStatus]);

  useEffect(() => {
    const filtered = bookingPackages && bookingPackages.filter(x =>
      (selectStatusP === 5 || x.status === selectStatusP) &&
      (searchQueryP === "" || x.dateCreated.toLowerCase().includes(searchQueryP.toLowerCase()))
    );

    setFilteredBookingPacakge(filtered);
  }, [searchQueryP, bookingPackages, setSelectStatusP, selectStatusP]);

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectStatus(newValue)
  };

  const handleChange1 = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectStatusP(newValue)
  };

  return (
    <Box sx={{ marginTop: 9.5, marginLeft: 30 }}>
      <div>
        <h2 style={{ marginTop: 100, marginBottom: -30 }}>ประวัติการจองห้องพัก</h2>
        <div style={{ marginTop: 50 }} />

        <Box sx={{ marginTop: 3 }}>
          <Box sx={{ display: "flex" }}>
            <FormControl sx={{ width: "auto" }}>
              <h4>
                ค้นหาเวลาการจอง
              </h4>
              <Input
                placeholder="ค้นหา..."
                startDecorator={
                  <Button sx={{ width: 40 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
                  </Button>
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ borderRadius: 8, width: 600 }}
              />
            </FormControl>
            <FormControl sx={{ width: 150, marginLeft: 3 }}>
              <h4>
                สถานะการจอง
              </h4>
              <JoySelect defaultValue={5} onChange={handleChange}>
                <Option value={5}>
                  รายการทั้งหมด
                </Option>
                <Option value={0}>
                  รอดำเนินการ
                </Option>
                <Option value={1}>
                  ชำระเงินมัดจำ
                </Option>
                <Option value={2}>
                  ชำระเงินทั้งหมด
                </Option>
                <Option value={3}>
                  ยกเลิกการจอง
                </Option>
              </JoySelect>
            </FormControl>
            <FormControl sx={{ width: 100, marginLeft: 3 }}>
              <h4>
                สร้างจอง
              </h4>
              <IconButton
                color="success"
                onClick={() => {
                  setId(0)
                  setOpen(true)
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </FormControl>
            <FormControl sx={{ width: 120, marginLeft: 3 }}>
              <h4>
                ลบหลายการจอง
              </h4>
              <IconButton
                color="danger"
                onClick={handleDeleteSelectedRows}
                disabled={selectionModel.length === 0 ? true : false}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </FormControl>
          </Box>
          <div style={{ height: 300, width: 1220, marginTop: 20 }}>
            <DataGrid
              rows={filteredBooking}
              columns={columnsBooking}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionModelChange}
              rowSelectionModel={selectionModel}
            />

          </div>

        </Box>
      </div>
      <div>
        <h2 style={{ marginTop: 20, marginBottom: -30 }}>ประวัติการจองแพ็กเกจ</h2>
        <div style={{ marginTop: 50 }} />

        <Box sx={{ marginTop: 3 }}>
          <Box sx={{ display: "flex" }}>
            <FormControl sx={{ width: "auto" }}>
              <h4>
                ค้นหาเวลาการจอง
              </h4>
              <Input
                placeholder="ค้นหา..."
                startDecorator={
                  <Button sx={{ width: 40 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
                  </Button>
                }
                value={searchQueryP}
                onChange={(e) => setSearchQueryP(e.target.value)}
                sx={{ borderRadius: 8, width: 600 }}
              />
            </FormControl>
            <FormControl sx={{ width: 150, marginLeft: 3 }}>
              <h4>
                สถานะการจอง
              </h4>
              <JoySelect defaultValue={5} onChange={handleChange1}>
                <Option value={5}>
                  รายการทั้งหมด
                </Option>
                <Option value={0}>
                  รอดำเนินการ
                </Option>
                <Option value={1}>
                  ชำระเงินมัดจำ
                </Option>
                <Option value={2}>
                  ชำระเงินทั้งหมด
                </Option>
                <Option value={3}>
                  ยกเลิกการจอง
                </Option>
              </JoySelect>
            </FormControl>
            <FormControl sx={{ width: 100, marginLeft: 3 }}>
              <h4>
                สร้างจอง
              </h4>
              <IconButton
                color="success"
                onClick={() => {
                  setIdP(0)
                  setOpenP(true)
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </FormControl>
            <FormControl sx={{ width: 120, marginLeft: 3 }}>
              <h4>
                ลบหลายการจอง
              </h4>
              <IconButton
                color="danger"
                onClick={handleDeleteSelectedRowsBookingPackage}
                disabled={selectionModelP.length === 0 ? true : false}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </FormControl>
          </Box>
          <div style={{ height: 300, width: 1220, marginTop: 20, marginBottom: 50 }}>
            <DataGrid
              rows={filteredBookingPacakge}
              columns={columnsBookingPackage}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionBookingPackageModelChange}
              rowSelectionModel={selectionModelP}
            />
          </div>
        </Box>
      </div>
      <Model open={open} setOpen={setOpen} id={id} bookings={bookings} rooms={room} roomTypes={roomType} buildings={building} users={users} />
      <ModelP open={openP} setOpen={setOpenP} id={idP} bookings={bookingPackages} packageAll={packageAll} users={users} />

    </Box>
  )
}

interface ModelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
  bookings: Booking[];
  rooms: Room[];
  roomTypes: RoomType[];
  buildings: Building[];
  users: Users[];
}

const Model: React.FC<ModelProps> = ({ open, setOpen, id = 0, bookings, rooms, roomTypes, buildings, users }) => {
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<number | null>(0);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [roomList, setRoomList] = useState<Array<number>>([]);

  useEffect(() => {
    if (id !== 0) {
      const booking = bookings.find((x) => x.id === id)
      if (booking) {
        setUser(booking.userId)
        setStart(booking.start.toString().split('T')[0])
        setEnd(booking.end.toString().split('T')[0])
        if (roomList) setRoomList(booking.listRooms.map((pak) => pak.roomId))
        else setRoomList([])
      }
    }
    else {
      setUser(0)
      setStart("")
      setEnd("")
      setRoomList([])
    }
  }, [bookings, id, setOpen]);


  const fetchData = async () => {
    await dispatch(getBookingAdmin());
    await dispatch(getUserAdmin());
    await dispatch(getBuildingAndRoom());
  };

  const createAndUpdate = async () => {
    const item = await dispatch(bookingRoom({ id, start, end, roomList, user }));
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "สร้างข้อมูลเสร็จสิน !",
        showConfirmButton: false,
        timer: 1000
      });
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
    fetchData()
  };
  const handleUserChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setUser(newValue);
  };

  const handleRoomListChange = (
    event: React.SyntheticEvent | null,
    newValue: number | number[] | null,
  ) => {
    setRoomList(newValue as number[]);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <h2>{id === 0 ? "สร้างการจอง" : "แก้ไขการจอง"}</h2>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
            createAndUpdate()
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormControl>
                <h4>ผู้ใช้</h4>
                <JoySelect
                  sx={{ height: 40 }}
                  value={user}
                  onChange={handleUserChange}
                  required

                >
                  {users.map((user) => (
                    <Option key={user.id} value={user.id}>
                      อีเมล: {user.email}
                    </Option>
                  ))}
                </JoySelect>
              </FormControl>
              <h4>เวลาเริ่มต้น</h4>
              <Input type="date" slotProps={{
                input: {
                  min: new Date().toISOString().split('T')[0],
                },
              }} name="start" required value={start.toString().split('T')[0]} onChange={(e) => setStart(e.target.value)} />
            </FormControl>
            <FormControl>
              <h4>เวลาสิ้นสุด</h4>
              <Input type="date" slotProps={{
                input: {
                  min: start ? new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
                    : new Date().toISOString().split('T')[0],
                },
              }} name="end" required disabled={!start} value={end.toString().split('T')[0]} onChange={(e) => setEnd(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>เลือกห้องพัก</FormLabel>
              <Select
                multiple
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                    {selected.map((selectedOption, index) => (
                      <Chip key={index} variant="soft" color="primary">
                        {selectedOption.label}
                      </Chip>
                    ))}
                  </Box>
                )}
                sx={{
                  minWidth: '15rem',
                }}
                slotProps={{
                  listbox: {
                    component: 'div',
                    sx: {
                      maxHeight: 240,
                      overflow: 'auto',
                      '--List-padding': '0px',
                      '--ListItem-radius': '0px',
                    },
                  },
                }}
                onChange={handleRoomListChange}
                value={roomList}
                required
              >
                {buildings.map((bui, index) => (
                  <div key={index}>
                    <h4>{bui.name}</h4>
                    <div>
                      {rooms.filter((room) => room.buildingId === bui.id).map((room) => (
                        <Option key={room.id} value={room.id}>
                          {roomTypes.find((type) => type.id === room.roomTypeId)?.name} <p style={{ color: "red" }}>{"ว่าง " + room.quantityRoom + " ห้อง"}</p>
                        </Option>
                      ))}
                    </div>
                  </div>
                ))}
              </Select>
            </FormControl>
            <Button type="submit">ยืนยัน</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}


interface ModelPropsP {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
  bookings: BookingPackage[];
  users: Users[];
  packageAll: Package[];
}

const ModelP: React.FC<ModelPropsP> = ({ open, setOpen, id = 0, bookings, users, packageAll }) => {
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<number | null>(0);
  const [packageList, setPackageList] = useState<Array<number>>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (id !== 0) {
      const booking = bookings.find((x) => x.id === id)
      if (booking) {
        setUser(booking.userId)
        if (packageList) setPackageList(booking.listPackages.map((pak) => pak.packageId))
        else setPackageList([])
        setTotalPrice(booking.totalPriceBookingPackage)
        console.log(totalPrice)
      }
    }
    else {
      setUser(0)
      setPackageList([])
      setTotalPrice(0)
    }
  }, [bookings, packageAll, id, setOpen]);


  const fetchData = async () => {
    await dispatch(getBookingAdmin());
    await dispatch(getBookingPackageAdmin());
    await dispatch(getUserAdmin());
    await dispatch(getBuildingAndRoom());
  };

  const createAndUpdate = async () => {
    Number(user)
    const item = await dispatch(bookingPackageAdmin({ id, packageList, user }));
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "สร้างข้อมูลเสร็จสิน !",
        showConfirmButton: false,
        timer: 1000
      });
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
    fetchData()
  };
  const handleUserChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setUser(newValue);
  };

  const handlePackagesListChange = (
    event: React.SyntheticEvent | null,
    newValue: number | number[] | null,
  ) => {
    setPackageList(newValue as number[]);
  };

  const priceAll = packageList.length > 0 ? packageAll.reduce((total, item) => {
    if (packageList.map((id) => id).includes(item.id)) {
      return total + item.totalPrice;
    }
    return total;
  }, 0) : 0;

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <h2>{id === 0 ? "สร้างการจอง" : "แก้ไขการจอง"}</h2>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
            createAndUpdate()
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <h4>ผู้ใช้</h4>
              <JoySelect
                sx={{ height: 40 }}
                value={user}
                onChange={handleUserChange}
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    อีเมล: {user.email}
                  </Option>
                ))}
              </JoySelect>
            </FormControl>
            <FormControl>
              <FormLabel>เลือกแพ็กเกจ</FormLabel>
              <Select
                multiple
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                    {selected.map((selectedOption, index) => (
                      <Chip key={index} variant="soft" color="primary">
                        {selectedOption.label}
                      </Chip>
                    ))}
                  </Box>
                )}
                sx={{
                  minWidth: '15rem',
                }}
                slotProps={{
                  listbox: {
                    component: 'div',
                    sx: {
                      maxHeight: 240,
                      overflow: 'auto',
                      '--List-padding': '0px',
                      '--ListItem-radius': '0px',
                    },
                  },
                }}
                onChange={handlePackagesListChange}
                value={packageList}
              >
                {packageAll.map((pak) => (
                  <Option key={pak.id} value={pak.id}>
                    {pak.name}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <h4>ราคารวม</h4>
              <Input name="price" required disabled type="number" value={priceAll} onChange={(e) => setTotalPrice(Number(e.target.value))} />
            </FormControl>
            <Button type="submit">ยืนยัน</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}
