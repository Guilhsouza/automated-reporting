import './App.css'
import { helloWorld } from './services/apiHello'
import loginAndGetData from './services/login'

function App() {
  const handleClick = async () => {
    try {
      const response = await helloWorld()
      return response
    } catch (e) {
      throw e
    }
  }
  const handleClickLoginGetData = async () => {
    try {
      const response = await loginAndGetData()

      return response.data
    } catch (e) {
      throw e
    }
  }

  return (
    <>
      <button onClick={handleClick}>Clique aqui para gerar um relatório de impressões</button>
      <br />
      <button onClick={handleClickLoginGetData} style={{ marginTop: '12px' }}>Faça login na plataforma</button>
    </>
  )
}

export default App
