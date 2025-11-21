import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const attendances = await db.attendance.findMany({
      include: {
        participant: {
          select: {
            nis: true,
            fullName: true,
            grade: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data for reporting
    const reportData = attendances.map(attendance => ({
      nis: attendance.participant.nis,
      nama_lengkap: attendance.participant.fullName,
      kelas: attendance.participant.grade,
      hari: attendance.day,
      sesi: attendance.sessionType,
      status: attendance.status,
      catatan: attendance.notes || '-',
      foto: attendance.photoUrl ? 'Ada' : 'Tidak ada',
      tanggal_absen: attendance.createdAt.toISOString().split('T')[0],
      waktu_absen: attendance.createdAt.toISOString().split('T')[1].split('.')[0]
    }))

    // Calculate summary statistics
    const summary = {
      total_absensi: attendances.length,
      hadir: attendances.filter(a => a.status === 'present').length,
      terlambat: attendances.filter(a => a.status === 'late').length,
      izin: attendances.filter(a => a.status === 'permission').length,
      tanpa_keterangan: attendances.filter(a => a.status === 'absent').length,
      dengan_foto: attendances.filter(a => a.photoUrl).length,
      tanpa_foto: attendances.filter(a => !a.photoUrl).length
    }

    return NextResponse.json({
      data: reportData,
      summary: summary
    })
  } catch (error) {
    console.error('Error generating attendance report:', error)
    return NextResponse.json(
      { error: 'Failed to generate attendance report' },
      { status: 500 }
    )
  }
}