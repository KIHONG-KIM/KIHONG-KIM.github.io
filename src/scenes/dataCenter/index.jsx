import * as XLSX from 'xlsx';
import cheerio from 'cheerio';

const DataCenter = () => {

    const handleUpload = (e) => {
      e.preventDefault();
  
      var files = e.target.files
      var f = files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
          var data = e.target.result;
          let readedData = XLSX.read(data, {type: 'binary'});
          const wsname = readedData.SheetNames[0];
          const ws = readedData.Sheets[wsname];
  
          /* Convert array to json*/
          const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
          // setFileUploaded(dataParse);
          console.log(dataParse);
      };
      reader.readAsBinaryString(f)
  }

    return(
      <div>
        <input type="file" name="file" id="file" onChange={handleUpload}></input>
      </div>
    )

  }

  export default DataCenter;