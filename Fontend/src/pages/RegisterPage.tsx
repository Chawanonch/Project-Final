import { FormControl, Input } from '@mui/joy';
import { Grid, Paper, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { getUserAdmin, registerUser } from '../store/features/userSlice';
import Swal from 'sweetalert2';
import { routes } from '../components/Path';
import { isValidEmail } from '../components/Reuse';

const RegisterPage = () => {
  const { users } = useAppSelector((state) => state.user);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [roleId, setRoleId] = useState<number>(2);

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUserAdmin());
    };

    fetchData();
  }, [dispatch]);

  const funRegister = async () => {
    if (!username) {
      Swal.fire({
        position: "center",
        icon: 'info',
        title: 'กรุณาป้อนชื่อผู้ใช้ !',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        position: "center",
        icon: 'info',
        title: 'กรุณาป้อนรหัสไม่ต่ำกว่า 6 ตัว !',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }

    if (!isValidEmail(email)) {
      Swal.fire({
        position: "center",
        icon: 'info',
        title: 'กรุณาป้อนรูปแบบอีเมลให้ถูกต้อง !',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }

    const isAdmin = users.some((user:any) => user.roleId === 1);
    if (!isAdmin) setRoleId(1); //Admin
    else setRoleId(2); //User

    console.log(roleId)
    
    const item = await dispatch(registerUser({ username, email, password, roleId }))
    
    if (item.payload !== "" && item.payload !== undefined && item.payload !== null) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "สร้างบัญชีผู้ใช้สำเร็จ !",
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(() => {
        navigate(routes.login);
      }, 900);
    }
    else {
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'อีเมลหรือชื่อมีผู้ใช้งานแล้ว กรุณาเปลี่ยนใหม่ !',
        showConfirmButton: false,
        timer: 1000
      });
    }
  }

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 50 ,borderRadius:20}}>
          <h1 style={{ margin: '20px 0', textAlign: "center" }}>
            สมัครสมาชิก
          </h1>
          <form>
            <FormControl>
              <h4>ชื่อผู้ใช้งาน *</h4>
              <div style={{marginTop:15}}/>
              <Input type="name" placeholder="" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>

            <div style={{marginTop:15}}/>

            <FormControl>
              <h4>อีเมล *</h4><div style={{marginTop:15}}/>
              <Input type="email" placeholder="" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
              {email && !isValidEmail(email) &&
                <p style={{ marginTop:5,color:"#F35959" }}>
                  กรุณาป้อนรูปแบบอีเมลให้ถูกต้อง
                </p>
              }
            </FormControl><div style={{marginTop:15}}/>

            <FormControl>
              <h4>รหัสผ่าน *</h4><div style={{marginTop:15}}/>
              <Input type="password" placeholder="" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
              {password && password.length < 6 &&
                <p style={{ marginTop:5, color:"#F35959" }}>
                  กรุณาป้อนรหัสไม่ต่ำกว่า 6 ตัว
                </p>
              }
            </FormControl>
          </form>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 20, borderRadius: 20, width: 220, background: "#365486" }}
              onClick={funRegister}
            >
              สมัครสมาชิก
            </Button>
            <h4><div style={{marginTop:15}}/>
              <Link to={routes.login}>
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </h4>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
