import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUploader = ({ endpoint }: { endpoint: string }) => {
  const uploadFile = async file => {
    const data = new FormData();
    data.append("importFile", file);

    fetch(endpoint, {
      method: "POST",
      body: data
    })
      .then(data => {
        Promise.resolve();
      })
      .catch(error => {
        Promise.reject(" file upload failed");
      });
  };

  const handleFileUpload = event => {
    uploadFile(event.target.files[0])
      .then(data => {
        // INFORM USER
        toast(" Import successfull");
      })
      .catch(error => {
        toast(" Failed to import data");
      });
  };
  return (
    <>
      <Button
        variant="contained"
        color="default"
        startIcon={<CloudUploadIcon />}
      >
        <input type="file" onChange={handleFileUpload} />
      </Button>
      <ToastContainer />
    </>
  );
};

export default FileUploader;
