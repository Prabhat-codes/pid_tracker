import React, {useContext, useEffect} from 'react'
import FileContext from '../context/files/FileContext';
// import Fileitem from './Fileitem';


const Files = () => {
    const context = useContext(FileContext);
    const {Files, getFiles} = context;
    useEffect(() => {
        getFiles()
    }, [])
    return (
        <>
        
        <div className="row my-3">
            <h2>You Files</h2> 
            {Files.map((File)=>{
                return <p>{File.fileName}</p> 
            })}
            </div>
        </>
    )
}

export default Files