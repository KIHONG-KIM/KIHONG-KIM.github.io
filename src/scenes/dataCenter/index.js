import { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button, TextField, Modal, 
    InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Req from "../../config/axios";
import { Formik } from "formik";
import * as yup from "yup";
import MyModal from "../../components/Modal";

const DataCenter = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState([]);
  const [id, setId] = useState('');

  const handleOpen = (_id) => {
    setOpen(true);
    setId(_id);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const styleText = {
    display: "block",
    width: 300,
    placeholder: "입력하세요",
    marginTop: 1,
    marginBottom: 5
}

  const columns = [
    {
      field: "category",
      headerName: "카테고리",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "word",
      headerName: "단어",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "수정하기",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { _id } }) => {
            return (
                <div>
                    <Button variant="contained" color="primary" onClick={() =>handleOpen(_id)}>수정</Button>
                </div>
            );
        }
    },
    {
      field: "email",
      headerName: "삭제하기",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { _id } }) => {
        return (
          <>
            <Button variant="contained" color="error" onClick={() => handleDelete(_id)}>삭제</Button>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    getKeywords();
  }, [])

  // axios get 키워드 DB가져오기
  const getKeywords = async () => {
    try {
      const result = await Req.get("/keyword")
     
        console.log(result.data)
        var 임시저장소 = [...result.data];
        setKeyword(임시저장소);

    } catch(err){
      console.log(err);
    }
  }

    // axios get 키워드 DB업데이트
    const updateKeywords = async (data) => {
      try {
        const data = await Req.post("/keyword", data)
        console.log(data)
      } catch(err){
        console.log(err);
      }
    }

  // Axios delete 키워드 삭제
  const DeleteKeywords = async (id) => {
    try {
      const data = await Req.delete("/keyword", {
        data: { _id: id }
      ,
      withCredentials : true,
    })
    
      console.log(data)
      const newData = keyword.filter(item => item._id !== id);
      setKeyword(newData);

    } catch(err){
      console.log(err);
    }
  }

  // submit function
  const handleFormSubmit = async (values) => {
    console.log(values, "values" , id , "id")

    const data = {
      _id: id,
      category: values.category,
      word: values.keyword
    }

    try {
      const result = await Req.post("/keywordUpdate", data)
      console.log(result)
    } catch(err){
      console.log(err);
    }
  };

  // delete function
  const handleDelete = (id) => {
    DeleteKeywords(id)
    console.log("삭제하기", id); 
  }

// Button
const handleTest = () => {
  console.log(open, keyword, "test")
}

const handleConfirm = (id) => {
  updateKeywords(id)
}



  return (
    <Box m="20px">
      <Header title="Data Center" subtitle="Managing data" />
      <Button color="secondary" variant="contained" onClick={handleTest}>테스트 버튼</Button>
      <Button color="secondary" variant="contained" onSubmit={handleConfirm}>확인 버튼</Button>
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
        }}
      >
      <DataGrid checkboxSelection rows={keyword} 
              columns={columns}
              getRowId={ (rows) => rows._id }
              />
      </Box>
      <MyModal open={open} handleClose={handleClose} handleFormSubmit={handleFormSubmit} />
  </Box>
  );
};

export default DataCenter;
