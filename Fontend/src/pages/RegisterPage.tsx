import { FormControl, Input } from '@mui/joy';
import { Grid, Paper, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { getUserAdmin, registerUser } from '../store/features/userSlice';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const { users } = useAppSelector((state) => state.user);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [roleId, setRoleId] = useState<number>(2);

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    dispatch(getUserAdmin());
  },[])

  const isValidEmail = (email:string) => {
    // ใช้ Regex เพื่อตรวจสอบรูปแบบของอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const funRegister = async () => {
    if (!username || !password) {
      
      Swal.fire({
        position: "center",
        icon: 'info',
        title: 'กรุณาป้อนให้ถูกต้อง !',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }
    if (!isValidEmail(email)) {
      Swal.fire({
        position: "center",
        icon: 'info',
        title: 'กรุณาป้อนอีเมลให้ถูกต้อง !',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }
    const isAdmin = users.some((user) => user.roleId === 1);
    if (!isAdmin) setRoleId(1); //Admin
    else setRoleId(2); //User
    const item = await dispatch(registerUser({ username, email, password, roleId }))
    
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "สร้างบัญชีผู้ใช้สำเร็จ !",
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(() => {
        navigate('/login');
      }, 900);
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
  }

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 50 }}>
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
            </FormControl><div style={{marginTop:15}}/>
            <FormControl>
              <h4>รหัสผ่าน *</h4><div style={{marginTop:15}}/>
              <Input type="password" placeholder="" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
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
              <Link to="/login">
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
