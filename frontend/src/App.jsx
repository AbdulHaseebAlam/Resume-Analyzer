import React from 'react'
import { Demo } from "./Components/Demo.jsx";
import { Hero } from "./Components/Hero.jsx";
import  OrdersTable  from "./Components/OrdersTable.jsx";
import { useEffect, useState } from 'react';
import axios from 'axios'

import './App.css';
import './Components/static/style.css';

const App = () => {

  const [getMessage, setGetMessage] = useState({})
  const [pdfs, setPdf] = useState([])  

  useEffect(()=>{
    fetch('/flask/hello').then(response => {
      console.log("SUCCESS", response)
      setGetMessage(response)
    }).catch(error => {
      console.log(error)
    })

    /* axios.get('https://react-flask-tutorial.herokuapp.com/flask/hello').then(response => {
      console.log("SUCCESS", response)
      setGetMessage(response)
    }).catch(error => {
      console.log(error)
    }) */

    /* axios.get('http://localhost:5000/flask/hello').then(response => {
      console.log("SUCCESS", response)
      console.log("Wow")
      console.log(getMessage.data)
      setGetMessage(response)
    }).catch(error => {
      console.log(error)
    }) */

  }, [])

  const insertedPdf = (pdf) =>{
    const new_pdfs = [...pdfs,pdf]
    setArticles(pdf)
  }

  const handleFileChange = (text) => {
    // Handle the file change here
    console.log('File text:', text);
  };

  return (
    <main>
      <div className="main">
        <div className="gradient"></div>
      </div>

      <div className="app">
        <Hero />
        <Demo onFileChange={handleFileChange} insertedPdf={insertedPdf}/>
        <OrdersTable />
      </div>
    </main>
  )
}

export default App