import { FormControl, Input } from '@mui/joy';
import { Grid, Paper, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { forgotPassword, getUserAdmin } from '../store/features/userSlice';
import { useAppSelector, useAppDispatch } from '../store/store';
import { routes } from '../components/Path';

const ForgotPasswordPage = () => {
  const { users } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPassword1, setNewPassword1] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getUserAdmin());
  }, [])

  const isValidEmail = (email: string) => {
    // ใช้ Regex เพื่อตรวจสอบรูปแบบของอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const funForgotPassword = async () => {
    if (!email) {
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
    const isEmail = users.some((user) => user.email === email);
    if (!isEmail) {
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'ไม่มีอีเมลนี้อยู่ในระบบ !',
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      setShowPassword(true)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "มีอีเมลในระบบ !",
        showConfirmButton: false,
        timer: 1000
      });
    }
  }

  const funChangePassword = async () => {
    const item = await dispatch(forgotPassword({ email, newPassword }))

    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "เปลี่ยนรหัสเสร็จสิ้น !",
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(() => {
        setShowPassword(false)
        navigate(routes.login);
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
        <Paper elevation={3} style={{ padding: 50, borderRadius: 20 }}>
          <h1 style={{ margin: '20px 0', textAlign: "center" }}>
            {showPassword ? "เปลี่ยนรหัสผ่าน":"ลืมรหัสผ่าน"}
          </h1>
          <form>
            {!showPassword ?
              <FormControl>
                <h4>อีเมล *</h4><div style={{ marginTop: 15 }} />
                <Input type="email"  placeholder="" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl> 
              :
              <><FormControl>
                <h4>รหัสผ่านใหม่ *</h4><div style={{ marginTop: 15 }} />
                <Input type="password"  placeholder="" fullWidth required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </FormControl>
                <div style={{ marginTop: 15 }} />
                <FormControl>
                  <h4>ยืนยันรหัสผ่านใหม่ *</h4><div style={{ marginTop: 15 }} />
                  <Input type="password"  placeholder="" fullWidth required value={newPassword1} onChange={(e) => setNewPassword1(e.target.value)} />
                </FormControl>
                </>
            }
          </form>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 20, borderRadius: 20, width: 220, background: "#365486" }}
              onClick={showPassword ? funChangePassword : funForgotPassword}
            >
              {showPassword ? "ยืนยันการเปลี่ยนรหัส" : "ลืมรหัสผ่าน"}
            </Button>
            <h4><div style={{ marginTop: 15 }} />
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

export default ForgotPasswordPage;
