import { Button, FormControl, IconButton, Input, Modal, ModalDialog,Stack , Select as JoySelect, Textarea} from '@mui/joy'
import { Box, FormControlLabel, RadioGroup} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Option from '@mui/joy/Option';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { createAndUpdateRoom, createAndUpdateRoomType, getBuildingAndRoom,removeRoom, removeroomType } from '../../store/features/room&BuildingSlice';
import { useEffect, useState } from 'react';
import { folderImage } from '../../components/api/agent';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDropzone } from 'react-dropzone';
import { Room, RoomType } from '../../components/models/room';
import { Building } from '../../components/models/building';
import Radio from '@mui/material/Radio';
import Swal from 'sweetalert2';
import { formatNumberWithCommas } from '../../components/Reuse';

export default function RoomAdmin() {
  const dispatch = useAppDispatch();
  const { building, room , roomType } = useAppSelector((state) => state.room);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRoom, setFilteredRoom] = useState<Room[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [open1, setOpen1] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [id1, setId1] = useState<number | null>(0);
  const [selectType, setSelectType] = useState<number | null>(0);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'รหัส', width: 80 },
    {
      field: 'buildingId',
      headerName: 'อาคาร',
      width: 120,
      renderCell: (params) => (
        <span>
          {building.find((building) => building.id === params.value)?.name || 'ไม่พบข้อมูล'}
        </span>
      ),
    },
    {
      field: 'roomTypeId',
      headerName: 'ประเภท',
      width: 120,
      renderCell: (params) => (
        <span>
          {roomType.find((type) => type.id === params.value)?.name || 'ไม่พบข้อมูล'}
        </span>
      ),
    },
    { field: 'quantityRoom', headerName: 'จำนวนห้อง', width: 100 },
    { field: 'quantityPeople', headerName: 'จำนวนคน', width: 100 },
    { field: 'detail', headerName: 'รายละเอียด', width: 130 },
    { field: 'price', headerName: 'ราคา', width: 100 ,
      renderCell: (params) => (
        <span>
          {formatNumberWithCommas(params.value)}
        </span>
      ),
    },  
    {
      field: 'image',
      headerName: 'รูปภาพ',
      width: 150,
      renderCell: (params) => (
        <img
          src={folderImage + params.value}
          alt="Building Image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ),
    },
    { field: 'roomImages', headerName: 'หลายรูปภาพ', width: 130,
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          {params.value && params.value.map((value: { image: string; }, index:number) => (
            <img
              key={index}
              src={folderImage + value.image}
              alt={`Image ${index}`}
              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }}
            />
          ))}
        </div>
      ),
    },
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
            const item = await dispatch(removeRoom(params.row.id))
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
    await dispatch(getBuildingAndRoom());
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectType(newValue)
  };
  
  useEffect(() => {
    const filtered = room && room.filter(x => 
      (selectType === 0 || x.roomTypeId === selectType) &&
      (searchQuery === "" || x.detail.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredRoom(filtered);
  }, [searchQuery, room, selectType]);

  return (
    <Box sx={{ marginTop: 9.5, marginLeft: 30 }}>
      <h2 style={{marginTop:100,marginBottom:-30}}>ห้องพัก</h2>
      <div style={{marginTop:50}}/>

      <Box sx={{ marginTop: 3 }}>
        <Box sx={{ display: "flex" }}>
          <FormControl sx={{ width: "auto" }}>
            <h4 >
              ค้นหารายละเอียด
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
            ประเภท
          </h4>
            <JoySelect
              defaultValue={0} onChange={handleChange}
            >
              <Option value={0}>
                ทั้งหมด
              </Option>
              {roomType.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </JoySelect>
          </FormControl>
          <FormControl sx={{ width: 100, marginLeft: 3 }}>
            <h4>
              สร้างห้องพัก
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
          <FormControl sx={{ width: 180, marginLeft: 3 }}>
            <h4>
              สร้างประเภท, แก้ไข, ลบ
            </h4>
            <IconButton
              color="success"
              onClick={() => {
                setId1(0)
                setOpen1(true)
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </FormControl>
        </Box>
        <div style={{ height: 400, width: 1220, marginTop: 20 }}>
          <DataGrid
            rows={filteredRoom}
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
      <Model open={open} setOpen={setOpen} id={id} buildings={building} rooms={room} roomTypes={roomType}/>
      <Model1 open={open1} setOpen={setOpen1} id={id1} setId={setId1} roomTypes={roomType}/>
    </Box>
  )
}

interface ModelRoomProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
  buildings: Building[]; 
  rooms: Room[]; 
  roomTypes: RoomType[]; 
}

interface ModelTypeProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number | null;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  roomTypes: RoomType[]; 
}

const Model: React.FC<ModelRoomProps> = ({ open, setOpen, id = 0,buildings, rooms,roomTypes }) => {
  const dispatch = useAppDispatch();
  const [buildingId, setBuildingId] = useState<number | null>(0);
  const [roomTypeId, setRoomTypeId] = useState<number | null>(0);
  const [quantityRoom, setQuantityRoom] = useState<string>("");
  const [quantityPeople, setQuantityPeople] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<string | File>("");
  const [images, setImages] = useState<Array<string | File>>([]);

  useEffect(() => {
    if (id !== 0) {
      const room = rooms.find((x) => x.id === id)

      if (room) {
        setBuildingId(room.buildingId)
        setRoomTypeId(room.roomTypeId)
        setQuantityRoom(room.quantityRoom.toString())
        setQuantityPeople(room.quantityPeople)
        setDetail(room.detail)
        setPrice(room.price.toString())
        setImage(room.image)
        if (room && room.roomImages) {
          setImages(room.roomImages.map((item)=> item.image));
        }else setImages([])
      }
    }
    else {
      setBuildingId(0)
      setRoomTypeId(0)
      setQuantityRoom("")
      setQuantityPeople("")
      setDetail("")
      setPrice("")
      setImage("")
      setImages([])
    }
  }, [rooms, id, setOpen]);

  const fetchData = async () => {
    await dispatch(getBuildingAndRoom());
  };

  const createAndUpdate = async () => {
    Number(buildingId)
    Number(roomTypeId)
    Number(quantityRoom)
    Number(price)

    const item = await dispatch(createAndUpdateRoom({ id, buildingId, roomTypeId, quantityRoom, quantityPeople,detail,price,image ,images}));
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
  };

  const getRootProp = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setImage(acceptedFiles[0]);
      }
    },
    multiple: false,
  });

  const getRootProps = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setImages(acceptedFiles);
      }
    },
    multiple: true,
  });
  const handleBuildingChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setBuildingId(newValue);
  };
  const handleRoomTypeChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setRoomTypeId(newValue);
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <h2>{id === 0 ? "สร้างห้องพัก" : "แก้ไขห้องพัก"}</h2>
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
              <h4>อาคาร</h4>
              <JoySelect
                value={buildingId}
                onChange={handleBuildingChange}
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
                required
              >
                {buildings.length > 0 ?
                  buildings.map((building) => (
                    <Option key={building.id} value={building.id}>
                        {building.name}
                    </Option>
                  )):
                  <Option value={0}>ยังไม่มีการสร้างอาคาร</Option>
                }
              </JoySelect>
            </FormControl>
            <FormControl>
              <h4>ประเภทห้องพัก</h4>
              <JoySelect
                value={roomTypeId}
                onChange={handleRoomTypeChange}
                required
              >
                {roomTypes.length > 0 ?
                  roomTypes.map((roomType) => (
                    <Option key={roomType.id} value={roomType.id}>
                      {roomType.name}
                    </Option>
                  )):
                  <Option value={0}>ยังไม่มีการสร้างประเภทห้องพัก</Option>
                }
              </JoySelect>
            </FormControl>
            <FormControl>
              <h4>จำนวนห้อง</h4>
              <Input name="quantityRoom" required value={quantityRoom} onChange={(e) => setQuantityRoom(e.target.value)} />
            </FormControl>
            <FormControl>
              <h4>จำนวนคนที่อาศัย</h4>
              <Input name="quantityPeople" required value={quantityPeople} onChange={(e) => setQuantityPeople(e.target.value)} />
            </FormControl>
            <FormControl>
              <h4>รายละเอียด</h4>
              <Textarea name="detail" required value={detail} onChange={(e) => setDetail(e.target.value)}  placeholder="รายละเอียด..." minRows={2} maxRows={3} />
            </FormControl>
            <Button type="submit" disabled={buildings.length > 0 && roomTypes.length > 0 ? false : true}>ยืนยัน</Button>
          </Stack>
          <Stack spacing={2} style={{ flex: 1, marginLeft: '50px' }}>
            <FormControl>
              <h4>ราคา</h4>
              <Input name="price" type="number" required value={price} onChange={(e) => setPrice(e.target.value)} />
            </FormControl>
            <FormControl>
              <h4>รูปภาพ</h4>
              <div {...getRootProp.getRootProps()} style={dropzoneStyles}>
                <input {...getRootProp.getInputProps()} />
                {image ? (
                  <img src={typeof image === 'string' ? folderImage + image : URL.createObjectURL(image)} alt="Preview" style={previewStyles} />
                ) : (
                  <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหนึ่งภาพ</p>
                )}
              </div>
            </FormControl>
            <FormControl>
              <h4>หลายรูปภาพ</h4>
              <div {...getRootProps.getRootProps()} style={dropzonesStyles}>
                <input {...getRootProps.getInputProps()} />
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div key={index}>
                      {image && (
                        <img src={typeof image === 'string' ? folderImage + image : URL.createObjectURL(image)} alt="Preview" style={previewsStyles} />
                      )}
                    </div>
                  ))
                ) : (
                  <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหลายภาพ</p>
                )}
              </div>
            </FormControl>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}

const Model1: React.FC<ModelTypeProps> = ({ open, setOpen, id = 0,setId,roomTypes }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [isCER, setCER] = useState<string>("create");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCER((event.target as HTMLInputElement).value);

    if(isCER === "create"){
      setId(0)
    }
    else if(isCER === "edit"){
      setId(0)
    }
    else{
      setId(0)
      setName("")
    }
  };

  useEffect(() => {
    if (id !== 0) {
      const roomType = roomTypes.find((x) => x.id === id)
      if (roomType) {
        setName(roomType.name)
      }
    }
    else {
      setName("")
    }
  }, [roomTypes, id, setOpen]);

  const fetchData = async () => {
    await dispatch(getBuildingAndRoom());
  };

  const createAndUpdate = async () => {
    Number(id)
    if(isCER !== "remove"){
      const item = await dispatch(createAndUpdateRoomType({ id, name }));
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
    }else{
      const item = await dispatch(removeroomType(id));
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
    }
    fetchData()
  };

  const handleRoomTypeChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setId(newValue);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <h2>{isCER === "create" ? "สร้างประเภทห้องพัก" : isCER === "edit"?"แก้ไขประเภทห้องพัก":"ลบประเภทห้องพัก"}</h2>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
            createAndUpdate()
          }}
        >
          <Stack spacing={2}>
            <FormControl>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={isCER}
                onChange={handleChange}
              >
                <FormControlLabel value="create" control={<Radio />} label="สร้าง" />
                <FormControlLabel value="edit" control={<Radio />} label="แก้ไข" />
                <FormControlLabel value="remove" control={<Radio />} label="ลบ" />
              </RadioGroup>
            </FormControl>
            {isCER !== "create" && (
              <FormControl>
                <h4>รหัสประเภทห้องพัก</h4>
                <JoySelect
                  sx={{height: 40}}
                  value={id}
                  required
                  onChange={handleRoomTypeChange}
                >
                  {roomTypes.map((roomType) => (
                    <Option key={roomType.id} value={roomType.id}>
                      {roomType.name}
                    </Option>
                  ))}
                </JoySelect>
              </FormControl>
            )}
            {isCER !== "remove" && (
            <FormControl>
              <h4>ชื่อประเภท</h4>
              <Input name="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            )}
            <Button type="submit">ยืนยัน</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}

const dropzoneStyles :object= {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

const previewStyles :object= {
  maxWidth: '200px',
  maxHeight: '200px',
  marginTop: '10px',
};

const dropzonesStyles: object = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
};

const previewsStyles: object = {
  maxWidth: '100px',
  maxHeight: '100px',
  objectFit: 'cover',
  marginLeft: '5px',
};