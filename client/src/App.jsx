import axios from 'axios'
import { Route, Routes } from "react-router-dom"
import Layout from './Layout'; 
import Index from './pages/Index';
import  { RequireAuth }  from "react-auth-kit";
import Login from './pages/Login';
import Add from './pages/Add';
import Setting from './pages/Setting';

export default function App() {

  axios.defaults.baseURL = "http://localhost:8081";

  return (
    
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RequireAuth loginPath="/login">
          <Index />
        </RequireAuth>} />
        <Route path="/add" element={<RequireAuth loginPath="/login"><Add/></RequireAuth>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/setting" element={<RequireAuth loginPath="/login"><Setting/></RequireAuth>}/>
      </Route>
    </Routes>

  )
}

