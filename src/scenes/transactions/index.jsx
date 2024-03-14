import { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { tokens } from "../../theme";
import { columns } from "../../data/columns";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import dayjs from 'dayjs';
import Req from "../../config/axios";
import ResponsivePieCanvas from "../../components/newpie";
import { colorArr } from '../../data/mockData';

const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [ val, setVal ] = useState([]);
  const [ data,setData ] = useState([])
  const [ total, setTotal ] = useState({
    withdrawal: 0,
    deposit: 0
  })
  const [ date,setDate ] = useState({
    start:"",
    last:""
  })

  const day = dayjs(new Date());
  const [ datePicker, setDatePicker ] = useState(day);

    // 날짜 선택시, 월별 데이터 조회 function 호출
    useEffect(() =>  {
      const isDate = datePicker.format("YYYY.MM");
      console.log(datePicker.format("YYYY.MM"), "useEffect isDate")
      getTransactionsByDate(isDate)
      AgrByDate(isDate)
    }, [datePicker])
  
    // 총액 데이터 조회
    useEffect(() => {
      handleSetTotal()
    }, [val])

  // 거래 조회 데이터 setState에 저장
  const handleSetVal = (value) => {
    var copy = [...val];
    copy = value;
    setVal(copy)
  }

  // 월별 DB 조회 function
  const getTransactionsByDate = async (isDate) => {

      try {
        await Req.get("/transactionsByDate", {params: {date: isDate}} )
        .then((result) => {
          var copy = [];
          copy = result.data[0];
          handleSetVal(result.data);
        });
      } catch(err){
        console.log(err);
      }
  } 

  // 월별 DB 조회 function
const AgrByDate = async (isDate) => {
  try {
      const result = await Req.get("/aggrByDate", {params: {date: isDate}} )

      console.log(result.data[0]);
      refine (result.data[0].category)
      handleSetDate(result.data[0].date)

  } catch(err){
      console.log(err);
  }
} 

  // 총액 계산
  const handleSetTotal = () => {

    var TotalDeposit = 0; 
    var TotalWithdrawal = 0;
    
    val.map(function(sum) {
      TotalDeposit += sum.deposit;
      TotalWithdrawal += sum.withdrawal;
    });

    setTotal({
      deposit: TotalDeposit,
      withdrawal: TotalWithdrawal
    })
  }

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
  const handleSetDate = (date) => {

    var copy;
    console.log(date, "date")
    copy = {
      start: date[0].start,
      last: date[0].last 
    };

    setDate(copy)
        console.log(val, "date")
  }



  return (
    <Box m="15px">
      <Typography>{date.start?dayjs(date.start).format('YYYY.MM.DD'):""}
      -{date.last?dayjs(date.last).format('YYYY.MM.DD'):""}</Typography>
      <Header
        title="거래내역"
        subtitle="List of Transactions"
      />
      
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="90px"
        gap="20px"
        marginTop={-5}
        marginBottom={-6}
        >
        {/* 1st */}
        <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                value={datePicker} 
                onChange={(newValue) => 
                  setDatePicker(newValue) } 
                views={['year', 'month']}
                openTo={'month'}
              />
            </LocalizationProvider>
        </Box>
        {/* 2nd */}
        <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
          <StatBox
                title={datePicker.year() + "년 " + (datePicker.month()+1) + "월" }
                subtitle="몇 일 - 몇 일 내역"
                progress="1%"
                // increase=""
                // icon={
                //   <AddIcon
                //     sx={{ color: colors.greenAccent[600], fontSize: "20px" }}
                //   />
                // }
              />
        </Box>
        <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* 3rd */}
          <StatBox
                title={total.deposit}
                subtitle="입금내역 (Deposit)"
                progress="%"
                increase=""
                icon={
                  <AddIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "20px" }}
                  />
                }
              />
        </Box>
        <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
          <StatBox
                title={total.withdrawal}
                subtitle="출금내역 (Withdrawal)"
                progress="%"
                increase=""
                icon={
                  <RemoveIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "20px" }}
                  />
                }
              />
        </Box>
      </Box>
      {/* <Button color="secondary" variant="contained" onClick={handleConfirm}>
        확인</Button>
      <Button color="secondary" variant="contained" onClick={getTransactions}>
      DB가져오기</Button> */}
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      > 
      <Box style={{ width: '50%', height: '50%' }}>
        <ResponsivePieCanvas data={data} />
      </Box>
      <DataGrid
        rows={val}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        getRowId={ (row) => row._id }
      />
    </Box>
  </Box>
  );
};

export default Transactions;
