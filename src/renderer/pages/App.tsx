import React, { useState } from 'react';
import './App.css';
import Button from '../components/Button'
import ClientListSelect from '../components/ClientListSelect'
import { Client, Post } from '../../utils/interfaces'
import logo from '../../public/2c-logo.png'

function App() {
    const [clientsData, setData] = useState(Array<Client>())
    const [clientsList, setList] = useState(Array<string>())
    const [client, setClient] = useState({} as Client)
  
    const handleSelectFile = async () => {
      const data = await window.electronAPI.openFile() as unknown as Client[]
      setList(data.map((client) => {return client.name}))
      setData(data)
    }
  
    const didChangeSelected = (selected: string) => {
      // quando um cliente for selecionado habilitar o botão de gerar PDF
      setClient(clientsData.filter((client) => {
        if (client.name === selected) {
          return client
        }
      })[0])
    }
  
    const handleMakePDF = async () => {
      const result = await window.electronAPI.makePDF(client)
      console.log(result)
    }
  
    const imgStyle = {
      width: '400px',
      marginTop: '-100px',
      marginBottom: '50px'
    };
  
    return (
      <>
        <div>
          <img style={imgStyle} src={logo}/>
        </div>
        <div>
          <Button onClick={handleSelectFile} text={"Selecionar arquivo"}/>
        </div>
        <div className="card">
          <ClientListSelect list={clientsList} didChangeSelected={didChangeSelected}/>
        </div>
        <div>
          <Button onClick={handleMakePDF} text={"Gerar PDF"}/>
        </div>
      </>
    )
  }
  
  
  export default App