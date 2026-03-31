// components/Modal.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface ModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  item: any;
}

const Modal: React.FC<ModalProps> = ({ openModal, setOpenModal, item }) => {
  return (
    <div className={`modal ${openModal ? 'open' : ''}`}>
  <div className="modal-content">
    {item && item.thumb ? (
      <Image src={item.thumb} alt="img" />
    ) : (
      <p>No hay imagen disponible</p>
    )}
    <div className="modal-details">
      <span>{item?.desc}</span>
      <h4>{item?.title}</h4>
    </div>
  </div>
</div>

  );
};

export default Modal;