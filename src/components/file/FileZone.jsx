import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const FileZone = (props) => {
  const [updateFile, setUpdateFile] = useState({});
  const [files, setFiles] = useState([]);

  const { title, url, existingFilesArray, storeSuccess, removeFile } = props;
  // console.log(title, url, existingFilesArray, storeSuccess, removeFile);
  useEffect(() => {
    const cloneFiles = [...files];
    for (let i = 0; i < cloneFiles.length; i++) {
      if (cloneFiles[i].name === updateFile.name) {
        cloneFiles[i][updateFile.type] = updateFile.value;
        cloneFiles[i]["uploaded_name"] = updateFile.uploaded_name;
        break;
      }
    }
    setFiles(cloneFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFile]);

  useEffect(() => {
    if (existingFilesArray?.length > 0) {
      setFiles(existingFilesArray);
    }
  }, [existingFilesArray]);

  const handelRemove = (name, index) => {
    let newFileArray = [...files];
    newFileArray.splice(index, 1);
    setFiles(newFileArray);
    removeFile(name);
  };

  const isFileExits = (fileName) => {
    return files.find((single) => fileName === single.name);
  };

  const fileUpload = async (fileArrayOfObject, index = 0) => {
    let fileObject = fileArrayOfObject[index];
    const final_url = process.env.REACT_APP_API_BASE_URL + url;
    const formData = new FormData();
    formData.append("file", fileObject);

    try {
      const response = await axios.post(final_url, formData);

      if (response.data.success) {
        setUpdateFile({
          name: fileObject.name,
          type: "uploading",
          value: false,
          uploaded_name: response.data.filename,
        });

        storeSuccess(response.data.url);
      } else {
        setUpdateFile({
          name: fileObject.name,
          type: "failed_upload",
          value: true,
          uploading: false,
        });
      }
    } catch (error) {
      setUpdateFile({
        name: fileObject.name,
        type: "failed_upload",
        value: true,
        uploading: false,
      });
    }

    if (index + 1 < fileArrayOfObject?.length) {
      fileUpload(fileArrayOfObject, index + 1);
    }
  };

  const handleFiles = (e) => {
    const inputFiles = e.target.files;
    let fileArray = [];
    let allFileArray = [];
    inputFiles.forEach((element) => {
      if (!isFileExits(element.name)) {
        fileArray.push({
          name: element.name,
          url: URL.createObjectURL(element),
          file: element,
          uploading: true,
          type: element.type,
          uploaded_name: "",
        });
        allFileArray.push(element);
      }
    });
    setFiles(files.concat(fileArray));
    fileUpload(allFileArray);

    e.target.value = "";
  };

  return (
    <>
      <div className="row">
        <h5>{title}</h5>
        <div className="col-md-12">
          <div className="row">
            <input type="file" multiple onChange={handleFiles} />
          </div>
        </div>
        <br />
        <br />
        <div className="row">
          {files &&
            files.map((objectPhoto, index) => (
              <div className="col-md-2" key={index}>
                <div className="" style={{ position: "relative" }}>
                  {objectPhoto.type !== "application/pdf" &&
                    objectPhoto.type !== "pdf" && (
                      <img
                        src={objectPhoto.url}
                        alt=""
                        height={200}
                        width={160}
                      />
                    )}

                  {(objectPhoto.type === "application/pdf" ||
                    objectPhoto.type === "pdf") && (
                    <iframe
                      src={objectPhoto.url}
                      title={objectPhoto.name}
                      frameBorder="0"
                      height={200}
                      width={160}
                    ></iframe>
                  )}

                  <div
                    style={{
                      position: "absolute",
                      left: "40%",
                      top: "45%",
                    }}
                  >
                    {objectPhoto.uploading && (
                      <Spinner animation="border" size="sm" />
                    )}
                    {objectPhoto.failed_upload && (
                      <CancelIcon fontSize="large" />
                    )}
                  </div>

                  <p
                    style={{
                      color: "red",
                      position: "absolute",
                      right: "0",
                      top: "0",
                      cursor: "pointer",
                    }}
                    onClick={(e) =>
                      handelRemove(objectPhoto.uploaded_name, index)
                    }
                  >
                    <CancelIcon />
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default FileZone;
