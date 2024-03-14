import { useState } from 'react';
import { Modal, Box, Typography, FormControl, InputLabel, 
  TextField, Button, Select, MenuItem, ButtonGroup } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Validation schema
const checkoutSchema = Yup.object().shape({
  category: Yup.string().required('Required'),
  keyword: Yup.string().required('Required'),
});

// Initial values
const initialValues = {
  category: '',
  keyword: '',
};

// Handle form submit
const handleFormSubmit = (values) => {
  console.log(values);
  // Handle form values here...
};

// Modal component
function MyModal({ open, handleClose, handleFormSubmit }) {

  const handleCloseModal = () => {
    handleClose()
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}>
          <Box 
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: '50%', // Adjust this to change the size of the modal
            maxWidth: '500px', // Adjust this to set the maximum width of the modal
          }}
        >
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Typography id="modal-title" variant="h6" component="h2">
                Category, Keyword를 업데이트 합니다.
              </Typography>
              <Box sx={{ minWidth: 120, mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="category">카테고리를 선택하세요</InputLabel>
                  <Select
                    labelId="category"
                    id="category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.category && Boolean(errors.category)}
                    helpertext={touched.category && errors.category}
                  >
                    <MenuItem value="식비">식비</MenuItem>
                    <MenuItem value="생활비">생활비</MenuItem>
                    <MenuItem value="주거비">주거비</MenuItem>
                    <MenuItem value="교통/통신비">교통/통신비</MenuItem>
                    <MenuItem value="고정지출">고정지출</MenuItem>
                    <MenuItem value="기타">기타</MenuItem>
                    <MenuItem value="문화생활/여가">문화생활/여가</MenuItem>
                    <MenuItem value="교육비">교육비</MenuItem>
                    <MenuItem value="의료비">의료비</MenuItem>
                  </Select>
                  <TextField
                    fullWidth
                    id="keyword"
                    name="keyword"
                    value={values.keyword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.keyword && Boolean(errors.keyword)}
                    helperText={touched.keyword && errors.keyword}
                  />
                </FormControl>
                <ButtonGroup variant="contained" sx={{ mt: 2 }}>
                  <Button 
                    type="submit" 
                    sx={{ bgcolor: '#AEC6CF' }} // Change this to the desired pastel color
                  >
                    Submit
                  </Button>
                  <Button 
                    onClick={handleClose} // Add this line to close the modal
                    sx={{ bgcolor: '#FF6961' }} // Change this to the desired pastel color
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </Box>
            </form>
          )}
        </Formik>
        </Box>
      </Box>
    </Modal>
  );
}

export default MyModal;