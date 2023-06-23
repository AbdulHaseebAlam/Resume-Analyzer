import React from 'react'
import { useState, useEffect } from 'react'
import { copy, linkIcon, loader, tick } from "../assets";
//import { FileReader } from 'react';
import APIService from './APIService.jsx';
import './static/style.css'
import './OrdersTable.jsx'
import OrdersTable from './OrdersTable.jsx';


export const Demo = (props) =>  {

  /* const [article, setArticle] = useState({
    url: "",
    summary: "",
  }); */

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [pdfFile, setPdfFile] = useState(null);


  const handleStateChange = (newValue) => {
    setMyState(newValue);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (pdfFile) {
      APIService.sendPdfAndQuery(pdfFile, query)
        .then((response) => {
          setLoading(false);
          setResult(response.data.result);
          // setResults(response.data.result);
        })
        .catch((error) => {
          setLoading(false);
          console.log('Error:', error);
        });
    } else {
      APIService.sendQuery(query)
        .then((response) => {
          setLoading(false);
          setResult(response.data.result);
          //setResults(response.data.result);
        })
        .catch((error) => {
          setLoading(false);
          console.log('Error:', error);
        });
    }


    //setResults(result); // Pass the updated result to app.jsx

    /* if(result){
      APIService.sendQueryResult(result)
      .then((response) => {
        setLoading(false);
        setResult(response.data.result);
      })
      .catch((error) => {
        setLoading(false);
        console.log('Error:', error);
      });
    } */
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const InsertPdf = () =>{
    APIService.InsertPdf(pdfFile)
    .then((response) => props.insertedPdf(response))
    .catch(error => console.log('error',error))
  }


  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setPdfFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  /* console.log("This Is File", file); */
  return (
    <div>
    <section className='mt-16 w-full max-w-xl mx-auto'>

      <div className='flex flex-col w-full gap-2'>
        <form className='relative flex justify-center items-center' onSubmit={handleSubmit}>
          <img src={linkIcon} alt="link_icon" className='absolute left-0 my-2 ml-3 w-5' />

          {/* <input
            type="text"
            placeholder='Enter SQL Query' 
            value={description}
            onChange={(e) => setQuery(e.target.value)} required className='url_input peer' />
          <button className="Btn" type="submit">
            <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg>
            </div>
            <div className="text">Submit</div>
          </button> */}
          
          <input
          type="text"
          placeholder='Enter SQL Query'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          className='url_input peer'
        />

        <button className="Btn" type="submit" disabled={loading}>
          {loading ? (
            <div className="loader">
              <img src={loader} alt="loader" />
            </div>
          ) : (
            <>
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
              </div>
              <div className="text">Submit</div>
            </>
          )}
        </button>


        </form>

        <form>
        <div
            className="flex items-center justify-center w-full"
            onDrop={handleDrop}
            onDragOver={handleDragOver} >
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-400">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-700">PDF's Only</p>
              </div>
              <input id="dropzone-file" type="file" onChange={handleFileChange} className="hidden" accept=".pdf"/>
            </label>
          </div>
        </form>
        {result && (
        <div className="mt-4">
          <h3>Result:</h3>
          <pre>{result}</pre>
        </div>
      )}

      </div>
    </section>
    <OrdersTable result={result || null} />
    </div>
  )
};