import { useState, useRef } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import * as XLSX from 'xlsx';
import { columns } from "../../data/columns";
import Req from "../../config/axios";

const Upload = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [ val, setVal ] = useState([]);
    const keyword = useRef();

    const handleConfirm = (e) => {

      handleGeKeyword()

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
    
    var arr=[];

    const handleGeKeyword = async () => {

      try {
        await Req.get("/keyword")
        .then((result) => {
          keyword.current = result.data;
          console.log(keyword.current)

        });
      } catch(err){
        console.log(err);
      }

      arr.식비 = [];
      arr.생활비 = [];
      arr.교통비 = [];
      arr.고정지출 = [];
      arr.미분류 = [];

      keyword.current.map( (element) => {
        
        switch(element.category) {
          case '식비': 
            arr.식비.push(element.word);
            break;
          case '생활비': 
            arr.생활비.push(element.word);
            break;
          case '교통비':
            arr.교통비.push(element.word);
            break;
          case "고정지출": 
            arr.고정지출.push(element.word);
          break;
          default:
            arr.미분류.push(element.word);
          break;         
        }
        return null;
      })
      
      console.log(arr)
    }

    const handleReset = () => {
      
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

export default Upload;