import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import { Box } from '@mui/material'
import RoomPage from './pages/RoomPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPassword'
import BuildingPage from './pages/BuildingPage'
import { useAppDispatch, useAppSelector } from './store/store'
import { useEffect } from 'react'
import { checkExpToken, getByUser, getUserAdmin, logout } from './store/features/userSlice'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import NavbarTopAndLeftAdmin from './pages/admin/NavbarTopAndLeftAdmin'
import BuildingAdmin from './pages/admin/BuildingAdmin'
import RoomAdmin from './pages/admin/RoomAdmin'
import BookingAdmin from './pages/admin/BookingAdmin'
import UserAdmin from './pages/admin/UserAdmin'
import { getBuildingAndRoom } from './store/features/room&BuildingSlice'
import { getBookingAdmin, getBookingByUser, getBookingPackageAdmin, getBookingPackageByUser, getPaymentBooking } from './store/features/bookingSlice'
import Footer from './components/Footer'
import SettingPage from './pages/SettingPage'
import "./app.css";
import SoftpowerPage from './pages/SoftpowerPage'
import AboutPage from './pages/AboutPage'
import SoftpowerAdmin from './pages/admin/SoftpowerAdmin'
import CommentAdmin from './pages/admin/CommentAdmin'
import PackagePage from './pages/PackagePage'
import PackageAdmin from './pages/admin/PackageAdmin'
import SoftpowerDetailPage from './pages/SoftpowerDetailPage'
import { getSoftpower } from './store/features/softpowerSlice'
import { getPackage } from './store/features/packageSlice'
import { getComment } from './store/features/commentSlice'
import ErrorPage from './pages/ErrorPage'

function App() {
  const { changePage, token, user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  
  const fetchNoToken = async () => {
    await dispatch(getBuildingAndRoom());
    await dispatch(getSoftpower());
    await dispatch(getPackage());
    await dispatch(getComment());
  }

  const fetchToken = async () => {
    await dispatch(getByUser());
    await dispatch(getBookingByUser());
    await dispatch(getBookingPackageByUser());
    await dispatch(getPaymentBooking());
  }

  const fetchByAdmin = async () => {
    await dispatch(getUserAdmin());
    await dispatch(getBookingAdmin());
    await dispatch(getBookingPackageAdmin());
  }

  useEffect(() => {
    const fetchData = async () => {
      if (token !== "") {
        const isTokenValid = await dispatch(checkExpToken(token));

        if (isTokenValid.payload === false) {
          fetchToken();
        } else {
          await dispatch(logout());
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      fetchNoToken()
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      fetchByAdmin()
    };

    fetchData();
  }, [user && user.role === "Admin"]);

  return (
      <BrowserRouter>
        {changePage === true ?
          <>
            <NavbarTopAndLeftAdmin />
            <Routes>
              <Route path={"/"} element={<DashboardAdmin />} />
              <Route path={"/buildingSetting"} element={<BuildingAdmin />} />
              <Route path={"/roomSetting"} element={<RoomAdmin />} />
              <Route path={"/softpowerSetting"} element={<SoftpowerAdmin />} />
              <Route path={"/bookingSetting"} element={<BookingAdmin />} />
              <Route path={"/commentSetting"} element={<CommentAdmin />} />
              <Route path={"/packageSetting"} element={<PackageAdmin />} />
              <Route path={"/userSetting"} element={<UserAdmin />} />
            </Routes>
          </>
          :
          <div>
            <Navbar />
            <Box sx={{ marginTop: 12, flex: 1 }}>
              <Routes>
                <Route path={"/"} element={<HomePage />} />
                <Route path={"/building"} element={<BuildingPage />} />
                <Route path={"/rooms/:id"} element={<RoomPage />} />
                <Route path={"/softpower"} element={<SoftpowerPage />} />
                <Route path={"/softpower/:id"} element={<SoftpowerDetailPage />} />
                <Route path={"/package"} element={<PackagePage />} />
                <Route path={"/about"} element={<AboutPage />} />
                <Route path={"/login"} element={<LoginPage />} />
                <Route path={"/register"} element={<RegisterPage />} />
                <Route path={"/forgotPassword"} element={<ForgotPasswordPage />} />
                {user && user.role === "Admin" &&
                  <Route path={"/settings"} element={<SettingPage />} />
                }
                <Route path={"*"} element={<ErrorPage />} />
              </Routes>
            </Box>
            <div style={{ marginTop: 200 }}></div>
            <Footer />
          </div>
        }
      </BrowserRouter>
  )
}

export default App
