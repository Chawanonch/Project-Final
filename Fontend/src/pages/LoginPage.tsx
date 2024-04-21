import { Grid, Paper, Button } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { getByUser, loginUser } from '../store/features/userSlice';
import { FormControl, Input } from '@mui/joy';
import Swal from 'sweetalert2';
import { getBookingByUser, getBookingPackageByUser } from '../store/features/bookingSlice';

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      Swal.fire({
        position: "center",
        icon: 'info',
        title: 'กรุณาป้อนให้ถูกต้อง !',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }
    const item = await dispatch(loginUser({ emailOrUsername, password }))

    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "เข้าสู่ระบบเสร็จสิน !",
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(async () => {
        navigate('/');
        await dispatch(getByUser());
        await dispatch(getBookingByUser());
        await dispatch(getBookingPackageByUser());
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
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 50 }}>
          <h1 style={{ margin: '20px 0', textAlign: "center" }}>
            ยินดีต้อนรับ
          </h1>

          <form>
            <FormControl>
              <h4>อีเมลหรือชื่อผู้ใช้งาน *</h4>
              <div style={{ marginTop: 15 }} />

              <Input type="name" placeholder="" fullWidth value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} />
            </FormControl>
            <div style={{ marginTop: 15 }} />

            <FormControl>
              <h4>รหัสผ่าน *</h4>
              <div style={{ marginTop: 15 }} />

              <Input type="password" placeholder="" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
              <Grid item>
                <div style={{ marginTop: 15 }} />

                <Link to="/forgotPassword" >
                  <h4>
                    ลืมรหัสผ่าน?
                  </h4>
                </Link>
              </Grid>
            </Grid>
            <div style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: 20, borderRadius: 20, width: 220, background: "#365486" }}
                onClick={handleLogin}
              >
                เข้าสู่ระบบ
              </Button>
              <div style={{ marginTop: 15 }} />

              <h4>
                หรือ
              </h4>
              <div style={{ marginTop: 15 }} />

              <h4 style={{ marginTop: 2 }}>
                ยังไม่มีบัญชี?{' '}
                <Link to="/register" color="#756F5E">
                  สร้างบัญชีใหม่
                </Link>
              </h4>
            </div>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
