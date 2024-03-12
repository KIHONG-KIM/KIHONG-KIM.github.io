import { useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import Req from "../../config/axios";

const DataCenter = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ data, setData ]  = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");

  const columns = [
    {
      field: "category",
      headerName: "카테고리",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "word",
      headerName: "단어",
      flex: 0.5,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
    },
    {
      field: "phone",
      headerName: "수정하기",
      flex: 0.5,
      renderCell: ({ row: { _id } }) => {
        return (
            <Button variant="contained" color="primary" onClick={() => handleEdit(_id)}>수정</Button>
        );
      }
    },
    {
      field: "email",
      headerName: "삭제하기",
      flex: 0.5,
      renderCell: ({ row: { _id } }) => {
        return (
          <Button variant="contained" color="error" onClick={() => handleDelete(_id)}>삭제</Button>
        );
      }
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  // 키워드 콜렉션에서 가져오기
  const getKeywords = async () => {
    try {
      await Req.get("/keyword")
      .then((result) => {
        console.log(result.data)
        // keyword.current = result.data; // 키워드 ref에 저장
        var 임시저장소 = [...result.data];
        setData(임시저장소);

      });
    } catch(err){
      console.log(err);
    }
  } 

  const handleDelete = (id) => {
    console.log("수정하기", id); 
  }

  const handleEditedText = (text) => {  
    console.log("텍스트 입력", text); 
  }

  const handleEdit = (id) => {
    setIsEditing(true);
    console.log("수정하기", id); 
}

const handleCancel = () => {
    setIsEditing(false);
    console.log("취소하기"); 
}

const handleSave = (id) => {
    setIsEditing(false);
    console.log("저장하기", id); 
}

  return (
    <Box m="20px">
      <Header title="Data Center" subtitle="Managing data" />
      <Button color="secondary" variant="contained" onClick={getKeywords}> 테스트 버튼 </Button>
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
        <DataGrid checkboxSelection rows={data} 
                columns={columns}
                getRowId={ (row) => row._id }
                />
      </Box>
    </Box>
  );
};

export default DataCenter;
