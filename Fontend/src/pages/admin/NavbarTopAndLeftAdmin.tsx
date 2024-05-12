import { AppBar, Box, IconButton, Toolbar, styled } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { changePage, getByUser, logout } from '../../store/features/userSlice';
import { useAppDispatch, useAppSelector, } from '../../store/store';
import { ListItemButton, ListItemContent, ListItemDecorator, ModalClose, listItemDecoratorClasses } from '@mui/joy';
import { useEffect, useState } from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import LuggageIcon from '@mui/icons-material/Luggage';
import { getBookingByUser, getBookingPackageByUser } from '../../store/features/bookingSlice';
import { windowSizes } from '../../components/Reuse';
import MenuIcon from '@mui/icons-material/Menu';
import Swal from 'sweetalert2';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function NavbarTopAndLeftAdmin() {
  const { user } = useAppSelector((state) => state.user)

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const windowSize = windowSizes();

  const handleLogout = async () => {
    await dispatch(getByUser());
    await dispatch(getBookingByUser());
    await dispatch(getBookingPackageByUser());
    Swal.fire({
      position: "center",
      icon: "success",
      title: "ออกจากระบบเสร็จสิน !",
      showConfirmButton: false,
      timer: 1000
    });
    setTimeout(async () => {
      await dispatch(logout());
      navigate("/login");
    }, 900);
  };
  const drawerWidth = 220;

  useEffect(() => {
    // Update index based on the current location pathname
    switch (location.pathname) {
      case '/':
        setIndex(0);
        break;
      case '/buildingSetting':
        setIndex(1);
        break;
      case '/roomSetting':
        setIndex(2);
        break;
      case '/softpowerSetting':
        setIndex(3);
        break;
      case '/packageSetting':
        setIndex(4);
        break;
      case '/bookingSetting':
        setIndex(5);
        break;
      case '/commentSetting':
        setIndex(6);
        break;
      case '/userSetting':
        setIndex(7);
        break;
      default:
        setIndex(0);
    }
  }, [location.pathname]);

  const changePageUser = () => {
    dispatch(changePage())
    navigate("/")
  }
  function listNavAdmin() {
    return(
      <List
    aria-label="Sidebar"
    sx={{
      '--ListItem-paddingLeft': '0px',
      '--ListItemDecorator-size': '64px',
      '--ListItem-minHeight': '32px',
      '--List-nestedInsetStart': '13px',
      [`& .${listItemDecoratorClasses.root}`]: {
        justifyContent: 'flex-end',
        pr: '18px',
      },
      '& [role="button"]': {
        borderRadius: '0 20px 20px 0',
      },
    }}
  >
    <DrawerHeader></DrawerHeader>
    <ListItem >
      <ListItemButton
        selected={index === 0}
        color={index === 0 ? 'neutral' : undefined}
        onClick={() => {
          setIndex(0);
          navigate("/");
          setOpenMenu(false)
        }}
      >
        <ListItemDecorator>
          <DashboardIcon />
        </ListItemDecorator>
        <ListItemContent>แผงควบคุม</ListItemContent>
      </ListItemButton>
    </ListItem>
    <ListItem >
      <ListItemButton
        selected={index === 1}
        color={index === 1 ? 'neutral' : undefined}
        onClick={() => {
          setIndex(1);
          navigate("/buildingSetting");
          setOpenMenu(false)
        }}
      >
        <ListItemDecorator>
          <BusinessIcon />
        </ListItemDecorator>
        <ListItemContent>อาคาร</ListItemContent>
      </ListItemButton>
    </ListItem>
    <ListItem>
      <ListItemButton
        selected={index === 2}
        color={index === 2 ? 'neutral' : undefined}
        onClick={() => {
          setIndex(2);
          setOpenMenu(false)
          navigate("/roomSetting");
        }}
      >
        <ListItemDecorator>
          <NightShelterIcon />
        </ListItemDecorator>
        <ListItemContent>ห้องพัก</ListItemContent>
      </ListItemButton>
    </ListItem>
    <ListItem>
      <ListItemButton
        selected={index === 3}
        color={index === 3 ? 'neutral' : undefined}
        onClick={() => {
          setIndex(3);
          setOpenMenu(false)
          navigate("/softpowerSetting");
        }}
      >
        <ListItemDecorator>
          <EmojiTransportationIcon />
        </ListItemDecorator>
        <ListItemContent>ซอฟต์พาวเวอร์</ListItemContent>
      </ListItemButton>
    </ListItem>
    <ListItem>
      <ListItemButton
        selected={index === 4}
        color={index === 4 ? 'neutral' : undefined}
        onClick={() => {
          setIndex(4);
          setOpenMenu(false)
          navigate("/packageSetting");
        }}
      >
        <ListItemDecorator>
          <HistoryIcon />
        </ListItemDecorator>
        <ListItemContent>แพ็กเกจ</ListItemContent>
      </ListItemButton>
    </ListItem>
    <ListItem>
      <ListItemButton
        selected={index === 5}
        color={index === 5 ? 'neutral' : undefined}
        onClick={() => {
          setIndex(5);
          setOpenMenu(false)
          navigate("/bookingSetting");
        }}
      >
        <ListItemDecorator>
          <MessageIcon />
        </ListItemDecorator>
        <ListItemContent>ประวัติการจอง</ListItemContent>
      </ListItemButton>
    </ListItem>
    <ListItem>
      <ListItemButton
        selected={index === 6}
        color={index === 6 ? 'neutral' : undefined}
        onClick={() => {
          setIndex(6);
          setOpenMenu(false)
          navigate("/commentSetting");
        }}
      >
        <ListItemDecorator>
          <LuggageIcon />
        </ListItemDecorator>
        <ListItemContent>แสดงความคิดเห็น</ListItemContent>
      </ListItemButton>
    </ListItem>
    <ListItem>
      <ListItemButton
        selected={index === 7}
        color={index === 7 ? 'neutral' : undefined}
        onClick={() => {
          setIndex(7);
          setOpenMenu(false)
          navigate("/userSetting");
        }}
      >
        <ListItemDecorator>
          <AccountCircleIcon />
        </ListItemDecorator>
        <ListItemContent>ผู้ใช้งาน</ListItemContent>
      </ListItemButton>
    </ListItem>
    <Box sx={{ marginTop: 5 }}></Box>
    <ListItem sx={{ justifyContent: "center" }}>
      <ListItemButton
        onClick={handleLogout}
      >
        <ListItemDecorator>
          <LogoutIcon />
        </ListItemDecorator>
        <ListItemContent>ออกจากระบบ</ListItemContent>
      </ListItemButton>
    </ListItem>
      </List>
    )
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        sx={{
          backgroundColor: "#7FC7D9",
          boxShadow: "none",
          height: 70
        }}
      >
        
        <Toolbar sx={{ marginLeft: windowSize < 1183 ? 0 : 27 }}>
          {windowSize < 1183 &&
            <Box>
              <IconButton sx={{top:8}} onClick={() => setOpenMenu(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer open={openMenu} anchor="left" onClose={() => setOpenMenu(false)}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    ml: 'auto',
                    mt: 1,
                    mr: 2,
                  }}
                >
                  <h4
                  >
                    ปิด
                  </h4>
                  <ModalClose id="close-icon" onClick={() => setOpenMenu(false)} sx={{ position: 'initial' }} />
                </Box>
                {listNavAdmin()}
              </Drawer>
            </Box>
          }
          <Box sx={{ marginLeft: 'auto' }}></Box>
          <Box sx={{ display: 'flex', gap: '25px', marginTop: "20px" }}>
            <h4
              onClick={changePageUser}
              style={{ marginTop: 10, color: location.pathname === '/admin' ? '#fff' : '#000', cursor: 'pointer' }}
              onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
              onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === '/admin' ? '#fff' : '#000'}>
              กลับหน้าผู้ใช้
            </h4>
            <IconButton edge="end" aria-label="account">
              <AccountCircleIcon />
              <Box>
                <h4 color="#000" style={{ marginLeft: 1, fontSize: 10 }}>
                  {user?.username}
                </h4>
              </Box>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {windowSize < 1183 ?
        <Box></Box>
        :
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none', // เพิ่มบรรทัดนี้เพื่อทำให้ไม่มีเส้น
            },
            position: "fixed",
            borderColor: "#fff"
          }}
          variant="permanent"
          anchor="left"
        >
          {listNavAdmin()}
        </Drawer>
      }
    </Box>
  );
}
