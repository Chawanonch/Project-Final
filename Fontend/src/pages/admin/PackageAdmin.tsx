import { Button, Chip, DialogTitle, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Stack, Select, Option, Textarea } from '@mui/joy'
import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useEffect, useState } from 'react';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Swal from 'sweetalert2';
import { Package } from '../../components/models/package';
import { createAndUpdatePackage, getPackage, removePackage } from '../../store/features/packageSlice';
import { formatNumberWithCommas } from '../../components/Reuse';
import { Room, RoomType } from '../../components/models/room';
import { Softpower, SoftpowerType } from '../../components/models/softpower';
import { Building } from '../../components/models/building';

export default function PackageAdmin() {
  const dispatch = useAppDispatch();
  const { packageAll } = useAppSelector((state) => state.package);
  const { room, building, roomType } = useAppSelector((state) => state.room);
  const { softpower, softpowerType } = useAppSelector((state) => state.softpower);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPackage, setFilteredPackage] = useState<Package[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'รหัส', width: 80 },
    { field: 'name', headerName: 'ชื่อแพ็กเกจ', width: 130 },
    {
      field: 'roomPackages', headerName: 'ห้องพัก', width: 80,
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
    { field: 'quantityDay', headerName: 'จำนวนวัน', width: 80 },
    {
      field: 'softpowerPackages', headerName: 'ซอฟต์พาวเวอร์', width: 100,
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          {params.value && params.value.map((value: { softpowerId: number; }, index: number) => (
            <span key={index}>
              [{value.softpowerId}]
            </span>
          ))}
        </div>

      )
    },
    { field: 'quantityPeople', headerName: 'เหมาะกับ', width: 80 },
    { field: 'precautions', headerName: 'ข้อควรระวัง', width: 70 },
    {
      field: 'totalPrice', headerName: 'ราคารวม', width: 100,
      renderCell: (params) => (
        <span>
          {formatNumberWithCommas(params.value)}
        </span>
      ),
    },
    { field: 'quantity', headerName: 'จำนวนแพ็กเกจ', width: 130 },
    { field: 'date', headerName: 'วันที่สร้าง', width: 130 },
    {
      field: 'Edit',
      headerName: '',
      width: 55,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => {
            setId(params.row.id)
            setOpen(true)
          }}
        >
          <AutoFixHighIcon />
        </IconButton>
      ),
    },
    {
      field: 'Remove',
      headerName: '',
      width: 55,
      renderCell: (params) => (
        <IconButton
          color="danger"
          onClick={async () => {
            const item = await dispatch(removePackage(params.row.id))
            if (item.payload !== "" && item.payload !== undefined) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "ลบข้อมูลเสร็จสิน !",
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
            fetchData();
          }}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      ),
    },
  ];

  const fetchData = async () => {
    await dispatch(getPackage());
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = packageAll && packageAll.filter((item) =>
      item && item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPackage(filtered);
  }, [searchQuery, packageAll]);

  return (
    <Box sx={{ marginTop: 9.5, marginLeft: 30 }}>

      <h2 style={{ marginTop: 100, marginBottom: -30 }}>แพ็กเกจ</h2>
      <div style={{ marginTop: 50 }} />

      <Box sx={{ marginTop: 3 }}>
        <Box sx={{ display: "flex" }}>
          <FormControl sx={{ width: "auto" }}>
            <h4>
              ค้นหาชื่อแพ็กเกจ
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
          <FormControl sx={{ width: 180, marginLeft: 3 }}>
            <h4>
              สร้างแพ็กเกจ
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
        </Box>
        <div style={{ height: 400, width: 1220, marginTop: 20 }}>
          <DataGrid
            rows={filteredPackage}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
      </Box>
      <ModelPackage open={open} setOpen={setOpen} id={id} packageAll={packageAll} rooms={room} buildings={building} roomTypes={roomType} softpowers={softpower} softpowerTypes={softpowerType} />
    </Box>
  )
}

interface ModelPackageProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
  packageAll: Package[];
  rooms: Room[];
  buildings: Building[];
  roomTypes: RoomType[];
  softpowers: Softpower[];
  softpowerTypes: SoftpowerType[];
}

const ModelPackage: React.FC<ModelPackageProps> = ({ open, setOpen, id = 0, packageAll, rooms, buildings, roomTypes, softpowers, softpowerTypes }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [roomPackages, setRoomPackages] = useState<Array<number>>([]);
  const [quantityDay, setQuantityDay] = useState<string>("");
  const [softpowerPackages, setSoftpowerPackages] = useState<Array<number>>([]);
  const [quantityPeople, setQuantityPeople] = useState<string>("");
  const [precautions, setPrecautions] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    if (id !== 0) {
      const packageFind = packageAll.find((x) => x.id === id)
      if (packageFind) {
        setName(packageFind.name.toString())
        if (roomPackages) setRoomPackages(packageFind.roomPackages.map((room) => room.roomId))
        else setRoomPackages([])
        setQuantityDay(packageFind.quantityDay.toString())
        if (softpowerPackages) setSoftpowerPackages(packageFind.softpowerPackages.map((sofepower) => sofepower.softpowerId))
        else setSoftpowerPackages([])
        setQuantityPeople(packageFind.quantityPeople)
        setPrecautions(packageFind.precautions)
        setTotalPrice(packageFind.totalPrice.toString())
        setQuantity(packageFind.quantity.toString())
      }
    }
    else {
      setName("")
      setRoomPackages([])
      setQuantityDay("")
      setSoftpowerPackages([])
      setQuantityPeople("")
      setPrecautions("")
      setTotalPrice("")
      setQuantity("")
    }
  }, [packageAll, id, setOpen]);

  const fetchData = async () => {
    await dispatch(getPackage());
  };

  const createAndUpdate = async () => {
    Number(totalPrice)
    const q = Number(quantity);
    const day = quantityDay !== "" && roomPackages.length > 0 ? Number(quantityDay) : 0;
    if (q > 0 && q <= 100) {
      console.log(softpowerPackages)
      const item = await dispatch(createAndUpdatePackage({ id, name, roomPackages, quantityDay: day, softpowerPackages, quantityPeople, precautions, totalPrice, quantity }));
      if (item.payload !== "" && item.payload !== undefined) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: id === 0 ? "สร้างข้อมูลเสร็จสิน !" : "เปลี่ยนแปลงข้อมูลเสร็จสิน !",
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
    } else alert("จำนวนน้อยไปหรือมากไป กรุณาป้อนอีกครั้ง")

  };

  const handleRoomPackagesChange = (
    event: React.SyntheticEvent | null,
    newValue: number | number[] | null,
  ) => {
    setRoomPackages(newValue as number[]);
  };

  const handleSoftpowerPackagesChange = (
    event: React.SyntheticEvent | null,
    newValue: number | number[] | null,
  ) => {
    setSoftpowerPackages(newValue as number[]);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <DialogTitle>{id === 0 ? "สร้างแพ็กเกจ" : "แก้ไขแพ็กเกจ"}</DialogTitle>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
            createAndUpdate()
          }}
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>ชื่อแพ็กเกจ</FormLabel>
              <Textarea name="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อแพ็กเกจ..." minRows={2} maxRows={3} />
            </FormControl>

            <FormControl>
              <FormLabel>แพ็กเกจสำหรับกี่คน</FormLabel>
              <Textarea name="qP" required value={quantityPeople} onChange={(e) => setQuantityPeople(e.target.value)} placeholder="สำหรับกี่คน..." minRows={2} maxRows={3} />
            </FormControl>
            <FormControl>
              <FormLabel>ข้อควรระวัง</FormLabel>
              <Textarea name="precautions" required value={precautions} onChange={(e) => setPrecautions(e.target.value)} placeholder="ข้อควรระวัง..." minRows={2} maxRows={3} />
            </FormControl>
            <FormControl>
              <FormLabel>ราคารวม</FormLabel>
              <Input name="totalPrice" type="number" required value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>จำนวนแพ็กเกจ</FormLabel>
              <Input name="quantity" type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </FormControl>

          </Stack>
          <Stack spacing={2} style={{ marginLeft: '50px' }}>
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

                onChange={handleRoomPackagesChange}
                value={roomPackages}
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
            {roomPackages.length > 0 &&
              <FormControl>
                <FormLabel>จำนวนกี่คืน</FormLabel>
                <Input name="day" type="number" value={quantityDay} onChange={(e) => setQuantityDay(e.target.value)} />
              </FormControl>
            }
            <FormControl>
              <FormLabel>เลือกซอฟต์พาวเวอร์</FormLabel>
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
                onChange={handleSoftpowerPackagesChange}
                value={softpowerPackages}
              >
                {softpowerTypes.map((sofType, index) => (
                  <div key={index}>
                    <h4>{sofType.name}</h4>
                    <div>
                      {softpowers.filter((sof) => sof.softpowerTypeId === sofType.id).map((sofepower) => (
                        <Option key={sofepower.id} value={sofepower.id}>
                          {sofepower.name}
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
