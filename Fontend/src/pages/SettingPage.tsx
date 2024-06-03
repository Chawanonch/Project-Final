import { Box, Button, Card, CardActions, Container, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Input, Modal, ModalClose, ModalDialog, Radio, RadioGroup, Select, Sheet, Textarea }
  from "@mui/joy";
import { styled } from '@mui/system';
import { Tabs as BaseTabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { useAppDispatch, useAppSelector } from "../store/store";
import { changeUser, getByUser, logoutUser } from "../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Grid, Pagination, Paper, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { cancelBooking, cancelBookingPackage, getBookingAdmin, getBookingByUser, getBookingPackageAdmin, getBookingPackageByUser, getPaymentBooking, getPaymentBookingPackages, paymentBooking, paymentBookingPackage } from "../store/features/bookingSlice";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Swal from 'sweetalert2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Option from '@mui/joy/Option';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { baseUrlServer, folderImage } from "../components/api/agent";
import { getBuildingAndRoom } from "../store/features/room&BuildingSlice";
import TextsmsIcon from '@mui/icons-material/Textsms';
import { Booking, BookingPackage } from "../components/models/booking";
import CloseIcon from '@mui/icons-material/Close';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import { useDropzone } from "react-dropzone";
import StarIcon from '@mui/icons-material/Star';
import { createAndUpdateComment, createAndUpdateCommentPackage, getComment, getCommentPackage } from "../store/features/commentSlice";
import { motion } from 'framer-motion';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { formatCVC, formatCreditCardNumber, formatExpirationDate } from "../components/utils";
import { convertToBuddhistYear, convertToGregorianYear, formatNumberWithCommas, isValidEmail, windowSizes } from "../components/Reuse";
import { routes } from "../components/Path";
import Lottie from "lottie-react";
import loadingMain from "../components/Animation/LoadingMain.json";
import { getPackage } from "../store/features/packageSlice";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { DefaultizedPieValueType } from '@mui/x-charts/models';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
// import THSarabunNew from '../components/Font/THSarabunNew.ttf';

interface State {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  focus: any;
}
interface DataPieChart {
  id: number;
  value: number;
  label: string;
}
const SettingPage = () => {
  //#region state
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, loading: isLoadingUser } = useAppSelector((state) => state.user);
  const { booking, payments, bookingPackage, paymentPackages, loadingBooking, loadingBookingPackage } = useAppSelector((state) => state.booking);
  const { room, roomType } = useAppSelector((state) => state.room);
  const { comment, commentPackage } = useAppSelector((state) => state.comment);
  const { packageAll } = useAppSelector((state) => state.package);

  //change user
  const [email, setEmail] = useState<string>(token !== "" && user ? user.email : "");
  const [username, setUsername] = useState<string>(token !== "" && user ? user.username : "");
  const [phone, setPhone] = useState<string>(token !== "" && user ? user.phone : "");

  //comment
  const [idComment, setIdComment] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const addEmoji = (emoji: string) => () => setText(`${text}${emoji}`);
  const [value, setValue] = useState<number | null>(2.5);
  const [images, setImages] = useState<Array<string | File>>([]);

  const [selectStatus, setSelectStatus] = useState<number | null>(5);
  const [selectTypeBooking, setSelectTypeBooking] = useState<number | null>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageP, setCurrentPageP] = useState<number>(1);

  const [, setRemainingTime] = useState({ hours: 0, minutes: 0, seconds: 0, id: 0, status: 0 });
  const [, setRemainingTimePackage] = useState({ hours: 0, minutes: 0, seconds: 0, id: 0, status: 0 });

  const [idModel, setIdModel] = useState<number>(0);
  const [openCancel, setOpenCancel] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  const [openComment, setOpenComment] = useState<boolean>(false);

  const [idPackageModel, setIdPackageModel] = useState<number>(0);
  const [openCancelPackage, setOpenCancelPackage] = useState<boolean>(false);
  const [openDetailPackage, setOpenDetailPackage] = useState<boolean>(false);
  const [openPaymentPackage, setOpenPaymentPackage] = useState<boolean>(false);
  const [openCommentPackage, setOpenCommentPackage] = useState<boolean>(false);

  const [statusPaymnet, setStatusPaymnet] = useState<number>(0);
  const [statusPaymnetPackage, setStatusPaymnetPackage] = useState<number>(0);
  const [bookingId, setBookingId] = useState<number>(0);
  const [bookingPackageId, setBookingPackageId] = useState<number>(0);
  const [statusBooking, setStatusBooking] = useState<number>(0);

  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalPaymentPackage, setTotalPaymentPackage] = useState<number>(0);


  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [detailBookingPackage, setDetailBookingPackage] = useState<BookingPackage | null>(null);
  const [typeChart, setTypeChart] = useState('pie');

  const handleTypeChartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeChart(event.target.value);
  };
  const [state, setState] = useState<State>({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });
  const [start, setStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [end, setEnd] = useState<string>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]);
  const [selectDateD, setSelectDateD] = useState<number>(0);
  const [selectDateM, setSelectDateM] = useState<number>(0);
  const [selectDateY, setSelectDateY] = useState<number>(0);

  const handleInputFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "number") {
      event.target.value = formatCreditCardNumber(value);
    } else if (name === "expiry") {
      event.target.value = formatExpirationDate(value);
    } else if (name === "cvc") {
      event.target.value = formatCVC(value);
    }

    setState({ ...state, [name]: event.target.value });
  };

  //#endregion

  function calculateRemainingTime(dateCreated: string, id: number, status: number) {
    const deadline = new Date(dateCreated);
    deadline.setMinutes(deadline.getMinutes() + 1);

    const now = new Date();
    const timeDifference = Number(deadline) - Number(now);
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    if (hours <= 0 && minutes <= 0 && seconds <= 0 && status === 0) {
      cancelBookingUserAuto(id);
    }

    return { hours, minutes, seconds, id, status };
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedRemainingTime = calculateRemainingTime("", 0, 0);
      setRemainingTime(updatedRemainingTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function calculateRemainingTimePackage(dateCreated: string, id: number, status: number) {
    const deadline = new Date(dateCreated);
    deadline.setMinutes(deadline.getMinutes() + 1);

    const now = new Date();
    const timeDifference = Number(deadline) - Number(now);
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    if (hours <= 0 && minutes <= 0 && seconds <= 0 && status === 0) {
      cancelBookingPackageUserAuto(id);
    }

    return { hours, minutes, seconds, id, status };
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedRemainingTimePackage = calculateRemainingTimePackage("", 0, 0);
      setRemainingTimePackage(updatedRemainingTimePackage);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  const handlePagePChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPageP(value);
  };
  //#region  filter
  const itemsPerPage = 3;
  const filterBooking = booking && booking;

  const filterStatus = booking && booking.filter((x) => x.status === selectStatus);
  const paginatedBooking = booking && (selectStatus === 5 ? filterBooking.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : filterStatus.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

  const filterBookingPackage = bookingPackage && bookingPackage;
  const filterStatusPackage = bookingPackage && bookingPackage.filter((x) => x.status === selectStatus);
  const paginatedBookingPackage = bookingPackage && (selectStatus === 5 ? filterBookingPackage.slice((currentPageP - 1) * itemsPerPage, currentPageP * itemsPerPage) : filterStatusPackage.slice((currentPageP - 1) * itemsPerPage, currentPageP * itemsPerPage));
  //#endregion

  //#region Model
  const openModelPayment = (statusPaymnet: number, item:any) => {
    setOpenPayment(true)
    setIdModel(item.id)
    setStatusPaymnet(statusPaymnet)
    setBookingId(item.id)
    setDetailBooking(item)
    const value = item.totalPrice
    const price = statusPaymnet === 1 ? value * 35 / 100 : statusPaymnet === 2 ? value * 65 / 100 : value;
    setTotalPayment(price)
  };
  const closeModelPayment = () => {
    setOpenPayment(false)
    setIdModel(0)
    setStatusPaymnet(0)
    setBookingId(0)
    setDetailBooking(null)
    setTotalPayment(0)
  };
  const openModelCancel = (id: number, statusId: number) => {
    setOpenCancel(true)
    setIdModel(id)
    setStatusBooking(statusId);
  };
  const closeModelCancel = () => {
    setOpenCancel(false)
    setIdModel(0)
    setStatusBooking(0);
  };
  const openModelDetail = (id: number) => {
    setOpenDetail(true);
    setIdModel(id);
    const item = booking.find((x) => x.id === id);
    const roomIds = item?.listRooms.map((d) => d.roomId) || [];
    const items = room.filter((x) => roomIds.includes(x.id));
    if (items.length > 0 && item !== undefined) {
      setDetailBooking(item)
      setBookingId(item.id);
    } else {
      setBookingId(0);
    }
  };
  const closeModelDetail = () => {
    setOpenDetail(false)
    setIdModel(0)
    setDetailBooking(null)
  };

  const openModelPDetail = (id: number) => {
    setOpenDetailPackage(true);
    setIdPackageModel(id);
    const item = bookingPackage.find((x) => x.id === id);
    if (item !== undefined) {
      setDetailBookingPackage(item)
      setBookingPackageId(item.id);
    } else {
      setBookingPackageId(0);
    }
  };
  const closeModelPDetail = () => {
    setOpenDetailPackage(false)
    setIdPackageModel(0)
    setDetailBookingPackage(null)
  };
  const openModelComment = (id: number) => {
    setOpenComment(true)
    setIdModel(id)

    const itemBooking = booking.find((x) => x.id === id)
    if (itemBooking !== undefined) {
      setDetailBooking(itemBooking);
      setBookingId(itemBooking.id)
      const itemComment = comment.find((x) => x.bookingId === itemBooking.id)

      if (itemComment !== undefined) {
        setIdComment(itemComment.id)
        setText(itemComment.text)
        setValue(itemComment.star)
        setImages(itemComment.commentImages.map((item) => item.image))
      } else {
        setIdComment(0)
        setText("")
        setValue(2.5)
        setImages([])
      }

    } else {
      setDetailBooking(null);
      setBookingId(0)
    }
  };
  const closeModelComment = () => {
    setOpenComment(false)
    setIdModel(0)
    setIdComment(0)
    setText("")
    setValue(2.5)
    setImages([])
  };
  const openModelPaymentPackage = (statusPaymnetPackage: number, item:any) => {
    setOpenPaymentPackage(true)
    setIdPackageModel(item.id)
    setStatusPaymnetPackage(statusPaymnetPackage)
    setBookingPackageId(item.id)
    setDetailBookingPackage(item)
    const value = item.totalPriceBookingPackage
    const price = statusPaymnetPackage === 1 ? value * 35 / 100 : statusPaymnetPackage === 2 ? value * 65 / 100 : value;
    setTotalPaymentPackage(price)
  };
  const closeModelPaymentPackage = () => {
    setOpenPaymentPackage(false)
    setIdPackageModel(0)
    setStatusPaymnetPackage(0)
    setBookingPackageId(0)
    setDetailBookingPackage(null)
    setTotalPaymentPackage(0)
  };
  const openModelCancelPackage = (id: number, statusId: number) => {
    setOpenCancelPackage(true)
    setIdPackageModel(id)
    setStatusBooking(statusId)
  };
  const closeModelCancelPackage = () => {
    setOpenCancelPackage(false)
    setIdPackageModel(0)
    setStatusBooking(0)
  };

  const openModelCommentPackage = (id: number) => {
    setOpenCommentPackage(true)
    setIdPackageModel(id)

    const itemBooking = bookingPackage.find((x) => x.id === id)
    if (itemBooking !== undefined) {
      setDetailBookingPackage(itemBooking);
      setBookingPackageId(itemBooking.id)
      const itemComment = commentPackage && commentPackage.find((x) => x.bookingPackageId === itemBooking.id)

      if (itemComment !== undefined) {
        setIdComment(itemComment.id)
        setText(itemComment.text)
        setValue(itemComment.star)
        setImages(itemComment.commentPackageImages.map((item) => item.image))
      } else {
        setIdComment(0)
        setText("")
        setValue(2.5)
        setImages([])
      }

    } else {
      setDetailBookingPackage(null);
      setBookingPackageId(0)
    }
  };

  const closeModelCommentPackage = () => {
    setOpenCommentPackage(false)
    setIdPackageModel(0)
    setIdComment(0)
    setText("")
    setValue(2.5)
    setImages([])
  };
  //#endregion

  //#region  more
  const handleDepositAndAll = async () => {
    const payment = payments.find((x) => x.bookingId === bookingId);

    let paymentId: number;
    if (payment !== undefined && statusPaymnet !== 1) paymentId = Number(payment.id);
    else paymentId = 0;

    const item = await dispatch(paymentBooking({ id: paymentId, status: statusPaymnet, bookingId }));
    if (item.payload !== "" && item.payload !== undefined && item.payload !== null) {
      const successMessage = statusPaymnet === 0 ? 'มัดจำเสร็จสิ้น !' : 'ชำระเงินเสร็จสิ้น !';
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: successMessage,
        showConfirmButton: false,
        timer: 1000,
      });
      fetchData();
    }
    closeModelPayment()
  };

  const cancelBookingUserAuto = async (id: number) => {
    const item = await dispatch(cancelBooking(id))
    if (item.payload !== "" && item.payload !== undefined) {
      await dispatch(getBookingByUser());
      await dispatch(getPaymentBooking());
      Swal.fire({
        position: "center",
        icon: 'success',
        title: 'ยกเลิกการจองเสร็จสิ้น',
        showConfirmButton: false,
        timer: 1000
      });
      closeModelPayment()
    }
    else {
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'กรุณาลองยกเลิกการจองอีกครั้ง !',
        showConfirmButton: false,
        timer: 1000
      });
    }
    setOpenCancel(false)
  };

  const cancelBookingUser = async () => {
    const item = await dispatch(cancelBooking(idModel))
    if (item.payload !== "" && item.payload !== undefined) {
      fetchData()
      Swal.fire({
        position: "center",
        icon: 'success',
        title: 'ยกเลิกการจองเสร็จสิ้น',
        showConfirmButton: false,
        timer: 1000
      });
    }
    else {
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'ยกเลิกเกิดข้อผิดพลาด !',
        showConfirmButton: false,
        timer: 1000
      });
    }
    setOpenCancel(false)
    setIdModel(0)
  };

  const handleDepositAndAllPackage = async () => {
    const payment = paymentPackages.find((x) => x.bookingPackageId === bookingPackageId);
    let paymentId: number;
    if (payment !== undefined && statusPaymnetPackage !== 1) paymentId = Number(payment.id);
    else paymentId = 0;

    const item = await dispatch(paymentBookingPackage({ id: paymentId, status: statusPaymnetPackage, bookingPackageId }));
    if (item.payload !== "" && item.payload !== undefined && item.payload !== null) {
      const successMessage = statusPaymnetPackage === 0 ? 'มัดจำเสร็จสิ้น !' : 'ชำระเงินเสร็จสิ้น !';
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: successMessage,
        showConfirmButton: false,
        timer: 1000,
      });
      fetchData();
    }
    closeModelPaymentPackage()
  };
  const cancelBookingPackageUserAuto = async (id: number) => {
    const item = await dispatch(cancelBookingPackage(id))
    if (item.payload !== "" && item.payload !== undefined) {
      await dispatch(getBookingPackageByUser());
      await dispatch(getPaymentBookingPackages());
      Swal.fire({
        position: "center",
        icon: 'success',
        title: 'ยกเลิกการจองเสร็จสิ้น',
        showConfirmButton: false,
        timer: 1000
      });
      closeModelPaymentPackage()
    }
    else {
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'กรุณาลองยกเลิกการจองอีกครั้ง !',
        showConfirmButton: false,
        timer: 1000
      });
    }
    setOpenCancelPackage(false)
  };

  const cancelBookingPackageUser = async () => {
    const item = await dispatch(cancelBookingPackage(idPackageModel))
    fetchData()
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: 'success',
        title: 'ยกเลิกการจองเสร็จสิ้น',
        showConfirmButton: false,
        timer: 1000
      });
    }
    else {
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'กรุณาลองยกเลิกการจองอีกครั้ง !',
        showConfirmButton: false,
        timer: 1000
      });
    }
    setOpenCancelPackage(false)
    setIdPackageModel(0)
  };
  const handleLogout = async () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "ออกจากระบบเสร็จสิ้น !",
      showConfirmButton: false,
      timer: 1000
    });
    setTimeout(async () => {
      await dispatch(logoutUser());
      navigate(routes.login);
    }, 900);
  };

  const handleChangeUser = async () => {
    if (!isValidEmail(email)) {
      Swal.fire({
        position: "center",
        icon: 'info',
        title: 'กรุณาป้อนรูปแบบอีเมลให้ถูกต้อง !',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    }
    const item = await dispatch(changeUser({ email, username, phone }));
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: 'success',
        title: 'ทำการเปลี่ยนแปลงเสร็จสิ้น !',
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(async () => {
        await dispatch(logoutUser());
        fetchData()
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
  };

  const fetchData = async () => {
    await dispatch(getBuildingAndRoom());
    await dispatch(getPackage());
    await dispatch(getByUser());
    await dispatch(getBookingByUser());
    await dispatch(getBookingAdmin());
    await dispatch(getPaymentBooking());
    await dispatch(getComment());
    await dispatch(getBookingPackageByUser());
    await dispatch(getBookingPackageAdmin());
    await dispatch(getPaymentBookingPackages());
    await dispatch(getCommentPackage());
  };

  useEffect(() => {
    if (token !== "" && user) {
      setEmail(user.email);
      setUsername(user.username);
      setPhone(user.phone);
    }
  }, [token, user]);

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return 'รอดำเนินการ';
      case 1:
        return 'มัดจำเสร็จสิ้น';
      case 2:
        return 'เสร็จสิ้น';
      case 3:
        return 'ยกเลิกการจอง';
      default:
        return '';
    }
  };

  const handleChange = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectStatus(newValue)
  };

  const handleChangeTypeBooking = (
    _event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectTypeBooking(newValue)
  };

  const getRootProps = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setImages(acceptedFiles);
      }
    },
    multiple: true,
  });

  //#endregion
  const handleCommentByUser = async () => {
    const item = await dispatch(createAndUpdateComment({ id: idComment, text, star: value, bookingId, images }));
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: 'success',
        title: idComment === 0 ? 'แสดงความคิดเห็นเสร็จสิ้น !' : "แก้ไข แสดงความคิดเห็นเสร็จสิ้น !",
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(() => {
        closeModelComment()
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchData()
      }, 1400);
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

  const handleCommentPackageByUser = async () => {
    const item = await dispatch(createAndUpdateCommentPackage({ id: idComment, text, star: value, bookingPackageId, images }));
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: 'success',
        title: idComment === 0 ? 'แสดงความคิดเห็นเสร็จสิ้น !' : "แก้ไข แสดงความคิดเห็นเสร็จสิ้น !",
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(() => {
        closeModelCommentPackage()
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchData()
      }, 1400);
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

  let dateS;
  let dateE;

  if (detailBooking) {
    dateS = new Date(detailBooking.start);
    dateS.setFullYear(dateS.getFullYear() - 543);
    dateE = new Date(detailBooking.end);
    dateE.setFullYear(dateE.getFullYear() - 543);
  }

  const allModalBooking = () => {
    return (
      <>
        <Modal open={openCancel} onClose={closeModelCancel}>
          <ModalDialog variant="outlined" role="alertdialog">
            <DialogTitle>
              <WarningRoundedIcon />
              <h4>
                การยืนยัน
              </h4>
            </DialogTitle>
            <Divider />
            <DialogContent>
              {statusBooking === 2 && <p style={{ color: "#C83B55" }}>
                (ถ้ายกเลิกจะได้เงินคืน 65 % ของราคาเต็ม)
              </p>}
              <p>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจอง</p>
            </DialogContent>
            <DialogActions>
              <Button variant="solid" color="danger" onClick={cancelBookingUser}>
                ยืนยัน
              </Button>
              <Button variant="plain" color="neutral" onClick={closeModelCancel}>
                ยกเลิก
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>
        <Modal open={openDetail} onClose={closeModelDetail}
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              p: 3,
              boxShadow: 'lg',
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <h2>ข้อมูลการจองห้องพัก</h2>
            <TableContainer style={{ maxHeight: '200px' }} component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><h3>ประเภทห้องพัก</h3></TableCell>
                    <TableCell align="center"><h3>รูปภาพ</h3></TableCell>
                    <TableCell align="center"><h3>จำนวนห้องพัก</h3></TableCell>
                    <TableCell align="center"><h3>ราคาต่อห้อง</h3></TableCell>
                  </TableRow>
                </TableHead>
                {detailBooking?.listRooms && detailBooking?.listRooms.map((value, index: number) => {
                  const idRoom = room && room.find((room) => room.id === value.roomId)
                  return (
                    <TableBody key={index}>
                      <TableRow>
                        <TableCell align="center">
                          <p>
                            {roomType.find((room) => room.id === value.roomId)?.name || 'ไม่พบข้อมูล'}
                          </p>
                        </TableCell>
                        <TableCell align="center">
                          {idRoom && idRoom.roomImages.map((value: { image: string; }, index: number) => (
                            <img
                              key={index}
                              src={folderImage + value.image}
                              alt={`Image ${index}`}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }}
                            />
                          ))}
                        </TableCell>
                        <TableCell align="center">
                          <p>{value.quantityRoom}</p>
                        </TableCell>
                        <TableCell align="center">
                          <p>
                            {idRoom?.price || 'ไม่พบข้อมูล'}
                          </p>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )
                })}
              </Table>
            </TableContainer>
          </Sheet>
        </Modal>
        <Modal open={openPayment} onClose={closeModelPayment}>
          <ModalDialog
            aria-labelledby="payment-modal-title"
            aria-describedby="payment-modal-description"

          >
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <Cards
                  number={state.number}
                  expiry={state.expiry}
                  cvc={state.cvc}
                  name={state.name}
                  focused={state.focus}
                />
              </Grid>
              <Grid item xs={12}>
                <form
                  onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    handleDepositAndAll()
                  }}
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={windowSize < 1183 ? 12 : 6}>
                      <FormControl>
                        <h4>หมายเลขบัตร</h4>
                        <Input required name="number" placeholder="หมายเลขบัตร..." endDecorator={<CreditCardIcon />} value={state.number}
                          onChange={handleInputChange} onFocus={handleInputFocus} />
                      </FormControl>
                      <div style={{ marginTop: 5 }} />
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 6}>
                      <FormControl>
                        <h4>ชื่อบนบัตร</h4>
                        <Input required name="name" placeholder="กรอกชื่อเต็มบนบัตร..." value={state.name}
                          onChange={handleInputChange} onFocus={handleInputFocus} />
                      </FormControl>
                      <div style={{ marginTop: 5 }} />
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 6}>
                      <FormControl>
                        <h4>วันหมดอายุ</h4>
                        <Input required name="expiry" placeholder="วันที่หมดอายุ..." endDecorator={<CreditCardIcon />} value={state.expiry}
                          onChange={handleInputChange} onFocus={handleInputFocus} />
                      </FormControl>
                      <div style={{ marginTop: 5 }} />
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 6}>
                      <FormControl>
                        <h4>รหัสความปลอดภัย</h4>
                        <Input required name="cvc" placeholder="รหัสความปลอดภัย..." endDecorator={<InfoOutlined />} value={state.cvc}
                          onChange={handleInputChange} onFocus={handleInputFocus} />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <CardActions sx={{ gridColumn: '1/-1' }}>
                        <Button variant="solid" color="primary" type="submit" fullWidth>
                          <h4>
                            ชำระเงิน ({totalPayment} บาท)
                          </h4>
                        </Button>
                      </CardActions>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </ModalDialog>
        </Modal>
      </>
    )
  }

  const allModalBookingPackage = () => {
    return (
      <>
        <Modal open={openCancelPackage} onClose={closeModelCancelPackage}>
          <ModalDialog variant="outlined" role="alertdialog">
            <DialogTitle>
              <WarningRoundedIcon />
              <h4>
                การยืนยัน
              </h4>
            </DialogTitle>
            <Divider />
            <DialogContent>
              {statusBooking === 2 && <p style={{ color: "#C83B55" }}>
                (ถ้ายกเลิกจะได้เงินคืน 65 % ของราคาเต็ม)
              </p>}
              <p>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจอง</p>
            </DialogContent>
            <DialogActions>
              <Button variant="solid" color="danger" onClick={cancelBookingPackageUser}>
                ยืนยัน
              </Button>
              <Button variant="plain" color="neutral" onClick={closeModelCancelPackage}>
                ยกเลิก
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>
        <Modal open={openDetailPackage} onClose={closeModelPDetail}
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"

          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              p: 3,
              boxShadow: 'lg',
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <h2>ข้อมูลการจองแพ็กเกจ</h2>
            <TableContainer style={{ maxHeight: '200px' }} component={Paper}>
              <Table sx={{ minWidth: 200 }} aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><h3>ชื่อแพ็กเกจ</h3></TableCell>
                    <TableCell align="center"><h3>เช็คอินได้ตั้งแต่</h3></TableCell>
                    <TableCell align="center"><h3>จำนวนแพ็กเกจ</h3></TableCell>
                    <TableCell align="center"><h3>ราคาต่อแพ็กเกจ</h3></TableCell>
                  </TableRow>
                </TableHead>
                {detailBookingPackage?.listPackages && detailBookingPackage?.listPackages.map((value, index: number) => {
                  let itemDS;
                  let itemDE;
                  let itemDC;
                  console.log(value)
                  if (value.start && value.end && value.checkInTime) {
                    itemDS = new Date(value.start);
                    itemDS.setFullYear(itemDS.getFullYear() - 543);
                    itemDE = new Date(value.end);
                    itemDE.setFullYear(itemDE.getFullYear() - 543);
                    itemDC = new Date(value.checkInTime);
                    itemDC.setFullYear(itemDC.getFullYear() - 543);
                  }
                  return (
                    <TableBody key={index}>
                      <TableRow>
                        <TableCell align="center">
                          <p>
                            {packageAll.find((pck) => pck.id === value.packageId)?.name || 'ไม่พบข้อมูล'}
                          </p>
                        </TableCell>
                        <TableCell align="center">
                          <p>
                            {itemDS?.toLocaleString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })} ถึงวันที่ {itemDE?.toLocaleString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </TableCell>
                        <TableCell align="center">
                          <p>
                            {value.quantity}
                          </p>
                        </TableCell>
                        <TableCell align="center">
                          <p>
                            {packageAll.find((pck) => pck.id === value.packageId)?.totalPrice || 'ไม่พบข้อมูล'}
                          </p>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )
                })}
              </Table>
            </TableContainer>
          </Sheet>
        </Modal>
        <Modal open={openPaymentPackage} onClose={closeModelPaymentPackage}>
          <ModalDialog
            aria-labelledby="payment-modal-title"
            aria-describedby="payment-modal-description"

          >
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <Cards
                  number={state.number}
                  expiry={state.expiry}
                  cvc={state.cvc}
                  name={state.name}
                  focused={state.focus}
                />
              </Grid>
              <Grid item xs={12}>
                <form
                  onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    handleDepositAndAllPackage()
                  }}
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={windowSize < 1183 ? 12 : 6}>
                      <FormControl sx={{ gridColumn: '1/-1' }}>
                        <h4>หมายเลขบัตร</h4>
                        <Input required name="number" placeholder="หมายเลขบัตร..." endDecorator={<CreditCardIcon />} value={state.number}
                          onChange={handleInputChange} onFocus={handleInputFocus} />
                      </FormControl>
                      <div style={{ marginTop: 5 }} />
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 6}>
                      <FormControl sx={{ gridColumn: '1/-1' }}>
                        <h4>ชื่อบนบัตร</h4>
                        <Input required name="name" placeholder="กรอกชื่อเต็มบนบัตร..." value={state.name}
                          onChange={handleInputChange} onFocus={handleInputFocus} />
                      </FormControl>
                      <div style={{ marginTop: 5 }} />
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 6}>
                      <FormControl>
                        <h4>วันหมดอายุ</h4>
                        <Input required name="expiry" placeholder="วันที่หมดอายุ..." endDecorator={<CreditCardIcon />} value={state.expiry}
                          onChange={handleInputChange} onFocus={handleInputFocus} />
                      </FormControl>
                      <div style={{ marginTop: 5 }} />
                    </Grid>
                    <Grid item xs={windowSize < 1183 ? 12 : 6}>
                      <FormControl>
                        <h4>รหัสความปลอดภัย</h4>
                        <Input required name="cvc" placeholder="รหัสความปลอดภัย..." endDecorator={<InfoOutlined />} value={state.cvc}
                          onChange={handleInputChange} onFocus={handleInputFocus} />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <CardActions sx={{ gridColumn: '1/-1' }}>
                        <Button variant="solid" color="primary" type="submit" fullWidth>
                          <h4>
                            ชำระเงิน ({totalPaymentPackage} บาท)
                          </h4>
                        </Button>
                      </CardActions>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </ModalDialog>
        </Modal>
      </>
    )
  }

  const windowSize = windowSizes();
  const [dataAllPrice, setDataAllPrice] = useState<DataPieChart[]>([]);
  const [barDataAllPrice, setBarDataAllPrice] = useState<number[]>([]);
  const [lineDataAllPrice, setLineDataAllPrice] = useState<number[]>([]);
  const [labelsAllPrice, setLabelsAllPrice] = useState<string[]>([]);
  const [dataAllBooking, setDataAllBooking] = useState<DataPieChart[]>([]);
  const [barDataAllBooking, setBarDataAllBooking] = useState<number[]>([]);
  const [lineDataAllBooking, setLineDataAllBooking] = useState<number[]>([]);
  const [labelsAllBooking, setLabelsAllBooking] = useState<string[]>([]);
  const [dataAllBookingPayment, setDataAllBookingPayment] = useState<DataPieChart[]>([]);
  const [barDataAllBookingPayment, setBarDataAllBookingPayment] = useState<number[]>([]);
  const [lineDataAllBookingPayment, setLineDataAllBookingPayment] = useState<number[]>([]);
  const [labelsAllBookingPayment, setLabelsAllBookingPayment] = useState<string[]>([]);

  useEffect(() => {
    const filteredBooking = booking && start && end && booking.filter(booking => {
      const bookingStartDate = new Date(booking.start);
      const bookingEndDate = new Date(booking.end);

      const startDate = new Date(start);
      const endDate = new Date(end);
      startDate.setFullYear(startDate.getFullYear() + 543);
      endDate.setFullYear(endDate.getFullYear() + 543);

      const diffTime = Math.abs(Number(endDate) - Number(startDate));
      
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // หาจำนวนปี
      const years = Math.floor(diffDays / 365);
      // หาเหลือเศษวันที่หลังจากหารด้วย 365
      const remainingDaysAfterYears = diffDays % 365;
      // หาจำนวนเดือนจากเหลือเศษวัน
      const months = Math.floor(remainingDaysAfterYears / 30);
      // หาเหลือเศษวันที่หลังจากหารด้วย 30
      const days = remainingDaysAfterYears % 30;

      setSelectDateY(years);
      setSelectDateM(months);
      setSelectDateD(days);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      return bookingStartDate >= startDate && bookingEndDate <= endDate;
    });
    const filteredBookingPackage = bookingPackage && start && end && bookingPackage.filter(bookingPackage => {
      return bookingPackage.listPackages.some(packageItem => {
        const bookingStartDate = new Date(packageItem.start);
        const bookingEndDate = new Date(packageItem.end);
    
        const startDate = new Date(start);
        const endDate = new Date(end);
        startDate.setFullYear(startDate.getFullYear() + 543);
        endDate.setFullYear(endDate.getFullYear() + 543);
    
        const diffTime = Math.abs(Number(endDate) - Number(startDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
        const years = Math.floor(diffDays / 365);
        const remainingDaysAfterYears = diffDays % 365;
        const months = Math.floor(remainingDaysAfterYears / 30);
        const days = remainingDaysAfterYears % 30;
    
        setSelectDateY(years);
        setSelectDateM(months);
        setSelectDateD(days);
    
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return bookingStartDate >= startDate && bookingEndDate <= endDate;
      });
    });
    const conutBooking = filteredBooking ? filteredBooking.filter(booking => booking.status === 1 || booking.status === 2).length : booking.filter(booking => booking.status === 1 || booking.status === 2).length;
    
    const countBookingPayment = filteredBooking ? filteredBooking.filter(booking => booking.status === 2).length : booking.filter(booking => booking.status === 2).length;

    const countTotalPrices = filteredBooking ? filteredBooking.filter(booking => booking.status === 1 || booking.status === 2).reduce((total, booking) => total + booking.totalPrice, 0) : booking.filter(booking => booking.status === 1 || booking.status === 2).reduce((total, booking) => total + booking.totalPrice, 0);
    const conutBookingPackage = filteredBookingPackage ? filteredBookingPackage.filter(booking => booking.status === 1 || booking.status === 2).length : bookingPackage.filter(booking => booking.status === 1 || booking.status === 2).length;

    const countBookingPaymentPackage = filteredBookingPackage ? filteredBookingPackage.filter(booking => booking.status === 2).length : bookingPackage.filter(booking => booking.status === 2).length;

    const countTotalPricesPackage = filteredBookingPackage ? filteredBookingPackage.filter(booking => booking.status === 1 || booking.status === 2)
      .reduce((total, booking) => total + booking.totalPriceBookingPackage, 0) : bookingPackage.filter(booking => booking.status === 1 || booking.status === 2).reduce((total, booking) => total + booking.totalPriceBookingPackage, 0);

    const dataTypeTotalPrice = [
      {
        id: 0,
        value: countTotalPrices,
        label: "ห้องพัก"
      },
      {
        id: 1,
        value: countTotalPricesPackage,
        label: "แพ็กเกจ"
      }
    ];
    setDataAllPrice(dataTypeTotalPrice)
    const barDataValues = dataTypeTotalPrice.map(item => item.value);
    const lineDataValues = dataTypeTotalPrice.map(item => item.value);
    const chartLabels = dataTypeTotalPrice.map(item => item.label);

    setBarDataAllPrice(barDataValues);
    setLineDataAllPrice(lineDataValues);
    setLabelsAllPrice(chartLabels);

    const dataTypeBooking = [
      {
        id: 0,
        value: conutBooking,
        label: "ห้องพัก"
      },
      {
        id: 1,
        value: conutBookingPackage,
        label: "แพ็กเกจ"
      }
    ];
    setDataAllBooking(dataTypeBooking)
    const barDataValuesB = dataTypeBooking.map(item => item.value);
    const lineDataValuesB = dataTypeBooking.map(item => item.value);
    const chartLabelsB = dataTypeBooking.map(item => item.label);

    setBarDataAllBooking(barDataValuesB);
    setLineDataAllBooking(lineDataValuesB);
    setLabelsAllBooking(chartLabelsB);
    
    const dataTypeBookingPayment = [
      {
        id: 0,
        value: countBookingPayment,
        label: "ห้องพัก"
      },
      {
        id: 1,
        value: countBookingPaymentPackage,
        label: "แพ็กเกจ"
      }
    ];
    setDataAllBookingPayment(dataTypeBookingPayment)
    const barDataValuesBP = dataTypeBookingPayment.map(item => item.value);
    const lineDataValuesBP = dataTypeBookingPayment.map(item => item.value);
    const chartLabelsBP = dataTypeBookingPayment.map(item => item.label);

    setBarDataAllBookingPayment(barDataValuesBP);
    setLineDataAllBookingPayment(lineDataValuesBP);
    setLabelsAllBookingPayment(chartLabelsBP);

  }, [start, end, booking, typeChart]);

  const TOTALPRICE = dataAllPrice.map((item) => item.value).reduce((a, b) => a + b, 0);
  const TOTALB = dataAllBooking.map((item) => item.value).reduce((a, b) => a + b, 0);
  const TOTALBm = dataAllBookingPayment.map((item) => item.value).reduce((a, b) => a + b, 0);
  const getArcLabelP = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTALPRICE;
    return `${(percent * 100).toFixed(0)}%`;
  };
  const getArcLabelB = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTALB;
    return `${(percent * 100).toFixed(0)}%`;
  };
  const getArcLabelBm = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTALBm;
    return `${(percent * 100).toFixed(0)}%`;
  };
  
  const THSarabunNew = baseUrlServer + "THSarabunNew.ttf";

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.addFileToVFS('THSarabunNew.ttf', THSarabunNew); // แทน THSarabunNew.ttf ด้วยชื่อของฟอนต์ไทยที่คุณใช้
    doc.addFont(THSarabunNew, 'THSarabunNew', 'normal');
    doc.setFont('THSarabunNew');

    const totalAmount = dataAllPrice.reduce((acc, val) => acc + val.value, 0);
    const totalBooking = dataAllBooking.reduce((acc, val) => acc + val.value, 0);
    const totalPayment = dataAllBookingPayment.reduce((acc, val) => acc + val.value, 0);
    doc.setFontSize(18);
    doc.text(`รายงาน ของผู้ใช้ชื่อ ${user?.username}`, 10, 10);
    doc.text(`วันที่ระหว่าง: ${convertToBuddhistYear(start)} ถึง ${convertToBuddhistYear(end)}`, 10, 20);
    doc.text('สรุป', 10, 30);
    doc.text(`   ยอดค่าใช้จ่าย: ${formatNumberWithCommas(totalAmount)}`, 10, 40);
    doc.text(`   จำนวนการจองทั้งหมด: ${formatNumberWithCommas(totalBooking)}`, 10, 50);
    doc.text(`   จำนวนจองที่ชำระเงินทั้งหมด: ${formatNumberWithCommas(totalPayment)}`, 10, 60);

    // Prepare data for autoTable
    const tableData = [];

    // Add dataAllPrice
    tableData.push(['ยอดค่าใช้จ่ายตามประเภท']);
    dataAllPrice.forEach(item => {
        tableData.push([item.id === 0 ? "   ห้องพัก":"   แพ็กเกจ", formatNumberWithCommas(item.value)]);
    });

    // Add dataAllBooking
    tableData.push(['จำนวนการจองตามประเภท']);
    dataAllBooking.forEach(item => {
        tableData.push([item.id === 0 ? "   ห้องพัก":"   แพ็กเกจ", formatNumberWithCommas(item.value)]);
    });

    // Add dataAllBookingPayment
    tableData.push(['จำนวนจองที่ชำระเงินตามประเภท']);
    dataAllBookingPayment.forEach(item => {
        tableData.push([item.id === 0 ? "   ห้องพัก":"   แพ็กเกจ", formatNumberWithCommas(item.value)]);
    });

    // Create the table in the PDF
    autoTable(doc, {
      startY: 70,
      head: [['ประเภท', 'จำนวน']],
      body: tableData,
      styles: { font: 'THSarabunNew' ,fontSize: 16}
    });

    doc.save('รายงาน.pdf');
  };

  const exportExcel = () => {
    const totalAmount = dataAllPrice.reduce((acc, val) => acc + val.value, 0);
    const totalBooking = dataAllBooking.reduce((acc, val) => acc + val.value, 0);
    const totalPayment = dataAllBookingPayment.reduce((acc, val) => acc + val.value, 0);

    const wsData = [
        [`รายงาน ของผู้ใช้ชื่อ ${user?.username}`],
        [`วันที่ระหว่าง: ${convertToBuddhistYear(start)} ถึง ${convertToBuddhistYear(end)}`],
        [],
        ['สรุป'],
        ['   ยอดค่าใช้จ่าย', formatNumberWithCommas(totalAmount)],
        ['   จำนวนการจองทั้งหมด', formatNumberWithCommas(totalBooking)],
        ['   จำนวนจองที่ชำระเงินทั้งหมด', formatNumberWithCommas(totalPayment)],
        [],
        ['ประเภท', 'จำนวน'],
    ];

    // Add dataAllPrice
    wsData.push(['ยอดค่าใช้จ่ายตามประเภท']);
    dataAllPrice.forEach(item => {
        wsData.push([item.id === 0 ? "   ห้องพัก":"   แพ็กเกจ", formatNumberWithCommas(item.value)]);
    });

    // Add dataAllBooking
    wsData.push(['จำนวนการจองตามประเภท']);
    dataAllBooking.forEach(item => {
        wsData.push([item.id === 0 ? "   ห้องพัก":"   แพ็กเกจ", formatNumberWithCommas(item.value)]);
    });

    // Add dataAllBookingPayment
    wsData.push(['จำนวนจองที่ชำระเงินตามประเภท']);
    dataAllBookingPayment.forEach(item => {
        wsData.push([item.id === 0 ? "   ห้องพัก":"   แพ็กเกจ", formatNumberWithCommas(item.value)]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'รายงาน');
    XLSX.writeFile(wb, 'รายงาน.xlsx');
  };

  return (
    <Container>
      <Tabs defaultValue={0} orientation="vertical" sx={{ display: windowSize < 1183 ? "" : "flex" }}>
        <TabsList sx={{ minWidth: windowSize < 1183 ? 200 : 180, maxHeight: 200, flexDirection: "column", justifyContent: "center", position: windowSize < 1183 ? "" : "sticky", top: 90 }}>
          <Tab><h4>ประวัติการจองทั้งหมด</h4></Tab>
          <Tab><h4>ประวัติการใช้จ่าย</h4></Tab>
          <Tab><h4>ตั้งค่าบัญชี</h4></Tab>
          <Button onClick={handleLogout} style={{ backgroundColor: "#C83B55", marginTop: 1, width: "auto" }}>
            <h4>ออกจากระบบ</h4>
          </Button>
        </TabsList>
        <TabPanel value={0}>
          {!openCommentPackage && !openComment &&
            <Grid container spacing={2} alignItems="center" sx={{ maxHeight: "auto", minWidth: 200 }}>
              <Grid item xs={12} style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Grid item xs={windowSize < 1183 ? 3 : 2}>
                  <FormControl>
                    <h4>
                      ประเภทการจอง
                    </h4>
                    <Select value={selectTypeBooking} onChange={handleChangeTypeBooking}>
                      <Option value={0}>
                        ห้องพัก
                      </Option>
                      <Option value={1}>
                        แพ็กเกจ
                      </Option>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={windowSize < 1183 ? 3 : 2}>
                  <FormControl>
                    <h4>
                      สถานะการจอง
                    </h4>
                    <Select value={selectStatus} onChange={handleChange}>
                      <Option value={5}>
                        ทั้งหมด
                      </Option>
                      <Option value={0}>
                        รอดำเนินการ
                      </Option>
                      <Option value={1}>
                        ชำระเงินมัดจำ
                      </Option>
                      <Option value={2}>
                        ชำระเงินทั้งหมด
                      </Option>
                      <Option value={3}>
                        ยกเลิกการจอง
                      </Option>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {selectTypeBooking === 0 ?
                paginatedBooking.length > 0 &&
                <Grid item xs={windowSize < 1183 ? 12 : 8.5} style={{ display: "flex", flexDirection: "row", gap: 0, minWidth: 200 }}>
                  <Grid item xs={3}>
                    <h4 style={{ flex: 1, textAlign: "center" }}>วันที่เข้า</h4>
                  </Grid>
                  <Grid item xs={3}>
                    <h4 style={{ flex: 1, textAlign: "center" }}>วันที่ออก</h4>
                  </Grid>
                  <Grid item xs={3}>
                    <h4 style={{ flex: 1, textAlign: "center" }}>สถานะการจอง</h4>
                  </Grid>
                  <Grid item xs={3}>
                    <h4 style={{ flex: 1, textAlign: "center" }}>ราคารวม</h4>
                  </Grid>
                </Grid>
                :
                paginatedBookingPackage.length > 0 &&
                <Grid item xs={windowSize < 1183 ? 12 : 8.5} style={{ display: "flex", flexDirection: "row", gap: 0, minWidth: 200 }}>
                  <Grid item xs={6}>
                    <h4 style={{ flex: 1, textAlign: "center" }}>สถานะการจอง</h4>
                  </Grid>
                  <Grid item xs={6}>
                    <h4 style={{ flex: 1, textAlign: "center" }}>ราคารวม</h4>
                  </Grid>
                </Grid>
              }
              <Box sx={{ minWidth: windowSize < 1183 ? 0 : 900 }}></Box>
            </Grid>
          }

          {selectTypeBooking === 0 &&
            <>
              {openComment && detailBooking &&
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Card sx={{ minWidth: 200 }}>
                    <div>
                      <h2 style={{ marginTop: 0 }}>{idComment === 0 ? "แสดงความคิดเห็น" : "แก้ไข แสดงความคิดเห็น"}</h2>
                      <IconButton onClick={closeModelComment} aria-label="bookmark Bahamas Islands"
                        variant="plain"
                        color="neutral"
                        size="sm"
                        sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}>
                        <CloseIcon />
                      </IconButton>

                      <div style={{ marginTop: 20 }}>
                        <h3>คะแนน</h3>
                        <div>
                          <Rating
                            name="hover-feedback"
                            value={value}
                            precision={0.5}
                            onChange={(_event, newValue) => {
                              setValue(newValue);
                            }}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                          <h4>{value ? value + " คะแนน" : ""} </h4>
                        </div>
                      </div>

                      <FormControl style={{ marginTop: 20 }}>
                        <h3>ข้อความ</h3>
                        <Textarea
                          placeholder="พิมพ์ข้อความที่ต้องการ ..."
                          value={text}
                          onChange={(event) => setText(event.target.value)}
                          minRows={2}
                          maxRows={4}
                          startDecorator={
                            <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                              <IconButton variant="outlined" color="neutral" onClick={addEmoji('👍')}>
                                👍
                              </IconButton>
                            </Box>
                          }
                          endDecorator={
                            <h4>
                              {text.length} อักขระ
                            </h4>
                          }
                          sx={{ minWidth: 300 }}
                          required
                        />
                      </FormControl>

                      <FormControl style={{ marginTop: 20 }}>
                        <h3>รูปภาพ</h3>
                        <div {...getRootProps.getRootProps()} style={dropzonesStyles}>
                          <input {...getRootProps.getInputProps()} />
                          {images.length > 0 ? (
                            images.map((value, index) => (
                              <div key={index}>
                                {value && (
                                  <img src={typeof value === 'string' ? folderImage + value : URL.createObjectURL(value)} alt="Preview" style={previewsStyles} />
                                )}
                              </div>
                            ))
                          ) : (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                              <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหลายภาพ</p>
                            </div>
                          )}
                        </div>
                      </FormControl>

                    </div>
                    <CardContent orientation="horizontal">
                      <Button
                        variant="solid"
                        size="md"
                        color="primary"
                        aria-label="Explore Bahamas Islands"
                        sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
                        onClick={handleCommentByUser}
                      >
                        {idComment === 0 ? "ยืนยัน" : "แก่ไข"}
                      </Button>
                    </CardContent>
                  </Card>
                  <Box sx={{ minWidth: windowSize < 1183 ? 0 : 900 }}></Box>
                </motion.div>
              }
              {!openComment &&
                <motion.div
                  initial={{ x: -100, opacity: 0 }} // ตำแหน่งเริ่มต้นและความโปร่งใสเริ่มต้น
                  animate={{ x: 0, opacity: 1 }} // การเลื่อนและความโปร่งใสที่ถูกเปลี่ยนแปลง
                  transition={{ duration: 0.15 }} // ระยะเวลาที่ใช้ในการเลื่อนและการแสดงเอฟเฟกต์
                >
                  {paginatedBooking.length > 0 ?
                    <>
                      <br></br>
                      {!loadingBooking ? paginatedBooking.map((item, index) => {
                        const remainingTimeForItem = calculateRemainingTime(item.dateCreated, item.id, item.status);
                        const hours = remainingTimeForItem?.hours;
                        const minutes = remainingTimeForItem?.minutes;
                        const seconds = remainingTimeForItem?.seconds;
                        const checkTimeForItem = hours >= 0 && minutes >= 0 && seconds >= 0;
                        let itemDS;
                        let itemDE;

                        if (item.start && item.end) {
                          itemDS = new Date(item.start);
                          itemDS.setFullYear(itemDS.getFullYear() - 543);
                          itemDE = new Date(item.end);
                          itemDE.setFullYear(itemDE.getFullYear() - 543);
                        }

                        return (
                          <Card sx={{ maxHeight: "auto", minWidth: 200, marginBottom: 1.5, borderTopColor: item.status === 2 ? "#8BD97F" : item.status === 1 ? "#D9C27F" : item.status === 3 ? "#C83B55" : "#000", borderWidth: 3 }} key={index}>
                            {item.status === 0 && checkTimeForItem &&
                              <h4 style={{ position: "absolute", top: 0, color: "#C83B55", fontSize: 14 }}>เหลือเวลาชำระเงินมัดจำ {hours} ชั่วโมง {minutes} นาที {seconds} วินาที
                              </h4>
                            }
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={windowSize < 1183 ? 12 : 8.5} style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Grid item xs={3}>
                                  <h4 style={{ flex: 1, textAlign: "center" }}>
                                    {itemDS?.toLocaleString('th-TH', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </h4>
                                </Grid>
                                <Grid item xs={3}>
                                  <h4 style={{ flex: 1, textAlign: "center" }}>
                                    {itemDE?.toLocaleString('th-TH', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </h4>
                                </Grid>
                                <Grid item xs={3}>
                                  <h4 style={{ flex: 1, textAlign: "center" }}>
                                    {getStatusLabel(item.status)}
                                    {item.statusCheckIn === 1 && " + เช็คอิน"}
                                  </h4>
                                </Grid>
                                <Grid item xs={3}>
                                  <h4 style={{ flex: 1, textAlign: "center" }}>
                                    {formatNumberWithCommas(item.totalPrice)} บาท
                                  </h4>
                                </Grid>
                              </Grid>
                              <Grid item xs={windowSize < 1183 ? 12 : 3.5}>
                                <div style={{ alignItems: "center", display: "flex" }}>
                                  <Button onClick={() => openModelDetail(item.id)} sx={{ backgroundColor: "#7FD9D4", width: "auto", color: "#000", marginRight: 1 }}>
                                    <VisibilityIcon />
                                  </Button>
                                  {item.status === 2 &&
                                    <Button onClick={() => {
                                      openModelComment(item.id)
                                    }} sx={{ backgroundColor: "#7FB4D9", width: "auto", color: "#000", marginRight: 1 }}>
                                      <TextsmsIcon />
                                    </Button>
                                  }

                                  {item.status === 0 && checkTimeForItem ?
                                    <>
                                      <Button onClick={() => {
                                        openModelPayment(1, item)
                                      }} sx={{ backgroundColor: "#D9C27F", width: "auto", color: "#000", marginRight: 1 }}>มัดจำ</Button>
                                      <Button onClick={() => {
                                        openModelPayment(3, item)
                                      }} sx={{ backgroundColor: "#8BD97F", width: "auto", color: "#000", marginRight: 1 }}>ทั้งหมด</Button>
                                    </>
                                    :
                                    item.status === 1 ?
                                      <>
                                        <Button onClick={() => {
                                          openModelPayment(2, item)
                                        }} sx={{ backgroundColor: "#CFD97F", width: "auto", color: "#000", marginRight: 1 }}>ส่วนที่เหลือ</Button>
                                      </>
                                      : <></>
                                  }
                                  {item.status !== 3 && item.statusCheckIn !== 1 &&
                                    <IconButton onClick={() => openModelCancel(item.id, item.status)} sx={{ backgroundColor: "#C83B55", width: "auto", color: "#000" }}>
                                      <RemoveCircleOutlineIcon />
                                    </IconButton>
                                  }
                                </div>
                              </Grid>
                            </Grid>
                          </Card>
                        )
                      }) : <Lottie animationData={loadingMain}></Lottie>}

                      {paginatedBooking && paginatedBooking.length > 0 &&
                        <Pagination
                          count={Math.ceil(selectStatus !== 5 ? filterStatus.length / itemsPerPage : booking.length / itemsPerPage)}
                          page={currentPage}
                          onChange={handlePageChange}
                          style={{ minWidth: windowSize < 1183 ? 0 : 900 }}
                        />
                      }
                    </>
                    :
                    <div style={{ marginTop: 5, marginBottom: 100 }}>
                      <h4> ไม่มีข้อมูลการจองห้องพัก
                      </h4>
                    </div>
                  }

                </motion.div>
              }
              {allModalBooking()}
            </>
          }

          {selectTypeBooking === 1 &&
            <>
              {openCommentPackage && detailBookingPackage &&
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Card sx={{ minWidth: 200 }}>
                    <div>
                      <h2 style={{ marginTop: 0 }}>{idComment === 0 ? "แสดงความคิดเห็น" : "แก้ไข แสดงความคิดเห็น"}</h2>
                      <IconButton onClick={closeModelCommentPackage} aria-label="bookmark Bahamas Islands"
                        variant="plain"
                        color="neutral"
                        size="sm"
                        sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}>
                        <CloseIcon />
                      </IconButton>

                      <div style={{ marginTop: 20 }}>
                        <h3>คะแนน</h3>
                        <div>
                          <Rating
                            name="hover-feedback"
                            value={value}
                            precision={0.5}
                            onChange={(_event, newValue) => {
                              setValue(newValue);
                            }}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                          <h4>{value ? value + " คะแนน" : ""} </h4>
                        </div>
                      </div>

                      <FormControl style={{ marginTop: 20 }}>
                        <h3>ข้อความ</h3>
                        <Textarea
                          placeholder="พิมพ์ข้อความที่ต้องการ ..."
                          value={text}
                          onChange={(event) => setText(event.target.value)}
                          minRows={2}
                          maxRows={4}
                          startDecorator={
                            <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                              <IconButton variant="outlined" color="neutral" onClick={addEmoji('👍')}>
                                👍
                              </IconButton>
                            </Box>
                          }
                          endDecorator={
                            <h4>
                              {text.length} อักขระ
                            </h4>
                          }
                          sx={{ minWidth: 300 }}
                        />

                      </FormControl>

                      <FormControl style={{ marginTop: 20 }}>
                        <h3>รูปภาพ</h3>
                        <div {...getRootProps.getRootProps()} style={dropzonesStyles}>
                          <input {...getRootProps.getInputProps()} />
                          {images.length > 0 ? (
                            images.map((value, index) => (
                              <div key={index}>
                                {value && (
                                  <img src={typeof value === 'string' ? folderImage + value : URL.createObjectURL(value)} alt="Preview" style={previewsStyles} />
                                )}
                              </div>
                            ))
                          ) : (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                              <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหลายภาพ</p>
                            </div>
                          )}
                        </div>
                      </FormControl>

                    </div>
                    <CardContent orientation="horizontal">
                      <Button
                        variant="solid"
                        size="md"
                        color="primary"
                        aria-label="Explore Bahamas Islands"
                        sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
                        onClick={handleCommentPackageByUser}
                      >
                        {idComment === 0 ? "ยืนยัน" : "แก่ไข"}
                      </Button>
                    </CardContent>
                  </Card>
                  <Box sx={{ minWidth: 900 }}></Box>

                </motion.div>
              }
              {!openCommentPackage &&
                <motion.div
                  initial={{ x: -100, opacity: 0 }} // ตำแหน่งเริ่มต้นและความโปร่งใสเริ่มต้น
                  animate={{ x: 0, opacity: 1 }} // การเลื่อนและความโปร่งใสที่ถูกเปลี่ยนแปลง
                  transition={{ duration: 0.15 }} // ระยะเวลาที่ใช้ในการเลื่อนและการแสดงเอฟเฟกต์
                >
                  {paginatedBookingPackage.length > 0 ?
                    <><br></br>
                      {!loadingBookingPackage ? paginatedBookingPackage.map((item, index) => {
                        const remainingTimeForItem = calculateRemainingTimePackage(item.dateCreated, item.id, item.status);
                        const hours = remainingTimeForItem?.hours;
                        const minutes = remainingTimeForItem?.minutes;
                        const seconds = remainingTimeForItem?.seconds;
                        const checkTimeForItem = hours >= 0 && minutes >= 0 && seconds >= 0;
                        const hasCheckInDateOne = item.listPackages.some((p) => p.checkInDate === 1);

                        return (
                          <Card sx={{ maxHeight: "auto", minWidth: 200, marginBottom: 1.5, borderTopColor: item.status === 2 ? "#8BD97F" : item.status === 1 ? "#D9C27F" : item.status === 3 ? "#C83B55" : "#000", borderWidth: 3 }} key={index}>
                            {item.status === 0 && checkTimeForItem &&
                              <h4 style={{ position: "absolute", top: 0, color: "#C83B55", fontSize: 14 }}>เหลือเวลาชำระเงินมัดจำ {hours} ชั่วโมง {minutes} นาที {seconds} วินาที
                              </h4>
                            }
                            <Grid container spacing={2} justifyContent="center" alignItems="center">
                              <Grid item xs={windowSize < 1183 ? 12 : 8.5} style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <Grid item xs={6}>
                                  <h4 style={{ flex: 1, textAlign: "center" }}>
                                    {getStatusLabel(item.status)}
                                    {hasCheckInDateOne && " + เช็คอิน"}
                                  </h4>
                                </Grid>
                                <Grid item xs={6}>
                                  <h4 style={{ flex: 1, textAlign: "center" }}>
                                    {formatNumberWithCommas(item.totalPriceBookingPackage)} บาท
                                  </h4>
                                </Grid>
                              </Grid>
                              <Grid item xs={windowSize < 1183 ? 12 : 3.5}>
                                <div style={{ alignItems: "center", display: "flex" }}>
                                  <Button onClick={() => openModelPDetail(item.id)} sx={{ backgroundColor: "#7FD9D4", width: "auto", color: "#000", marginRight: 1 }}>
                                    <VisibilityIcon />
                                  </Button>
                                  {item.status === 2 &&
                                    <Button onClick={() => {
                                      openModelCommentPackage(item.id)
                                    }} sx={{ backgroundColor: "#7FB4D9", width: "auto", color: "#000", marginRight: 1 }}>
                                      <TextsmsIcon />
                                    </Button>
                                  }

                                  {item.status === 0 && checkTimeForItem ?
                                    <>
                                      <Button onClick={() => {
                                        openModelPaymentPackage(1, item)
                                      }} sx={{ backgroundColor: "#D9C27F", width: "auto", color: "#000", marginRight: 1 }}>มัดจำ</Button>
                                      <Button onClick={() => {
                                        openModelPaymentPackage(3, item)
                                      }} sx={{ backgroundColor: "#8BD97F", width: "auto", color: "#000", marginRight: 1 }}>ทั้งหมด</Button>
                                    </>
                                    :
                                    item.status === 1 ?
                                      <>
                                        <Button onClick={() => {
                                          openModelPaymentPackage(2, item)
                                        }} sx={{ backgroundColor: "#CFD97F", width: "auto", color: "#000", marginRight: 1 }}>ส่วนที่เหลือ</Button>
                                      </>
                                      : <></>
                                  }
                                  {item.status !== 3 && !hasCheckInDateOne &&
                                    <IconButton onClick={() => openModelCancelPackage(item.id, item.status)} sx={{ backgroundColor: "#C83B55", width: "auto", color: "#000" }}>
                                      <RemoveCircleOutlineIcon />
                                    </IconButton>
                                  }

                                </div>
                              </Grid>
                            </Grid>
                          </Card>
                        )
                      }) : <Lottie animationData={loadingMain}></Lottie>}

                      {paginatedBookingPackage && paginatedBookingPackage.length > 0 &&
                        <Pagination
                          count={Math.ceil(selectStatus !== 5 ? filterStatusPackage.length / itemsPerPage : bookingPackage.length / itemsPerPage)}
                          page={currentPageP}
                          onChange={handlePagePChange}
                          style={{ minWidth: windowSize < 1183 ? 0 : 900 }}
                        />
                      }</>
                    :
                    <div style={{ marginTop: 5, marginBottom: 100 }}>
                      <h4> ไม่มีข้อมูลการจองแพ็กเกจ
                      </h4>
                    </div>}

                </motion.div>
              }
              {allModalBookingPackage()}
            </>
          }

        </TabPanel>
        <TabPanel value={1}>
          <motion.div
            initial={{ x: -100, opacity: 0 }} // ตำแหน่งเริ่มต้นและความโปร่งใสเริ่มต้น
            animate={{ x: 0, opacity: 1 }} // การเลื่อนและความโปร่งใสที่ถูกเปลี่ยนแปลง
            transition={{ duration: 0.15 }} // ระยะเวลาที่ใช้ในการเลื่อนและการแสดงเอฟเฟกต์
          >
            <Card sx={{ maxHeight: "auto", minWidth: 200 }}>
              <Grid container alignItems="center" >
                <Grid item xs={windowSize < 1183 ? 12 : 2}>
                  <h4>เลือกวันที่ระหว่าง</h4>
                  <Input type="date" name="start" value={convertToBuddhistYear(start)} onChange={
                    (e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setStart(new Date().toISOString().split('T')[0]);
                        return;
                      }
                      const newYear = convertToGregorianYear(e.target.value)

                      setStart(newYear)
                      if (new Date(newYear) >= new Date(end)) {
                        setEnd(new Date(new Date(newYear).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                      }
                    }} />
                </Grid>
                <Grid item xs={windowSize < 1183 ? 12 : 2} sx={{ marginLeft: windowSize < 1183 ? 0 : 1 }}>
                  <h4>ถึง</h4>
                  <Input slotProps={{
                    input: {
                      min: start
                      ? convertToBuddhistYear(new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split('T')[0])
                      : convertToBuddhistYear(new Date().toISOString().split('T')[0]),
                    },
                  }} disabled={start ? false : true} type="date" name="end" value={convertToBuddhistYear(end)} onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setEnd('');
                      return;
                    }
                    const newYear = convertToGregorianYear(e.target.value)
                    setEnd(newYear)
                    }} />
                </Grid>
                <Grid item xs={windowSize < 1183 ? 12 : 3} sx={{ marginLeft: windowSize < 1183 ? 0 : 1, marginTop: windowSize < 1183 ? 0 : 2 }}>
                  <p>
                    {start && end && "ตรวจสอบเป็นเวลา"}
                    {selectDateY !== 0 && start && end && ` ${selectDateY} ปี`}
                    {selectDateM !== 0 && start && end && ` ${selectDateM} เดือน`}
                    {selectDateD !== 0 && start && end && ` ${selectDateD} วัน`}
                  </p>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <h4>ประเภทแผนภูมิ</h4>
                    <Button onClick={exportPDF}>PDF</Button>
                    <Button onClick={exportExcel}>Excel</Button>
                  </div>
                  <RadioGroup
                    defaultValue={typeChart}
                    value={typeChart}
                    onChange={handleTypeChartChange}
                    sx={{ flexDirection:"row",gap:2 }}
                  >
                    <Radio value="pie" label="วงกลม" sx={{ marginTop:"auto" }}/>
                    <Radio value="bar" label="แท่ง" />
                    <Radio value="line" label="เส้น" />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ display: 'flex', marginTop: 0 }}>
                <Grid item xs={windowSize < 1183 ? 12:4}>
                  <Card sx={{maxWidth: 350}}>
                    {typeChart === "pie" ?
                      <PieChart
                        series={[
                          {
                            data:dataAllPrice,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            arcLabel: getArcLabelP,
                          },
                        ]}
                        height={200} 
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            fill: 'white',
                            fontSize: 14,
                          },
                        }}
                      />
                      : 
                      typeChart === "bar" ? 
                        <BarChart
                          xAxis={[{ scaleType: 'band', data: labelsAllPrice }]}
                          series={[{ data: barDataAllPrice }]}
                          height={200}
                        />
                      :
                      <LineChart
                        xAxis={[{ scaleType: 'band', data: labelsAllPrice  }]}
                        series={[
                          {
                            data: lineDataAllPrice ,
                          },
                        ]}
                        height={200}
                      />
                    }
                  </Card>
                </Grid>
                <Grid item xs={windowSize < 1183 ? 12:4}>
                  <Card sx={{maxWidth: 350}}>
                    {typeChart === "pie" ?
                      <PieChart
                      series={[
                        {
                          data:dataAllBooking,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          arcLabel: getArcLabelB,
                        },
                      ]}
                      height={200} 
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: 'white',
                          fontSize: 14,
                        },
                      }}
                      />
                      : 
                      typeChart === "bar" ? 
                        <BarChart
                          xAxis={[{ scaleType: 'band', data: labelsAllBooking }]}
                          series={[{ data: barDataAllBooking }]}
                          height={200}
                        />
                      :
                      <LineChart
                        xAxis={[{ scaleType: 'band', data: labelsAllBooking  }]}
                        series={[
                          {
                            data: lineDataAllBooking ,
                          },
                        ]}
                        height={200}
                      />
                    }
                  </Card>
                </Grid>
                <Grid item xs={windowSize < 1183 ? 12:4}>
                  <Card sx={{maxWidth: 350}}>
                    {typeChart === "pie" ?
                      <PieChart
                      series={[
                        {
                          data:dataAllBookingPayment,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          arcLabel: getArcLabelBm,
                        },
                      ]}
                      height={200} 
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: 'white',
                          fontSize: 14,
                        },
                      }}
                      />
                      : 
                      typeChart === "bar" ? 
                        <BarChart
                          xAxis={[{ scaleType: 'band', data: labelsAllBookingPayment }]}
                          series={[{ data: barDataAllBookingPayment }]}
                          height={200}
                        />
                      :
                      <LineChart
                        xAxis={[{ scaleType: 'band', data: labelsAllBookingPayment }]}
                        series={[
                          {
                            data: lineDataAllBookingPayment ,
                          },
                        ]}
                        height={200}
                      />
                    }
                  </Card>
                </Grid>
              </Grid>
              <Box sx={{ minWidth: windowSize < 1183 ? 0 : 900 }}></Box>
            </Card>
          </motion.div>
        </TabPanel>
        <TabPanel value={2}>
          {!isLoadingUser ?
            <motion.div
              initial={{ x: -100, opacity: 0 }} // ตำแหน่งเริ่มต้นและความโปร่งใสเริ่มต้น
              animate={{ x: 0, opacity: 1 }} // การเลื่อนและความโปร่งใสที่ถูกเปลี่ยนแปลง
              transition={{ duration: 0.15 }} // ระยะเวลาที่ใช้ในการเลื่อนและการแสดงเอฟเฟกต์
            >
              <Card sx={{ maxHeight: "auto", minWidth: 200 }}>
                <FormControl>
                  <h4>อีเมล</h4>
                  <Input name="email" value={email} onChange={(e) => {
                    setEmail(e.target.value)
                  }
                  } />
                </FormControl>
                <FormControl>
                  <h4>ชื่อผู้ใช้</h4>
                  <Input name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </FormControl>
                <FormControl>
                  <h4>เบอร์โทรศัพท์</h4>
                  <Input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </FormControl>
                <FormControl>
                  <Button onClick={handleChangeUser} sx={{ backgroundColor: "#8BD97F", width: "auto", color: "#000" }}>บันทึก</Button>
                </FormControl>
                <Box sx={{ minWidth: windowSize < 1183 ? 0 : 900 }}></Box>
              </Card>
            </motion.div>
            : <Lottie animationData={loadingMain}></Lottie>}
        </TabPanel>
      </Tabs>
    </Container>
  );
}

export default SettingPage;

//#region 
const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Tab = styled(BaseTab)`
  font-family: 'IBM Plex Sans', sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: #0F1035;
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[200]};
  }

  &.${buttonClasses.focusVisible} {
    background-color: #fff;
    color: ${blue[600]};
  }

  &.${tabClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${blue[600]};
  }
`;

const TabPanel = styled(BaseTabPanel)`
  minWidth: "auto";
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;

const Tabs = styled(BaseTabs)`
  gap: 16px;
  minWidth: 100px;
`;

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  background-color: #365486;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  padding: 6px;
  gap: 12px;

  align-content: space-between;
  box-shadow: 0px 4px 8px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);

const dropzonesStyles: object = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
  minHeight: "150px",
};

const previewsStyles: object = {
  maxWidth: '100px',
  maxHeight: '100px',
  objectFit: 'cover',
  marginLeft: '5px',
};

//#endregion