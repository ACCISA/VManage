import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleLaunchVM = () => {
    console.log("Attempting to launch VM");
    axios.post('http://localhost:8080/launch', { "name": "example" }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }


  return (
    <>
      <button onClick={handleLaunchVM}>
        Test Launch VM
      </button>
    </>
  )
}

export default App
