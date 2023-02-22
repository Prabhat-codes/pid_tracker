import FileContext from "./FileContext";
import { useState } from "react";

const FileState = (props) => {
  const host = "http://localhost:5000"
  const FilesInitial = []
  const [Files, setFiles] = useState(FilesInitial)

  // Get all Files
  const getFiles = async () => {
    // API Call 
    const response = await fetch(`${host}/api/files/fetchfiles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3fSwiaWF0IjoxNjc2OTkxNDE3fQ.Bqw-nJePtvpablO8VcDo3qG2vOcT7cNiOysdjWA1fSs"
      }
    });
    const json = await response.json()
    console.log(json)
    setFiles(json)
  }

  // Add a File
  const addFile = async () => {
    // TODO: API Call
    // API Call 
    const response = await fetch(`${host}/api/Files/addFile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3fSwiaWF0IjoxNjc2OTkxNDE3fQ.Bqw-nJePtvpablO8VcDo3qG2vOcT7cNiOysdjWA1fSs"
      },
      body: JSON.stringify({title, description, tag})
    });
     

    console.log("Adding a new File")
    const File = {
      
    };
    setFiles(Files.concat(File))
  }

  // Delete a File
  const deleteFile = (id) => {
    // TODO: API Call
    console.log("Deleting the File with id" + id);
    const newFiles = Files.filter((File) => { return File._id !== id })
    setFiles(newFiles)
  }
  // Edit a File
//   const editFile = async (id, title, description, tag) => {
//     // API Call 
//     const response = await fetch(`${host}/api/Files/updateFile/${id}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzMWRjNWUzZTQwMzdjZDQ3MzRhMDY2In0sImlhdCI6MTYzMDY2OTU5Nn0.hJS0hx6I7ROugkqjL2CjrJuefA3pJi-IU5yGUbRHI4Q"
//       },
//       body: JSON.stringify({title, description, tag})
//     });
//     const json = response.json();

//     // Logic to edit in client
//     for (let index = 0; index < Files.length; index++) {
//       const element = Files[index];
//       if (element._id === id) {
//         element.title = title;
//         element.description = description;
//         element.tag = tag;
//       }

//     }
//   }

  return (
    <FileContext.Provider value={{ Files, addFile, deleteFile, editFile, getFiles }}>
      {props.children}
    </FileContext.Provider>
  )

}
export default FileState;