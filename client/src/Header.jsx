import React from 'react';
import { FaCog } from 'react-icons/fa';
import { IoIosAddCircle } from "react-icons/io";
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';

export default function Header() {
  return (
    <Navbar className='nb bg-purple-500 mb-20' fluid rounded>
    <Button className='started bg-black'>Get started</Button>
      <NavbarBrand href="https://flowbite-react.com">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white ml-80">VManage</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        
        <NavbarToggle />
      </div>
      <div className="settings-icon ml-80 text-2xl">
      <FaCog />
    </div>
    <div className='add text-2xl'><IoIosAddCircle /></div>

    </Navbar>
  );
}

