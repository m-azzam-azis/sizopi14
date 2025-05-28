import { NextResponse } from 'next/server';
import { Adopsi } from '@/db/models/adopsi';

const adopsiModel = new Adopsi();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      id_adopter, 
      id_hewan, 
      kontribusi_finansial, 
      adoption_period 
    } = body;

    if (!id_adopter || !id_hewan || !kontribusi_finansial || !adoption_period) {
      return NextResponse.json(
        { error: "Data adopsi tidak lengkap" },
        { status: 400 }
      );
    }

    if (isNaN(Number(kontribusi_finansial)) || Number(kontribusi_finansial) <= 0) {
      return NextResponse.json(
        { error: "Kontribusi finansial harus berupa angka positif" },
        { status: 400 }
      );
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + Number(adoption_period));

    // Periksa apakah hewan sudah diadopsi
    const existingAdopsi = await adopsiModel.getAdopsiByHewanId(id_hewan);
    
    if (existingAdopsi && 
        new Date(existingAdopsi.tgl_berhenti_adopsi) > new Date()) {
      return NextResponse.json(
        { error: "Hewan ini sudah diadopsi dan masih dalam periode adopsi" },
        { status: 409 }
      );
    }

    const adoptionData = {
        id_adopter,
        id_hewan,
        kontribusi_finansial: Number(kontribusi_finansial),
        status_pembayaran: 'Belum',
        tgl_mulai_adopsi: startDate,
        tgl_berhenti_adopsi: endDate
      };
  
      const created = await adopsiModel.createAdopsi(adoptionData);

    return NextResponse.json({
      success: true,
      message: "Adopsi berhasil didaftarkan",
      data: created
    }, { status: 201 });

  } catch (error) {
    console.error("Error registering adoption:", error);
    return NextResponse.json(
      { error: "Gagal mendaftarkan adopsi" },
      { status: 500 }
    );
  }
}