import { useState, useRef, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import * as XLSX from 'xlsx';
import { columns } from "../../data/columns";
import Req from "../../config/axios";
import dayjs from "dayjs";

const Upload = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ val, setVal ] = useState([]);
  const keyword = useRef();

  useEffect(() => {
    getKeywords()
  }, [])

  // 키워드 콜렉션에서 가져오기
  const getKeywords = async () => {
    try {
      await Req.get("/keyword")
      .then((result) => {
        console.log(result.data)
        keyword.current = result.data; // 키워드 ref에 저장
        handleCategorize()
      });
    } catch(err){
      console.log(err);
    }
  } 

  // DB 입력하기
  const handleDBCreate = async (e) => {

      try{
        console.log('val', val);
        const CreateDataBase = await Req.post("/transaction", val);
        console.log(CreateDataBase);
      } catch(err){
        console.log(err);
      }
  };

  var arr=[];
  const handleCategorize = async () => {

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
    case '교통/통신비':
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

// 카테고리 분별 시스템
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

    const handleDataParsing = (e) => {

      var files = e.target.files, f = files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        let readedData = XLSX.read(data, {type: 'binary'});
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
        // setFileUploaded(dataParse);
        dataParse.shift()
        dataParse.shift()
        dataParse.shift()
        dataParse.shift()
        dataParse.pop()
        
        try { 
        // summary: { type:String },    
        // person:{ type:String },
        // memo:{ type:String },
        // withdrawal: { type:String },
        // deposit:{ type:String },
        // balance:{ type:String },
        // place:{ type:String },
        // etc:{ type:String }

        // 데이터 저장을 위한 전처리
        var newData = [...val];
        newData = dataParse.map((element, index) => {
          console.log(element)
          return {
            date: dayjs(element[0].trim()).toISOString(),
            summary: element[1].trim(),
            title: element[2].trim(),
            memo: element[3].trim(),
            withdrawal: element[4],
            deposit: element[5],
            balance: element[6],
            place: element[7].trim(),
            etc:element[8].trim(),
            category: categorizeExpense(element[2])
          };
        });

        // setVal
        setVal(newData)

      } catch (err) {
        console.log(err, "Err 확인 필요")
      }

    };
    reader.readAsBinaryString(f)
  }

  // 카테고리 분류
  const handleConfirm = (e) => {
    getKeywords()
    
  }

  function 기타 () {
    console.log(val, "val")
  }

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
        title="거래 내역 확인"
        subtitle="List of Contacts for Future Reference"
      />
      <input type="file" name="file" id="file" onChange={handleDataParsing} />
      <Button color="secondary" variant="contained" onClick={handleConfirm}>로그 확인</Button>
      <Button color="secondary" variant="contained" onClick={handleDBCreate}>서버에 저장</Button>
      <Button color="secondary" variant="contained" onClick={기타}>기타</Button>
      <Box
        m="10px 0 0 0"
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
        getRowId={ (row) => generateRandom() }/>
        </Box>
      </Box>
    );
  };

export default Upload;