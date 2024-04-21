import { Button, DialogTitle, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Stack, Select as JoySelect } from '@mui/joy'
import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Option from '@mui/joy/Option';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useEffect, useState } from 'react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getRoles, getUserAdmin, registerUser, removeUser } from '../../store/features/userSlice';
import { Roles, Users } from '../../components/models/user';
import Swal from 'sweetalert2';

export default function UserAdmin() {
  const dispatch = useAppDispatch();
  const { users,roles } = useAppSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUser, setFilteredUser] = useState<Users[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectRole, setSelectRole] = useState<number | null>(0);

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectRole(newValue)
  };
  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 1:
        return 'แอดมิน';
      default:
        return 'ผู้ใช้งานทั่วไป';
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'รหัส', width: 80 },
    {
      field: 'roleId',
      headerName: 'บทบาท',
      width: 150,
      valueFormatter: (params) => getStatusLabel(params.value as number),
    },
    {
      field: 'username',
      headerName: 'ชื่อผู้ใช้',
      width: 120,
    },
    { field: 'phone', headerName: 'เบอร์โทร', width: 130 },
    { field: 'email', headerName: 'อีเมล', width: 130 },
    { field: 'image', headerName: 'รูปภาพ', width: 130 },
    {
      field: 'Remove',
      headerName: '',
      width: 55,
      renderCell: (params) => (
        <IconButton
          color="danger"
          onClick={async () => {
            
            const item = await dispatch(removeUser(params.row.id))
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
    await dispatch(getUserAdmin());
    await dispatch(getRoles());
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = users && users.filter(x => 
      (selectRole === 0 || x.roleId === selectRole) &&
      (searchQuery === "" || x.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredUser(filtered);
  }, [searchQuery, users, selectRole]);

  return (
    <Box sx={{ marginTop: 9.5, marginLeft: 30 }}>
      <h2 style={{marginTop:100,marginBottom:-30}}>ผู้ใช้งาน</h2>
      <div style={{marginTop:50}}/>

      <Box sx={{ marginTop: 3 }}>
        <Box sx={{ display: "flex" }}>
          <FormControl sx={{ width: "auto" }}>
            <h4>
              ค้นหาชื่อผู้ใช้งาน
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
              บทบาท
            </h4>
            <JoySelect defaultValue={0} onChange={handleChange}>
              <Option value={0}>
                ทั้งหมด
              </Option>
              <Option value={1}>
                แอดมิน
              </Option>
              <Option value={2}>
                ผู้ใช้งานทั่วไป
              </Option>
            </JoySelect>
          </FormControl>
          <FormControl sx={{ width: 80, marginLeft: 3 }}>
            <h4>
              สร้างผู้ใช้
            </h4>
            <IconButton
              color="success"
              onClick={() => {
                setOpen(true)
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </FormControl>
        </Box>
        <div style={{ height: 400, width: 1220, marginTop: 20 }}>
          <DataGrid
            rows={filteredUser}
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
      <Model open={open} setOpen={setOpen} users={users} roles={roles}/>
    </Box>
  )
}

interface ModelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: Users[];
  roles: Roles[];
}

const Model: React.FC<ModelProps> = ({ open, setOpen, users,roles }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [roleId, setRoleId] = useState<number | null>(0);

  useEffect(() => {
    setEmail("")
    setUsername("")
    setPassword("")
    setRoleId(0)
  }, [users,  setOpen]);


  const fetchData = async () => {
    await dispatch(getUserAdmin());
    await dispatch(getRoles());
  };

  const createAndUpdate = async () => {
    Number(roleId)

    const item = await dispatch(registerUser({ username, password, roleId, email}));
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
  const handleRoleChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setRoleId(newValue);
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <DialogTitle>สร้างบัญชี</DialogTitle>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
            createAndUpdate()
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>อีเมล</FormLabel>
              <Input name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>ผู้ใช้งาน</FormLabel>
              <Input name="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>รหัสผ่าน</FormLabel>
              <Input name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>บทบาท</FormLabel>
                <JoySelect
                  sx={{height: 40}}
                  value={roleId}
                  required
                  onChange={handleRoleChange}
                >
                  {roles.map((role) => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
                  ))}
                </JoySelect>
              </FormControl>
            <Button type="submit">ยืนยัน</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}
