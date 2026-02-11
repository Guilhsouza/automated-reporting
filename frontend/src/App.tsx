import './App.css'
import { helloWorld } from './services/apiHello'
import { useState } from 'react'
import login from './services/login'

function App() {
  const [api, setApi] = useState(null)

  const handleClick = async () => {
    try {
      const response = await helloWorld()
      return response
    } catch (e) {
      throw e
    }
  }
  const handleClickLogin = async () => {
    try {
      const response = await login()
      console.log(response.data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return (
    <>
      <button onClick={handleClick}>Clique aqui para gerar um relatório de impressões</button>
      <br />
      <button onClick={handleClickLogin} style={{ marginTop: '12px' }}>Faça login na plataforma</button>
    </>
  )
}

export default App
