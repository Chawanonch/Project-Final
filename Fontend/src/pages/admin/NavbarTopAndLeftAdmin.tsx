import { AppBar, Box, IconButton, Toolbar, styled } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { changePage, getByUser, logout } from '../../store/features/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Button, Input, ListItemButton, ListItemContent, ListItemDecorator, listItemDecoratorClasses } from '@mui/joy';
import { useEffect, useState } from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import LuggageIcon from '@mui/icons-material/Luggage';
import { getBookingByUser, getBookingPackageByUser } from '../../store/features/bookingSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function NavbarTopAndLeftAdmin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const location = useLocation();

  const handleLogout = async () => {
    await dispatch(logout());
    await dispatch(getByUser());
    await dispatch(getBookingByUser());
    await dispatch(getBookingPackageByUser());
    navigate("/login");
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

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        sx={{
          backgroundColor: "#7FC7D9",
          boxShadow: "none",
          height: 70
        }}
      >
        <Toolbar sx={{ marginLeft: 27 }}>
          <Input
            placeholder="search"
            startDecorator={
              <Button sx={{ width: 40 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
              </Button>
            }
            sx={{ borderRadius: 8, width: 800 }}
          />
          <Box sx={{ marginLeft: 'auto' }}></Box>
          <Box sx={{ display: 'flex', gap: '25px', marginTop: "20px" }}>
            <h4
              onClick={changePageUser}
              style={{ marginTop:10,color: location.pathname === '/admin' ? '#fff' : '#000', cursor: 'pointer' }}
              onMouseOver={(e) => (e.target as HTMLHeadingElement).style.color = '#E5E7E9'}
              onMouseOut={(e) => (e.target as HTMLHeadingElement).style.color = location.pathname === '/admin' ? '#fff' : '#000'}>
              กลับหน้าผู้ใช้
            </h4>
            <IconButton edge="end" aria-label="account">
              <AccountCircleIcon />
              <Box>
                <p color="#000" style={{ marginLeft: 1, fontSize: 10 }}>
                  Chawanon
                </p>
                <p color="#000" style={{ marginLeft: 1, fontSize: 10 }}>
                  Admin
                </p>
              </Box>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
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
      </Drawer>
    </Box>
  );
}
