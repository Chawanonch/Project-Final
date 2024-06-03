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
import { getBookingAdmin, getBookingByUser, getBookingPackageAdmin, getBookingPackageByUser, getPaymentBooking, getPaymentBookingPackages } from './store/features/bookingSlice'
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
import { getComment, getCommentPackage } from './store/features/commentSlice'
import ErrorPage from './pages/ErrorPage'
import { routes, routesAdmin } from './components/Path'
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'yet-another-react-lightbox/styles.css';

function App() {
  const { changePage, token, user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  
  const fetchNoToken = async () => {
    await dispatch(getBuildingAndRoom());
    await dispatch(getSoftpower());
    await dispatch(getPackage());
    await dispatch(getComment());
    await dispatch(getCommentPackage());
  }

  const fetchToken = async () => {
    await dispatch(getByUser());
    await dispatch(getBookingByUser());
    await dispatch(getBookingPackageByUser());
    await dispatch(getPaymentBooking());
    await dispatch(getPaymentBookingPackages());
  }

  const fetchByAdmin = async () => {
    await dispatch(getUserAdmin());
    await dispatch(getBookingAdmin());
    await dispatch(getBookingPackageAdmin());
  }

  useEffect(() => {
    AOS.init();
  }, []);

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
              <Route path={routesAdmin.home} element={<DashboardAdmin />} />
              <Route path={routesAdmin.buildingSetting} element={<BuildingAdmin />} />
              <Route path={routesAdmin.roomSetting} element={<RoomAdmin />} />
              <Route path={routesAdmin.softpowerSetting} element={<SoftpowerAdmin />} />
              <Route path={routesAdmin.bookingSetting} element={<BookingAdmin />} />
              <Route path={routesAdmin.commentSetting} element={<CommentAdmin />} />
              <Route path={routesAdmin.packageSetting} element={<PackageAdmin />} />
              <Route path={routesAdmin.userSetting} element={<UserAdmin />} />
            </Routes>
          </>
          :
          <div>
            <Navbar />
            <Box sx={{ marginTop: 12, flex: 1 }}>
              <Routes>
                <Route path={routes.home} element={<HomePage />} />
                <Route path={routes.building} element={<BuildingPage />} />
                <Route path={routes.rooms + "/:id"} element={<RoomPage />} />
                <Route path={routes.softpower} element={<SoftpowerPage />} />
                <Route path={routes.softpower + "/:id"} element={<SoftpowerDetailPage />} />
                <Route path={routes.package} element={<PackagePage />} />
                <Route path={routes.about} element={<AboutPage />} />
                <Route path={routes.login} element={<LoginPage />} />
                <Route path={routes.register} element={<RegisterPage />} />
                <Route path={routes.forgotPassword} element={<ForgotPasswordPage />} />
                {user && user.role &&
                  <Route path={routes.settings} element={<SettingPage />} />
                }
                <Route path={routes.error} element={<ErrorPage />} />
              </Routes>
            </Box>
            <div style={{ minHeight:100,minWidth:100 }}></div>
            <Footer />
          </div>
        }
      </BrowserRouter>
  )
}

export default App
