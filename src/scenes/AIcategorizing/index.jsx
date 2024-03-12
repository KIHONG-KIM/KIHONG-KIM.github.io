import { useState, useEffect, useRef } from "react";
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
// import costKeyword from "../../data/data"

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
  const keyword = useRef();

  useEffect(() => {
    getTransactionsByCat()
  })

  /* axios */ 
  // 미분류 검색
  const getTransactionsByCat = async () => {
    try {
      await Req.get("/transactionsByCat", {params: {category: "미분류"}} )
      .then((result) => {
        handleSetVal(result.data);
      });
    } catch(err){
      console.log(err);
    }
  } 

  // 데이터 쓰기
  const handleSetVal = (value) => {
    var copy = [...val];
    copy = value;
    setVal(copy)
  }

  // 날짜로 검색 
  // const getTransactionsByDate = async (isDate) => {
  //     try {
  //       await Req.get("/transactionsByDate", {params: {date: isDate}} )
  //       .then((result) => {
  //         handleSetVal(result.data);
  //       });
  //     } catch(err){
  //       console.log(err);
  //     }
  // } 

  // OPENAI Assist에게 요청보내기
  const handleAskAssistant = async (data) => {
    try {
      console.log(data)
      await Req.post("/assistant", data)
      .then((result) => {
        handleGetAnswer(result.data)
      });
    } catch(err){
      console.log(err);
    }
  }

  // OPENAI Assist에게 요청보내기
  const handleGetAnswer = async (data) => {
    console.log(data)
    try {
      await Req.get("/assistant", {params: {data: data}})
      .then((result) => {
        console.log(result.data)
      });
    } catch(err){
      console.log(err);
    }
  }

  // 아직
  const postTransactionUpadate = async (data) => {
    try {
      await Req.post("/transactionUpdate", data )
      .then((result) => {
        console.log(result.data)
      });
    } catch(err){
      console.log(err);
    }
  } 

  // 키워드 콜렉션에서 가져오기
  const getKeywords = async () => {
    try {
      await Req.get("/keyword")
      .then((result) => {
        console.log(result.data)
        keyword.current = result.data; // 키워드 ref에 저장
      });
    } catch(err){
      console.log(err);
    }
  } 

  // 키워드 업로드하기
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
  
  var arr=[];
  const handleGetKeyword = async () => {

    arr.식비 = [];
    arr.생활비 = [];
    arr.교통비 = [];
    arr.고정지출 = [];
    arr.기타 = [];
    arr.주거비 = [];
    arr.문화생활여가 = [];
    arr.미분류 = [];

    // useRef에 있는 데이터로 arr 배열에 분류합니다.
    if (keyword.current !== undefined) {
      keyword.current.map( (element) => {

        var spacebar = null;
        spacebar = element.word.split(" ");

        if ( spacebar.length > 1 ) {
          spacebar.map((el) => {
            categorizeSwitch(el, element.category)
            return null;
          })

        } else {
          categorizeSwitch(element.word, element.category )
        }

        return null;
      })
    }
    
    console.log(arr)
  }

/// 분류 시스템 Switch
function categorizeSwitch(word, category) {
  // console.log(element, "element")
  switch(category) {
    case '식비': 
      // console.log(word, "식비")
      arr.식비.push(word);
      break;
    case '생활비': 
      // console.log(word, "생활비")
      arr.생활비.push(word);
      break;
    case '교통비':
      // console.log(word, "교통비")
      arr.교통비.push(word);
      break;
    case "고정지출": 
      // console.log(word, "고정지출")
      arr.고정지출.push(word);
      break;
    case "기타":
      // console.log(word, "기타")
      arr.기타.push(word);
      break;         
    case "주거비":
      // console.log(word, "주거비")
      arr.주거비.push(word);
      break;         
    case "문화생활/여가":
      // console.log(word, "문화생활여가")
      arr.문화생활여가.push(word);
      break;         
    default:
      console.log(word, "미분류")
      arr.미분류.push(word);
      break;         
  }
}

//// 카테고리 분별 시스템
function categorizeExpense(item) {

  let category;
  for (const key in arr) {
    if (arr[key].some(word => item.includes(word))) {
        category = key;
        break;
    }
  }

  if (category === undefined) {
      category = '미분류'
  }

  return category;
}

  /* 버튼 */ 
  // 1. 테스트용 버튼
  const handleTest = () => {

  }

  
  // 2. ask할 항목 확인 버튼
  const handleConfirm = async () => {
    var data = [];
      for (var i = 0; i < 30 ; i ++) {
        data[i] = val[i].title;
      }
      data = data.filter((element) => 
        element !== ""
      )
      const set = new Set(data);
      const unique = [...set];

      console.log(unique)
  }


  // 3. Keyword 키워드 읽고 GPT에게 넘기기
  const handleGPT = async () => {

    try { 
      // const newData = val.map((element) => {
      //   return element.title
      // });

      var data = [];
      for (var i = 0; i < 30 ; i ++) {
        data[i] = val[i].title;
      }

      data = data.filter((element) => 
        element !== ""
      )
      const set = new Set(data);
      const unique = [...set];

      console.log(unique)

      handleAskAssistant(unique)

    } catch (err) {
      console.log(err, "Err 확인 필요")
    }
  }
  
  // 4. 키워드 가져오기
  const handleSomething = async () => {
    getKeywords() // 1 키워드 백엔드에서 가져와
    console.log(keyword.current, "keyword.current")
    // categorizeExpense()
  }

  // 5. 콘솔 로그버튼
  const handleAsk = () => {
    console.log(keyword.current,  "keyword.current")
    console.log(val, "val")
    handleGetKeyword()
  }

  // 6. 기존 데이터 분류하기
  const handleCategorizing = async () => {

    var data = val.map((el) => {
      console.log(el.title, "el.title")
      return {
        category: categorizeExpense(el.title),
        date: el.date,
        title: el.title,
      }
    })

    console.log(data, "data")

    const refined = data.filter((el) => { return el.category !== "미분류" })
    console.log(refined, "refined data")
    postTransactionUpadate(refined)
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
      <> </><Button color="secondary" variant="contained" onClick={handleTest}> 테스트 버튼 </Button>
      <> </><Button color="secondary" variant="contained" onClick={handleConfirm}> 보낼 데이터 확인하기</Button>
      <> </><Button color="secondary" variant="contained" onClick={handleGPT}>GPT ask버튼 </Button>
      <> </><Button color="secondary" variant="contained" onClick={handleSomething}>Keyword DB로 기존 데이터 파싱</Button>
      <> </><Button color="secondary" variant="contained" onClick={handleAsk}>콘솔 로그 확인</Button>
      <> </><Button color="secondary" variant="contained" onClick={handleCategorizing}> 기존 데이터 분류하기 </Button>
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
