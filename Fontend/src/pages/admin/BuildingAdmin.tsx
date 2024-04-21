import { Button, DialogTitle, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Stack } from '@mui/joy'
import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { createAndUpdateBuilding, getBuildingAndRoom, removeBuilding } from '../../store/features/room&BuildingSlice';
import { useEffect, useState } from 'react';
import { folderImage } from '../../components/api/agent';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDropzone } from 'react-dropzone';
import { Building } from '../../components/models/building';
import Swal from 'sweetalert2';

export default function BuildingAdmin() {
  const dispatch = useAppDispatch();
  const { building } = useAppSelector((state) => state.room);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBuilding, setFilteredBuilding] = useState<Building[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'รหัส', width: 80 },
    { field: 'name', headerName: 'ชื่อ', width: 130 },
    { field: 'location', headerName: 'ที่ตั้ง', width: 130 },
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
            const item = await dispatch(removeBuilding(params.row.id))
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
  }, []);

  useEffect(() => {
    const filtered = building && building.filter((item) =>
      item && item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBuilding(filtered);
  }, [searchQuery, building]);

  return (
    <Box sx={{ marginTop: 9.5, marginLeft: 30 }}>
      
      <h2 style={{marginTop:100,marginBottom:-30}}>อาคาร</h2>
      <div style={{marginTop:50}}/>
      
      <Box sx={{ marginTop: 3 }}>
        <Box sx={{ display: "flex" }}>
          <FormControl sx={{ width: "auto" }}>
            <h4>
              ค้นหาอาคาร
            </h4>
            <Input
              placeholder="search"
              startDecorator={
                <Button sx={{ width: 40 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
                </Button>
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ borderRadius: 8, width: 600 }}
            />
          </FormControl>
          <FormControl sx={{ width: 80, marginLeft: 3 }}>
            <h4>
              สร้างอาคาร
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
            rows={filteredBuilding}
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
      <ModelBuilding open={open} setOpen={setOpen} id={id} buildings={building} />
    </Box>
  )
}

interface ModelBuildingProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
  buildings: Building[]; 
}

const ModelBuilding: React.FC<ModelBuildingProps> = ({ open, setOpen, id = 0, buildings }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [image, setImage] = useState<string | File>("");

  useEffect(() => {
    if (id !== 0) {
      const building = buildings.find((x) => x.id === id)

      if (building) {
        setName(building.name)
        setLocation(building.location)
        setImage(building.image)
      }
    }
    else {
      setName("")
      setLocation("")
      setImage("")
    }
  }, [buildings, id, setOpen]);

  const fetchData = async () => {
    await dispatch(getBuildingAndRoom());
  };

  const createAndUpdate = async () => {
    const item = await dispatch(createAndUpdateBuilding({ id, name, location, image: image }));
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Update the image state with the first accepted file
      if (acceptedFiles && acceptedFiles.length > 0) {
        setImage(acceptedFiles[0])
        console.log(acceptedFiles[0])
      }
    },
  });

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <h2>{id === 0 ? "สร้างอาคาร" : "แก้ไขอาคาร"}</h2>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
            createAndUpdate()
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <h4>ชื่ออาคาร</h4>
              <Input name="name" autoFocus required value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <h4>สถานที่ตั้ง</h4>
              <Input name="location" required value={location} onChange={(e) => setLocation(e.target.value)} />
            </FormControl>
            <FormControl>
              <h4>รูปภาพ</h4>
              <div {...getRootProps()} style={dropzoneStyles}>
                <input {...getInputProps()} />
                {image ? (
                  <img src={typeof image === 'string' ? folderImage + image : URL.createObjectURL(image)} alt="Preview" style={previewStyles} />
                ) : (
                  <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหนึ่งภาพ</p>
                )}
              </div>
            </FormControl>
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