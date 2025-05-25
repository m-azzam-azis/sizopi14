import React from 'react'
import AdopterRiwayatModule from '@/modules/AdopterRiwayatModule'
import { Navbar } from "@/components/layout/Navbar";

const AdopterRiwayatPage = () => {
  return (
    <>
    <Navbar />
    <div className="pt-24">
      <AdopterRiwayatModule />
    </div>
  </>
);
}

export default AdopterRiwayatPage