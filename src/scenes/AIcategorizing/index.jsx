import OpenAI from 'openai';
import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { columns } from "../../data/columns";
import Req from "../../config/axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StatBox from "../../components/StatBox";
import costKeyword from "../../data/data"

// import dotenv from "dotenv";
// dotenv.config();
// const API_KEY = process.env.REACT_APP_OPENAI_API_KEY
// console.log(API_KEY)

// const openai = new OpenAI({
//   // apiKey: process.env.REACT_APP_OPENAI_API_KEY
// })

const AIcategorizing = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [ val, setVal ] = useState([]);
  const [total, setTotal ] = useState({
    withdrawal: 0,
    deposit: 0
  })

  const day = dayjs(new Date());
  const [ datePicker, setDatePicker ] = useState(day);

  const handleSetVal = (value) => {
    var copy = [...val];
    copy = value;
    setVal(copy)
  }

  const getTransactionsByDate = async (isDate) => {
      try {
        await Req.get("/transactionsByDate", {params: {date: isDate}} )
        .then((result) => {
          handleSetVal(result.data);
        });
      } catch(err){
        console.log(err);
      }
  } 

  const postTransactionUpadate = async (categories) => {
    try {
      await Req.post("/transactionUpdate", categories )
      .then((result) => {
        console.log(result.data)
      });
    } catch(err){
      console.log(err);
    }
  } 

  const getKeywords = async () => {
    try {
      await Req.get("/keyword")
      .then((result) => {
        console.log(result.data)
      });
    } catch(err){
      console.log(err);
    }
  } 

  const postKeywords = async (categories) => {
    try {
      await Req.post("/keyword", categories )
      .then((result) => {
        console.log(result.data)
      });
    } catch(err){
      console.log(err);
    }
  } 

  // 기능 제작하기 -->>
  // 테스트용 버튼
  const handleConfirm = () => {

    console.log(val)
    const categories = val
    .filter(function(element){
      return (element.category === "미분류"); 
    })
    .map(( element ) => {
      if(element.category === "미분류") {
        return{
          title: element.title,
          category: element.category
        } 
      }
      })
    console.log(categories)

  }


  // Categorizing 할 수 있는 기능

  // Categorizing 할 수 있는 기능
  const handleGetKeywords = async () => {
    getKeywords();
  }

  const handlePostKeywords = async () => {
    console.log(costKeyword)
    postKeywords(costKeyword);
  }

    // Categorizing 할 수 있는 기능
    const getAsk = async () => {
      try {
        await Req.get("/gptAsk")
        .then((result) => {
          console.log(result.data)
        });
      } catch(err){
        console.log(err);
      }
    }

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

  // 월별 데이터 조회
  useEffect(() =>  {
    const isDate = datePicker.format("YYYY.MM");
    getTransactionsByDate(isDate)
  }, [datePicker])

  // 총액 데이터 조회
  useEffect(() => {
    handleSetTotal()
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
    <Box m="0px 20px">
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
      <Button color="secondary" variant="contained" onClick={handleConfirm}>
        현재 데이터 확인</Button>
      <> </>
      <Button color="secondary" variant="contained" onClick={getAsk}>
      getAsk</Button>
      <> </>
      <Button color="secondary" variant="contained" onClick={handleGetKeywords}>
      Read Keyword console.log</Button>
      <> </>
      <Button color="secondary" variant="contained" onClick={handlePostKeywords}>
      postKeywords Create</Button>
      <> </>
      <Button color="secondary" variant="contained" onClick={handlePostKeywords}>
      읽기</Button>
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

export default AIcategorizing;
