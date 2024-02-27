import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { columns } from "./../../data/columns";
import Req from "../../config/axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StatBox from "../../components/StatBox";


const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ val, setVal ] = useState([]);
  const [total, setTotal ] = useState({
    withdrawal: 0,
    deposit: 0
  })

  const now = new Date();
  const day = dayjs(now);
  const [ datePicker, setDatePicker ] = useState(day);
  
  // console.log(result.data, typeof(result.data))
  // console.log(result.data[0],result.data[1] )

  const getTransactions = async () => {
    try {
      const getTransactions = await Req.get("/transaction")
      .then((result) => {
        var copy = [...val];
        copy = result.data;
        setVal(copy);
      });
    } catch(err){
      console.log(err);
    }
  }

  const getTransactionsByDate = async (isDate) => {
    console.log(isDate, typeof(isDate))
      try {
        const getTransactionsbyDate = await Req.get("/transactionsByDate", {params: {date: isDate}} )
        .then((result) => {
          var copy = [...val];
          copy = result.data;
          setVal(copy);
        });

      } catch(err){
        console.log(err);
      }

  } 

  // 테스트용 버튼
  const handleConfirm = () => {
    console.log(val)
    console.log(datePicker, datePicker.get("month"));
  } 
  
  // 최초 데이터 조회
  useEffect(() =>  {
    getTransactions()
  }, [])

  // 월별 데이터 조회
  useEffect(() =>  {
    
    if(datePicker) {
      const isDate = datePicker.format("YYYY.MM");
      console.log(datePicker.format("YYYY.MM"), "useEffect isDate")
      getTransactionsByDate(isDate)
    } else {
      getTransactions()
    }
  }, [datePicker])

  // 총액 데이터 조회
  useEffect(() => {
    var TotalDeposit = 0; 
    var TotalWithdrawal = 0;
    const sum = val.map(function(sum,index) {
      TotalDeposit += sum.deposit;
      TotalWithdrawal += sum.withdrawal;
    });
    setTotal({
      deposit: TotalDeposit,
      withdrawal: TotalWithdrawal
    })
    console.log(TotalDeposit, TotalWithdrawal)
  }, [val])

  function generateRandom() {
    var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  return (
    <Box m="20px">
      <Header
        title="거래내역"
        subtitle="List of Transactions"
      />
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="90px"
        gap="20px"
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
              views={['year', 'month']}/>
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
                subtitle="입금내역"
                progress="0.75"
                increase="+14%"
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
                subtitle="출금내역"
                progress="0.75"
                increase="+14%"
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
        <DataGrid
          rows={val}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={ (row) => generateRandom() }
        />
      </Box>
    </Box>
  );
};

export default Contacts;
