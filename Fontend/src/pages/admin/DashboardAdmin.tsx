import { Button, Card, Input, Radio, RadioGroup, Stack } from '@mui/joy';
import { Box, Grid } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import PaymentsIcon from '@mui/icons-material/Payments';
import { ReactNode, useEffect, useState } from 'react';
import { useAppSelector } from '../../store/store';
import { convertToBuddhistYear, convertToGregorianYear, formatNumberWithCommas } from '../../components/Reuse';
import { windowSizes } from '../../components/Reuse';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { DefaultizedPieValueType } from '@mui/x-charts/models';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { baseUrlServer } from '../../components/api/agent';
// import THSarabunNew from '../../components/Font/THSarabunNew.ttf';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  value: string;
}

interface DataPieChart {
  id: number;
  value: number;
  label: string;
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
  const { bookings, bookingPackages} = useAppSelector((state) => state.booking);
  const [start, setStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [end, setEnd] = useState<string>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]);

  const [bookingAll, setBookingAll] = useState<number>(0);
  const [bookingAllByPayment, setBookingAllByPayment] = useState<number>(0);
  const [totalPrices, setTotalPrices] = useState<number>(0);

  const [bookingPackageAll, setBookingPackageAll] = useState<number>(0);
  const [bookingPackageAllByPayment, setBookingPackageAllByPayment] = useState<number>(0);
  const [totalPricesPackage, setTotalPricesPackage] = useState<number>(0);

  const [selectDateD, setSelectDateD] = useState<number>(0);
  const [selectDateM, setSelectDateM] = useState<number>(0);
  const [selectDateY, setSelectDateY] = useState<number>(0);

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

  const [typeChart, setTypeChart] = useState('pie');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeChart(event.target.value);
  };

  const windowSize = windowSizes();

  useEffect(() => {
    const filteredBookings = bookings && start && end && bookings.filter(booking => {
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
    const filteredBookingPackages = bookingPackages && start && end && bookingPackages.filter(bookingPackage => {
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

    const conutBooking = filteredBookings ? filteredBookings.filter(booking => booking.status === 1 || booking.status === 2).length : bookings.filter(booking => booking.status === 1 || booking.status === 2).length;
    
    const countBookingPayment = filteredBookings ? filteredBookings.filter(booking => booking.status === 2).length : bookings.filter(booking => booking.status === 2).length;

    const countTotalPrices = filteredBookings ? filteredBookings.filter(booking => booking.status === 1 || booking.status === 2)
      .reduce((total, booking) => total + booking.totalPrice, 0) : bookings.filter(booking => booking.status === 1 || booking.status === 2).reduce((total, booking) => total + booking.totalPrice, 0);

    const conutBookingPackage = filteredBookingPackages ? filteredBookingPackages.filter(booking => booking.status === 1 || booking.status === 2).length : bookingPackages.filter(booking => booking.status === 1 || booking.status === 2).length;

    const countBookingPaymentPackage = filteredBookingPackages ? filteredBookingPackages.filter(booking => booking.status === 2).length : bookingPackages.filter(booking => booking.status === 2).length;

    const countTotalPricesPackage = filteredBookingPackages ? filteredBookingPackages.filter(booking => booking.status === 1 || booking.status === 2)
      .reduce((total, booking) => total + booking.totalPriceBookingPackage, 0) : bookingPackages.filter(booking => booking.status === 1 || booking.status === 2).reduce((total, booking) => total + booking.totalPriceBookingPackage, 0);

    setBookingAll(conutBooking);
    setBookingAllByPayment(countBookingPayment);
    setTotalPrices(countTotalPrices);

    setBookingPackageAll(conutBookingPackage);
    setBookingPackageAllByPayment(countBookingPaymentPackage);
    setTotalPricesPackage(countTotalPricesPackage);

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
    
  }, [start, end, bookings, typeChart, bookingPackages]);

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
    doc.text(`รายงาน`, 10, 10);
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
        ['รายงาน'],
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
    <Box sx={{ marginTop: 9.5, marginLeft: windowSize < 1183 ? 5 : 30, marginRight: windowSize < 1183 ? 5 : 0 }}>
      <div style={{ marginTop: 100 }}>
        <h2>แผงควบคุม รายได้และการจอง</h2>
      </div>
      <div style={{ marginTop: 10 }} />

      <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
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
            }} disabled={start ? false : true} type="date" name="end" value={convertToBuddhistYear(end)} onChange={(e) => 
            {
              const value = e.target.value;
              if (value === '') {
                setEnd('');
                return;
              }
              const newYear = convertToGregorianYear(e.target.value)
              setEnd(newYear)}} />
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
      </Stack>

      <Grid container spacing={2} sx={{marginBottom:2}}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard icon={<PaymentIcon sx={{ marginRight: 1, marginTop: 0.2 }} />} title="รายได้รวมทั้งหมด" value={formatNumberWithCommas(totalPrices + totalPricesPackage)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard icon={<HistoryIcon sx={{ marginRight: 1, marginTop: 0.2 }} />} title="จำนวนการจองทั้งหมด" value={formatNumberWithCommas(bookingAll + bookingPackageAll)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard icon={<PaymentsIcon sx={{ marginRight: 1, marginTop: 0.2 }} />} title="จำนวนที่ชำระเงินแล้ว" value={formatNumberWithCommas(bookingAllByPayment + bookingPackageAllByPayment)} />
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
              onChange={handleChange}
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
    </Box>
  );
}

export default DashboardAdmin;
