import { Card, Input, Stack } from '@mui/joy';
import { Box, Grid } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import PaymentsIcon from '@mui/icons-material/Payments';
import { ReactNode, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getBookingAdmin } from '../../store/features/bookingSlice';
import { formatNumberWithCommas } from '../../components/Reuse';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { windowSizes } from '../../components/Reuse';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  value: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value }) => {
  return (
    <Card variant="outlined" sx={{
      backgroundColor:
        title === "รายได้รวมทั้งหมด" ? "#92D97F" :
          title === "จำนวนการจองทั้งหมด" ? "#D9CB7F" : "#7FD8D9"
      , marginTop: 3, maxWidth: 350, flexDirection: "row", alignItems: "center", justifyContent: "space-between"
    }}>
      <Box sx={{ display: "flex" }}>
        <Box>
          {icon}
        </Box>
        <h4>
          <div />
          {title}
        </h4>
      </Box>
      <h4>{value}</h4>
    </Card>
  );
};

const DashboardAdmin = () => {
  const { bookings } = useAppSelector((state) => state.booking);
  const dispatch = useAppDispatch();
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [bookingAll, setBookingAll] = useState<number>(0);
  const [bookingAllByPayment, setBookingAllByPayment] = useState<number>(0);
  const [totalPrices, setTotalPrices] = useState<number>(0);
  const [selectDateD, setSelectDateD] = useState<number>(0);
  const [selectDateM, setSelectDateM] = useState<number>(0);
  const [selectDateY, setSelectDateY] = useState<number>(0);
  const [selectType, setSelectType] = useState<number | null>(0);
  const windowSize = windowSizes();

  const fetchData = async () => {
    await dispatch(getBookingAdmin());
  };

  useEffect(() => {
    const filteredBookings = bookings && start && end && bookings.filter(booking => {
      const bookingStartDate = new Date(booking.start);
      const bookingEndDate = new Date(booking.end);
      const startDate = new Date(start);
      const endDate = new Date(end);

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

    const conutBooking = filteredBookings ? filteredBookings.length : bookings.length;
    const countBookingPayment = filteredBookings ? filteredBookings.filter(booking => booking.status === 1 || booking.status === 2).length : bookings.filter(booking => booking.status === 1 || booking.status === 2).length;
    const countTotalPrices = filteredBookings ? filteredBookings.filter(booking => booking.status === 1 || booking.status === 2)
      .reduce((total, booking) => total + booking.totalPrice, 0) : bookings.filter(booking => booking.status === 1 || booking.status === 2).reduce((total, booking) => total + booking.totalPrice, 0);

    setBookingAll(conutBooking);
    setBookingAllByPayment(countBookingPayment);
    setTotalPrices(countTotalPrices);
  }, [start, end, bookings]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setSelectType(newValue);
  };

  const data = [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ];

  return (
    <Box sx={{ marginTop: 9.5, marginLeft: windowSize < 1183 ? 5 : 30 ,marginRight: windowSize < 1183 ? 5 : 0 }}>
      <div style={{ marginTop: 100 }}>
        <h2 >แผงควบคุม</h2>
      </div>
      <div style={{ marginTop: 10 }} />
      
      <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
          <h4>เลือกวันที่ระหว่าง</h4>
          <Input type="date" name="start" value={start} onChange={(e) => setStart(e.target.value)} />
          <h4>ถึง</h4>
          <Input slotProps={{
            input: {
              min: start
                ? new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0]
                : new Date().toISOString().split('T')[0],
            },
          }} disabled={start ? false : true} type="date" name="end" value={end} onChange={(e) => setEnd(e.target.value)} />
          <h4>ตรวจสอบเป็นเวลา  {selectDateY !== 0 && selectDateY + " ปี"}  {selectDateM !== 0 && selectDateM + " เดือน"} {selectDateD !== 0 && selectDateD + " วัน"}</h4>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard icon={<PaymentIcon sx={{ marginRight: 1, marginTop: 0.2 }} />} title="รายได้รวมทั้งหมด" value={formatNumberWithCommas(totalPrices)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard icon={<HistoryIcon sx={{ marginRight: 1, marginTop: 0.2 }} />} title="จำนวนการจองทั้งหมด" value={formatNumberWithCommas(bookingAll)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard icon={<PaymentsIcon sx={{ marginRight: 1, marginTop: 0.2 }} />} title="จำนวนที่ชำระเงินแล้ว" value={formatNumberWithCommas(bookingAllByPayment)} />
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}>
        <Select defaultValue={0} onChange={handleChange} sx={{ width: 200 }}>
          <Option value={0}>วันนี้</Option>
          <Option value={1}>สัปดาห์นี้</Option>
          <Option value={2}>เดือนนี้</Option>
        </Select>
      </Box>

      <Grid container spacing={2} sx={{ display: 'flex', marginTop: 0 }}>
        <Grid item xs={12} sm={6} md={5.8}>
          <Card>
            <PieChart
              series={[
                {
                  data,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
              ]}
              height={250}
              width={500}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={5.8}>
          <Card>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              height={250}
              width={500}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardAdmin;
