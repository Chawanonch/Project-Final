import { useState } from 'react';
import { AppBar, Toolbar, Box,IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { changePage } from '../store/features/userSlice';
import { Badge } from '@mui/joy';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/joy/List';
import ModalClose from '@mui/joy/ModalClose';
import Drawer from '@mui/joy/Drawer';
import ListItemButton from '@mui/joy/ListItemButton';
import { windowSizes } from './Reuse';
import { routes } from './Path';
import { baseUrlServer } from './api/agent';
// import logo from '../images/logo/logo2.png';

export default function Navbar() {
  const location = useLocation();
  const { token, user } = useAppSelector((state) => state.user);
  const { booking, bookingPackage } = useAppSelector((state) => state.booking);
  const logo = baseUrlServer + "logo2.png";
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const [openMenu, setOpenMenu] = useState(false);

  const windowSize = windowSizes();

  const changePageAdmin = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(changePage())
    navigate(routes.home)
  }

  const countBooking = booking ? booking.filter((item) => item.status !== 3 && item.status !== 2).length : 0;
  const countBookingPackage = bookingPackage ? bookingPackage.filter((item) => item.status !== 3 && item.status !== 2).length : 0;

  const navLinks = [
    { path: routes.home, text: 'หน้าหลัก' },
    { path: routes.building, text: 'อาคาร/ห้องพัก' },
    { path: routes.softpower, text: 'ซอฟต์พาวเวอร์' },
    { path: routes.package, text: 'แพ็กเกจ' },
  ];

  return (
      <AppBar sx={{ background: "#7FC7D9", minHeight: "80px",width:"100%"}}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

          <div onClick={() => navigate(routes.home)}  style={{ marginTop: "20px",display:"flex", alignItems:"center", gap:10 , cursor: 'pointer'}}>
            <img src={logo} alt="Resort" style={{ height: "50px", width: "50px" , objectFit: 'cover' }} />
            <div>
              <h4 style={{color:"#000"}}>ศรีวัฒนธรรมรีสอร์ท</h4>
              <p style={{color:"#000"}}>(Sri Culture Resort)</p>
            </div>
          </div>

          <Box sx={{ display: 'flex', gap: '25px', marginTop: "20px" }}>
            {windowSize < 1183 ?
              <Box sx={{ display: 'flex' }}>
                <IconButton onClick={() => setOpenMenu(true)}>
                  <MenuIcon />
                </IconButton>
                <Drawer open={openMenu} anchor="right" onClose={() => setOpenMenu(false)}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      ml: 1,
                      mt: 1,
                      mr: 2,
                    }}
                  >
                    <ModalClose id="close-icon" sx={{ position: 'initial' }} />
                    <h4
                    >
                      ปิด
                    </h4>
                  </Box>
                  <List
                    size="lg"
                    component="nav"
                    sx={{
                      flex: 'none',
                      fontSize: 'xl',
                      '& > div': { justifyContent: 'center' },
                    }}
                  >
                    {
                      navLinks.map((link) => (
                        <ListItemButton key={link.path} onClick={() => {
                          setOpenMenu(false)
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          navigate(link.path)
                        }}
                          style={{
                            color: location.pathname === link.path ? '#000' : '#8E8B8B',
                            cursor: 'pointer'
                          }}
                        ><h4>{link.text}</h4></ListItemButton>
                      ))
                    }
                    {user?.role === "Admin" &&
                      <ListItemButton onClick={changePageAdmin}
                        style={{ color: location.pathname === '/admin' ? '#000' : '#8E8B8B', cursor: 'pointer' }}
                      ><h4>แอดมิน</h4></ListItemButton>
                    }
                    {token === "" ? (
                      <ListItemButton onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setOpenMenu(false)
                        navigate(routes.login)
                      }} style={{ color: location.pathname === routes.login ? '#000' : '#8E8B8B', cursor: 'pointer' }}><h4>เข้าสู่ระบบ</h4></ListItemButton>
                    ) : (
                      <>
                        <ListItemButton onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setOpenMenu(false)
                          navigate(routes.settings)
                        }}
                          style={{ color: location.pathname === routes.settings ? '#000' : '#8E8B8B', cursor: 'pointer' }}>
                          <h4>การตั้งค่า</h4>
                        </ListItemButton>
                      </>
                    )}
                  </List>
                </Drawer>
              </Box>
              :
              <>
                {
                  navLinks.map((link) => (
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
                  ))
                }

                {token !== "" && user?.role === "Admin" &&
                  <h4
                    onClick={changePageAdmin}
                    style={{ color: location.pathname === '/admin' ? '#fff' : '#000', cursor: 'pointer' }}
                    onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
                    onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === '/admin' ? '#fff' : '#000'}>
                    แอดมิน
                  </h4>
                }
                {token === "" ? (
                  <h4 onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    navigate(routes.login)
                  }} style={{ color: location.pathname === routes.login ? '#fff' : '#000', cursor: 'pointer' }} onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
                    onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === routes.login ? '#fff' : '#000'}>
                    เข้าสู่ระบบ
                  </h4>
                ) : (
                  <>
                    <Badge onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      navigate(routes.settings)
                      }} badgeContent={countBooking + countBookingPackage} max={10} color='danger' size="sm">
                      <h4 onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        navigate(routes.settings)
                      }} style={{ color: location.pathname === routes.settings ? '#fff' : '#000', cursor: 'pointer' }} onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
                        onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === routes.settings ? '#fff' : '#000'}>
                        การตั้งค่า
                      </h4>
                    </Badge>
                  </>
                )}
              </>
            }

          </Box>
        </Toolbar>
      </AppBar>
  );
}
