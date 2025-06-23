import { Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import Simulator from './pages/Simulator'
import Navbar from './components/common/Navbar'
import AboutUs from './pages/AboutUs'
import Footer from './components/common/Footer'
import Learn from './pages/Learn'

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/learn' element={<Learn/>}/>
        <Route path='/simulator' element={<Simulator/>}/>
        <Route path='/about' element={<AboutUs/>}/>
      </Routes>

      <Footer />

      <ToastContainer />
    </div>
  )
}

export default App