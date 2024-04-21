import React from 'react';
import { AppBar, Toolbar, Box, Slide, useScrollTrigger } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { changePage } from '../store/features/userSlice';
import { Badge } from '@mui/joy';

export default function Navbar() {
  const location = useLocation();
  const { token, user } = useAppSelector((state) => state.user);
  const { booking, bookingPackage } = useAppSelector((state) => state.booking);

  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  interface Props {
    window?: () => Window;
    children: React.ReactElement;
  }

  function HideOnScroll(props: Props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });

    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }

  const changePageAdmin = () => {
    dispatch(changePage())
    navigate("/")
  }

  const countBooking = booking ? booking.filter((item)=>item.status !== 3 && item.status !== 2).length : 0;

  const navLinks = [
    { path: '/', text: 'หน้าหลัก' },
    { path: '/building', text: 'อาคาร/ห้องพัก' },
    { path: '/softpower', text: 'ซอฟต์พาวเวอร์' },
    { path: '/package', text: 'แพ็กเกจ' },
  ];

  return (
    <HideOnScroll>
      <AppBar sx={{ background: "#7FC7D9", height: "80px", boxShadow: "none" }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

          <Box sx={{ marginTop: "20px", display: { xs: 'none', md: 'block' } }}>
            <img onClick={() => navigate("/")} src="https://cdn-icons-png.flaticon.com/256/327/327373.png" alt="Resort" style={{ height: "50px", width: "50px" }} />
          </Box>

          <Box sx={{ display: 'flex', gap: '25px', marginTop: "20px" }}>
            {navLinks.map((link) => (
              <h4
                key={link.path}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate(link.path)
                }}
                style={{
                  color: location.pathname === link.path ? '#fff' : '#000',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
                onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === link.path ? '#fff' : '#000'}>
                {link.text}
                
              </h4>
            ))}

            {user?.role === "Admin" &&
              <h4
                onClick={changePageAdmin}
                style={{ color: location.pathname === '/admin' ? '#fff' : '#000', cursor: 'pointer' }}
                onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
                onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === '/admin' ? '#fff' : '#000'}>
                แอดมิน
              </h4>
            }
            {token === "" ? (
              <h4 onClick={() => navigate("/login")} style={{ color: location.pathname === '/login' ? '#fff' : '#000', cursor: 'pointer' }} onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
                onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === '/login' ? '#fff' : '#000'}>
                เข้าสู่ระบบ
              </h4>
            ) : (
              <>
                <Badge onClick={() => navigate("/settings")} badgeContent={countBooking} color='danger' size="sm">
                  <h4 onClick={() => navigate("/settings")} style={{ color: location.pathname === '/settings' ? '#fff' : '#000', cursor: 'pointer'}} onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
                    onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === '/settings' ? '#fff' : '#000'}>
                    การตั้งค่า
                  </h4>
                </Badge>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
