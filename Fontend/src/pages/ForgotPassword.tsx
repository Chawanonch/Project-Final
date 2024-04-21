import { FormControl, Input } from '@mui/joy';
import { Grid, Paper, Button } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  // const dispatch = useAppDispatch()
  // const navigate = useNavigate()

  const funEmail = async () => {
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

    // const item = await dispatch(registerUser({ email }))
    // Swal.fire({
    //   position: "center",
    //   icon: "success",
    //   title: "ยืนยันอีเมลเสร็จสิน !",
    //   showConfirmButton: false,
    //   timer: 1000
    // });
    // if (item.payload !== "" && item.payload !== undefined) {
    //   setTimeout(() => {
    //     navigate('/');
    //   }, 900);
    // }
    // else {
    //   Swal.fire({
    //     position: "center",
    //     icon: 'info',
    //     title: 'กรุณาป้อนให้ถูกต้อง !',
    //     showConfirmButton: false,
    //     timer: 1000
    //   });
  }
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 50 }}>
          <h1 style={{ margin: '20px 0', textAlign: "center" }}>
            ลืมรหัสผ่าน
          </h1>
          <form>
            <FormControl>
              <h4>อีเมล *</h4><div style={{marginTop:15}}/>
              <Input placeholder="" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

          </form>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 20, borderRadius: 20, width: 220, background: "#365486" }}
              onClick={funEmail}
            >
              ลืมรหัสผ่าน
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

export default ForgotPasswordPage;
