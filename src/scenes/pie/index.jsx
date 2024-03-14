import {useState, useEffect, useRef} from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import Header from "../../components/Header";
// import PieChart from "../../components/PieChart";
import ResponsivePieCanvas from "../../components/newpie";
import { colorArr } from '../../data/mockData';
import Req from '../../config/axios';
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { columns } from "../../data/columns";

const Pie = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [ data,setData ] = useState([])
  const [ date,setDate ] = useState({
    start:"",
    last:""
  })
  const [ datePicker, setDatePicker ] = useState(dayjs(new Date()));
  const ref = useRef(null);
  

    // 날짜 선택시, 월별 데이터 조회 function 호출
    useEffect(() =>  {
      const isDate = datePicker.format("YYYY.MM");
      getTransactionsByDate(isDate)
    }, [datePicker])

    // 월별 DB 조회 function
    const getTransactionsByDate = async (isDate) => {
      try {
        await Req.get("/aggrByDate", {params: {date: isDate}} )
        .then((result) => {
          refine (result.data[0].category)
          var copy = [];
          copy = result.data[0];
          handleSetDate(copy.date)
          // handleSetVal(copy)
        });
      } catch(err){
        console.log(err);
      }
  } 

  // pie chart data정제
  function refine (data) {
    var dataSet;
    dataSet = data.map( (el, index) => {
        return {
            id: el._id,
            label: el._id,
            value: el.Total,
            color: colorArr[index],
            etc: el.arr
        }
    })

    setData(dataSet)
}

  // 날짜 setDate 및 rendering 
  const handleSetDate = (value) => {
    var copy;

    console.log(value, "value")
    copy = {
      start: value[0].start,
      last: value[0].last 
    };

    setDate(copy)
        console.log(date, "date")
  }

  const handleConfirm = () => {
    console.log (dayjs("2024.02.25 19:36:39").toISOString())
  }
  
  return (
    <Box >
      {/* <Header title="시각화 그래프 (원형)" /> */}

      <Typography fontSize={22} marginTop={7} marginBottom={2} variant="body1">
       거래 날짜: {date.start?dayjs(date.start).format('YYYY-MM-DD'):null} 
          - {date.last?dayjs(date.last).format('YYYY-MM-DD'):null}
      </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DatePicker 
                value={datePicker} 
                onChange={(newValue) => 
                setDatePicker(newValue) }
                label='"월"'
                openTo="month" 
                views={['year','month']}
                slots={{
                  LeftArrowIcon: "<",
                  RightArrowIcon: ">",
                }}
              />
            </LocalizationProvider>
            <Button sx={{backgroundColor:"red"}} onClick={handleConfirm}>거래내역 조회</Button>
      <Box height="75vh">
        <ResponsivePieCanvas data={data} />
        {/* <Typography fontSize={22} marginTop={-3} marginBottom={2} variant="body1">거래 내역</Typography> */}

      </Box>
    </Box>
  );
};

export default Pie;
