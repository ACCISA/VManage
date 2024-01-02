import React from 'react';
import { FaCog } from 'react-icons/fa';
import { IoIosAddCircle } from "react-icons/io";
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  
  const navigate = useNavigate();
  
  const handleRedirectAdd = () => {
    navigate("/add")
  }

  return (
    <Navbar className='nb bg-blacktext-3xl-500 mb-20' fluid rounded>
      <Button onClick={handleRedirectAdd} className=' bg-black text-white font-semibold'>Add VM</Button>
      <a href="/" className='text-white'>VManage</a>
      <div className="flex md:order-2">
        
        <NavbarToggle />
      </div>
      <div className="settings-icon ml-80 text-2xl text-white">
        <FaCog />
      </div>

    </Navbar>
  );
}

