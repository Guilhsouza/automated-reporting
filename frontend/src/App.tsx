import './App.css'
import loginAndGetData from './services/loginAndGetData'

function App() {

  const handleClickLoginGetData = async () => {
    try {
      const response = await loginAndGetData()

      return response.data
    } catch (e) {
      throw e
    }
  }

  return (
    <div className='bg-blueGV w-lg flex flex-col h-96 rounded-lg'>
      <div>
        <h3 className='text-white font-semibold text-2xl mt-8 mb-14'>PAINEL DE RELATÓRIOS</h3>
      </div>

      <div className=''>
        <button onClick={handleClickLoginGetData} className='text-black w-96'>Faça um <u>Relatório das Impressões</u></button>
        <button className='text-black w-96 my-5'>Faça um <u>Relatório do Portal Freshdesk</u></button>
        <button className='text-black w-96'>Faça um <u>Relatório do Consumo de Dados</u> de Internet</button>
      </div>
    </div>
  )
}

export default App
