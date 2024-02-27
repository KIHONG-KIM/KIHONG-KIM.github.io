import axios from 'axios';

const Req = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      "Content-Type": "application/json",
    },
  //   headers: {
  //     "Content-Type": `application/json;charset=UTF-8`,
  //     "Accept": "application/json",
  //     "Authorization": "true",
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
  //     "Access-Control-Allow-Headers": "Content-Type",
  //     'Access-Control-Allow-Credentials':"true",

  // }
  });
  
export default Req;