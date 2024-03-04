import { useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import * as XLSX from 'xlsx';
import { mockDataContacts } from "../../data/mockData";
import { columns } from "../../data/columns";
import Req from "../../config/axios";

const DataCenter = () => {

    let column = [
      {
        id: 1,
        date: 3,
        summary: "John Smith",
        person: "jonsmith@gmail.com",
        memo: '35234',
        withdrawal: 10000,
        deposit: 10000,
        balance: 10000,
        place: "10001",
        etc: '123512',
      }
    ]

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [ val, setVal ] = useState([]);

    const handleConfirm = (e) => {
      console.log("val:", val)
      console.log("column", column)
      console.log("mockDataContacts", mockDataContacts)
    }

    const handleDBCreate = async (e) => {

        try{
          console.log('val', val);
          const CreateDataBase = await Req.post("/transaction", val);
          console.log(CreateDataBase);
        } catch(err){
          console.log(err);
        }
    };

    const handleReset = () => {
      
    }

  //// 카테고리 분별 시스템
  function categorizeExpense(item) {

    const categories = {
        식비 : ['정육점', '피자', '식당', '카페', '아이스크림', '공차', '마트', '세븐일레븐'],
        생활비 : ['영화', '공연', '축구', '옷', '신발', '가방', '병원', '약국', '학원', '교재' ],
        교통비 : ['택시', '버스', '전철', '주유소', 'HIPASS', ],
        고정지출 : ['인터넷', '휴대폰', 'SKT', 'KT', 'LGT', '전세', '월세', '아파트', '빌라', '원룸', '가스', '전기', '수도']
    }

    let category;

    for (const key in categories) {
        if (categories[key].some(word => item.includes(word))) {
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
        newData = dataParse.map(function(element, index) {
          return {
            date: element[0].trim(),
            summary: element[1].trim(),
            title: element[2].trim(),
            memo: element[3].trim(),
            withdrawal: element[4],
            deposit: element[5],
            balance: element[6],
            place: element[7].trim(),
            etc:element[8].trim(),
            category: categorizeExpense(element[2].trim())
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
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <input type="file" name="file" id="file" onChange={handleDataParsing} />
      <Button color="secondary" variant="contained" onClick={handleConfirm}>로그 확인</Button>
      <Button color="secondary" variant="contained" onClick={handleDBCreate}>서버에 저장</Button>
      <Button color="secondary" variant="contained" onClick={handleReset}>기타</Button>
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

export default DataCenter;