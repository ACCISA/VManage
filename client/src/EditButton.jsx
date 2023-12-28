import React from 'react';
import { FaEdit } from 'react-icons/fa'; // Import the edit icon from a library like Font Awesome

const EditButton = ({ onClick }) => {
  return (
    <button className="edit-button" onClick={onClick}>
     Edit <FaEdit className='ml-2' />  </button>
  );
};

export default EditButton;
