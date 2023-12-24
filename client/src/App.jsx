import { useState } from 'react'
import axios from 'axios'

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
      <div className='flex justify-center content-center'>
        <button onClick={handleLaunchVM} className='bg-red-500 p-4'>
          Test Launch VM
        </button>
      </div>
    </>
  )
}

export default App
