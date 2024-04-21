import { Button, FormControl,IconButton, Input, Modal, ModalDialog, Stack, Select as JoySelect, Textarea } from '@mui/joy'
import { Box, FormControlLabel, RadioGroup } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Option from '@mui/joy/Option';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { createAndUpdateSoftpower, createAndUpdateSoftpowerType, removeSoftpower, removeSoftpowerType } from '../../store/features/softpowerSlice';
import { useEffect, useState } from 'react';
import { folderImage } from '../../components/api/agent';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDropzone } from 'react-dropzone';
import { Softpower, SoftpowerType } from '../../components/models/softpower';
import Radio from '@mui/material/Radio';
import Swal from 'sweetalert2';
import { getSoftpower } from '../../store/features/softpowerSlice';

export default function SoftpowerAdmin() {
  const dispatch = useAppDispatch();
  const { softpower, softpowerType } = useAppSelector((state) => state.softpower);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSoftpower, setFilteredSoftpower] = useState<Softpower[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [open1, setOpen1] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [id1, setId1] = useState<number | null>(0);
  const [selectType, setSelectType] = useState<number | null>(0);
  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectType(newValue)
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'รหัส', width: 80 },
    {
      field: 'name',
      headerName: 'ชื่อ',
      width: 100,
    },
    {
      field: 'importantName',
      headerName: 'ชื่ออื่น',
      width: 100,
    },
    {
      field: 'whatIs',
      headerName: 'หมายถึง',
      width: 100,
    },
    {
      field: 'origin',
      headerName: 'ที่มา',
      width: 100,
    },
    {
      field: 'refer',
      headerName: 'อ้างอิง',
      width: 100,
    },
    {
      field: 'softpowerTypeId',
      headerName: 'ประเภท',
      width: 120,
      renderCell: (params) => (
        <span>
          {softpowerType.find((type) => type.id === params.value)?.name || 'ไม่พบข้อมูล'}
        </span>
      ),
    },
    {
      field: 'image', headerName: 'รูปภาพ', width: 120,
      renderCell: (params) => (
        <img
          src={folderImage + params.value}
          alt="Image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ),
    },
    { field: 'softpowerImages', headerName: 'หลายรูปภาพ', width: 130,
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
            const item = await dispatch(removeSoftpower(params.row.id))
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
    await dispatch(getSoftpower());
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const countType = (typeId?:number) => {
    if(typeId && softpower) return softpower && softpower.filter((x)=>x.softpowerTypeId === typeId).length
    else return softpower.length
  };

  useEffect(() => {
    const filtered = softpower && softpower.filter(x => 
      (selectType === 0 || x.softpowerTypeId === selectType) &&
      (searchQuery === "" || x.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredSoftpower(filtered);
  }, [searchQuery, softpower, selectType]);

  return (
    <Box sx={{ marginTop: 9.5, marginLeft: 30 }}>
      <h2 style={{ marginTop: 100, marginBottom: -30 }}>ซอฟต์ฺพาวเวอร์</h2>
      <div style={{marginTop:50}}/>

      <Box sx={{ marginTop: 3 }}>
        <Box sx={{ display: "flex" }}>
          <FormControl sx={{ width: "auto" }}>
            <h4 >
              ค้นหาชื่อซอฟต์พาวเวอร์
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
                ทั้งหมด ({countType()})
                </Option>
                {softpowerType.map((type) => (
                  <Option key={type.id} value={type.id}>
                    {type.name} ({countType(type.id)})
                  </Option>
                ))}
                </JoySelect>
            </FormControl>
          <FormControl sx={{ width: 150, marginLeft: 3 }}>
            <h4>
              สร้างซอฟต์พาวเวอร์
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
            rows={filteredSoftpower}
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
      <Model open={open} setOpen={setOpen} id={id} softpowers={softpower} softpowerTypes={softpowerType} />
      <Model1 open={open1} setOpen={setOpen1} id={id1} setId={setId1} softpowerTypes={softpowerType} />
    </Box>
  )
}

interface ModelBuildingProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
  softpowers: Softpower[];
  softpowerTypes: SoftpowerType[];
}

interface ModelTypeProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number | null;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  softpowerTypes: SoftpowerType[];
}

const Model: React.FC<ModelBuildingProps> = ({ open, setOpen, id = 0, softpowers, softpowerTypes }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [importantName, setImportantName] = useState<string>("");
  const [whatIs, setWhatIs] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [refer, setRefer] = useState<string>("");
  const [softpowerTypeId, setSoftpowerTypeId] = useState<number | null>(0);
  const [image, setImage] = useState<string | File>("");
  const [images, setImages] = useState<Array<string | File>>([]);

  useEffect(() => {
    if (id !== 0) {
      const softpower = softpowers.find((x) => x.id === id)

      if (softpower) {
        setName(softpower.name)
        setImportantName(softpower.whatIs)
        setWhatIs(softpower.whatIs)
        setOrigin(softpower.origin)
        setRefer(softpower.whatIs)
        setSoftpowerTypeId(softpower.softpowerTypeId)
        setImage(softpower.image)
        if (softpower.softpowerImages) {
          setImages(softpower.softpowerImages.map((item)=> item.image));
        }else setImages([])
      }
    }
    else {
      setName("")
      setImportantName("")
      setWhatIs("")
      setOrigin("")
      setRefer("")
      setSoftpowerTypeId(0)
      setImage("")
      setImages([])
    }
  }, [softpowers, id, setOpen]);

  const fetchData = async () => {
    await dispatch(getSoftpower());
  };

  const createAndUpdate = async () => {
    Number(softpowerTypeId)

    const item = await dispatch(createAndUpdateSoftpower({ id, name, importantName, whatIs, origin, refer, softpowerTypeId, image, images }));
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
  const handleSoftpowerChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSoftpowerTypeId(newValue);
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <h2>{id === 0 ? "สร้างซอฟต์พาวเวอร์" : "แก้ไขซอฟต์พาวเวอร์"}</h2>
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
              <h4>ประเภทซอฟต์พาวเวอร์</h4>
              <JoySelect
                sx={{ height: 40 }}
                value={softpowerTypeId}
                onChange={handleSoftpowerChange}
                required
              >
                {softpowerTypes.length > 0 ? 
                  softpowerTypes.map((softpowerType) => (
                    <Option key={softpowerType.id} value={softpowerType.id}>
                      {softpowerType.name}
                    </Option>
                  )):<Option value={0}>ยังไม่มีการสร้างประเภทซอฟต์พาวเวอร์</Option>
                }
                
              </JoySelect>
            </FormControl>
            <FormControl>
              <h4>ชื่อ</h4>
              <Input name="name" placeholder="ชื่อ..." required value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <h4>หมายถึง</h4>
              <Textarea name="whatIs" required value={whatIs} onChange={(e) => setWhatIs(e.target.value)} placeholder="หมายถึงอะไร..." minRows={2} maxRows={3}/>
            </FormControl>
            <FormControl>
              <h4>ที่มา</h4>
              <Textarea name="origin" required value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="ที่มา..." minRows={2} maxRows={3}/>
            </FormControl>
            <FormControl>
              <h4>ชื่ออื่น</h4>
              <Input name="imName" required value={importantName} onChange={(e) => setImportantName(e.target.value)} />
            </FormControl>
            <FormControl>
              <h4>อ้างอิง</h4>
              <Input name="refer" required value={refer} onChange={(e) => setRefer(e.target.value)} />
            </FormControl>
          </Stack>
          <Stack spacing={2} style={{ flex: 1, marginLeft: '50px' }}>
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
                  images.map((value, index) => (
                    <div key={index}>
                      {value && (
                        <img src={typeof value === 'string' ? folderImage + value : URL.createObjectURL(value)} alt="Preview" style={previewsStyles} />
                      )}
                    </div>
                  ))
                ) : (
                  <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหลายภาพ</p>
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

const Model1: React.FC<ModelTypeProps> = ({ open, setOpen, id = 0, setId, softpowerTypes }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [isCER, setCER] = useState<string>("create");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCER((event.target as HTMLInputElement).value);

    if (isCER === "create") {
      setId(0)
    }
    else if (isCER === "edit") {
      setId(0)
    }
    else {
      setId(0)
      setName("")
    }
  };

  useEffect(() => {
    if (id !== 0) {
      const softpowerType = softpowerTypes.find((x) => x.id === id)
      if (softpowerType) {
        setName(softpowerType.name)
      }
    }
    else {
      setName("")
    }
  }, [softpowerTypes, id, setOpen]);

  const fetchData = async () => {
    await dispatch(getSoftpower());
  };

  const createAndUpdate = async () => {
    Number(id)
    if (isCER !== "remove") {
      const item = await dispatch(createAndUpdateSoftpowerType({ id, name }));
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
    } else {
      const item = await dispatch(removeSoftpowerType(id));
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
  const handleSoftpowerTypeChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setId(newValue);
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <h2>{isCER === "create" ? "สร้างประเภทซอฟต์พาวเวอร์" : isCER === "edit" ? "แก้ไขประเภทซอฟต์พาวเวอร์" : "ลบประเภทซอฟต์พาวเวอร์"}</h2>
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
                <h4>ประเภทซอฟต์พาวเวอร์</h4>
                <JoySelect
                  sx={{ height: 40 }}
                  value={id}
                  required
                  onChange={handleSoftpowerTypeChange}
                >
                  {softpowerTypes.map((softpowerType) => (
                    <Option key={softpowerType.id} value={softpowerType.id}>
                      {softpowerType.name}
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

const dropzoneStyles: object = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

const previewStyles: object = {
  maxWidth: '100px',
  maxHeight: '100px',
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