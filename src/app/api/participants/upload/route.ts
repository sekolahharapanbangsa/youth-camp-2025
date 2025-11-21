import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Only CSV, XLSX, or XLS files are allowed' },
        { status: 400 }
      )
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'File is empty or invalid' },
        { status: 400 }
      )
    }

    // Parse CSV header
    const headers = lines[0].split(',').map(h => h.trim())
    const expectedHeaders = ['nis', 'nama_lengkap', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'whatsapp', 'email', 'kelas', 'nama_orang_tua', 'no_telepon_orang_tua', 'riwayat_penyakit']
    
    // Validate headers
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h))
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingHeaders.join(', ')}` },
        { status: 400 }
      )
    }

    // Process data rows
    const dataRows = lines.slice(1)
    const results = []
    const errors = []

    for (let i = 0; i < dataRows.length; i++) {
      const values = dataRows[i].split(',').map(v => v.trim())
      
      if (values.length !== expectedHeaders.length) {
        errors.push(`Row ${i + 2}: Invalid number of columns`)
        continue
      }

      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = values[index] || ''
      })

      // Validate required fields
      const requiredFields = ['nis', 'nama_lengkap', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'whatsapp', 'email', 'kelas', 'nama_orang_tua', 'no_telepon_orang_tua']
      const missingFields = requiredFields.filter(field => !rowData[field])
      
      if (missingFields.length > 0) {
        errors.push(`Row ${i + 2}: Missing required fields: ${missingFields.join(', ')}`)
        continue
      }

      // Check if NIS already exists
      const existingParticipant = await db.participant.findUnique({
        where: { nis: rowData.nis }
      })

      if (existingParticipant) {
        errors.push(`Row ${i + 2}: NIS ${rowData.nis} already exists`)
        continue
      }

      try {
        const participant = await db.participant.create({
          data: {
            nis: rowData.nis,
            fullName: rowData.nama_lengkap,
            gender: rowData.jenis_kelamin,
            birthPlace: rowData.tempat_lahir,
            birthDate: new Date(rowData.tanggal_lahir),
            address: rowData.alamat,
            whatsapp: rowData.whatsapp,
            email: rowData.email,
            schoolName: "SMP & SMA Harapan Bangsa Modernhill",
            grade: rowData.kelas,
            parentName: rowData.nama_orang_tua,
            parentPhone: rowData.no_telepon_orang_tua,
            medicalHistory: rowData.riwayat_penyakit || null,
            status: 'approved' // Auto-approve uploaded students
          }
        })
        
        results.push({
          row: i + 2,
          nis: rowData.nis,
          name: rowData.nama_lengkap,
          status: 'success',
          message: 'Student added successfully'
        })
      } catch (error) {
        errors.push(`Row ${i + 2}: Failed to save student data`)
      }
    }

    return NextResponse.json({
      message: 'File processing completed',
      summary: {
        totalRows: dataRows.length,
        successful: results.length,
        failed: errors.length
      },
      results,
      errors
    })
  } catch (error) {
    console.error('Error processing upload:', error)
    return NextResponse.json(
      { error: 'Failed to process uploaded file' },
      { status: 500 }
    )
  }
}