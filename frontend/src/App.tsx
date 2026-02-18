import './App.css'
import logo from '/LOGO-COLOR-PNG-1024x274.png'
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
    <>
      <div className='flex justify-center mb-8'>
        <img src={logo}
          alt="logo"
          width={200}
          height={200}
        />
      </div>

      <div className='bg-blueGV pb-6 md:pb-0 md:w-lg flex flex-col md:h-96 rounded-lg'>
        <div>
          <h3 className='text-white font-semibold text-lg md:text-2xl mt-8 mb-14'>PAINEL DE RELATÓRIOS</h3>
        </div>

        <div className=''>
          <button onClick={handleClickLoginGetData} aria-label='Faça um Relatório das Impressões' className='text-black w-72 md:w-96'>Relatório de Impressões</button>
          <button aria-label='Faça um Relatório do Portal Freshdesk' className='text-black w-72 md:w-96 my-5'>Relatório do Portal Freshdesk</button>
          <button aria-label='Faça um Relatório do Consumo de Dados de Internet' className='text-black w-72 md:w-96'>Relatório do Consumo de Dados</button>
        </div>
      </div>
    </>
  )
}

export default App
