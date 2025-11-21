import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const participants = await db.participant.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        attendances: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    // Transform data for export
    const exportData = participants.map(participant => ({
      nis: participant.nis,
      nama_lengkap: participant.fullName,
      jenis_kelamin: participant.gender,
      tempat_lahir: participant.birthPlace,
      tanggal_lahir: participant.birthDate.toISOString().split('T')[0],
      alamat: participant.address,
      whatsapp: participant.whatsapp,
      email: participant.email,
      sekolah: participant.schoolName,
      kelas: participant.grade,
      nama_orang_tua: participant.parentName,
      telepon_orang_tua: participant.parentPhone,
      riwayat_penyakit: participant.medicalHistory || '-',
      status: participant.status,
      total_kehadiran: participant.attendances.length,
      tanggal_daftar: participant.createdAt.toISOString().split('T')[0]
    }))

    return NextResponse.json(exportData)
  } catch (error) {
    console.error('Error exporting participants:', error)
    return NextResponse.json(
      { error: 'Failed to export participants' },
      { status: 500 }
    )
  }
}