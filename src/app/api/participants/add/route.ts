import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      nis,
      fullName,
      gender,
      birthPlace,
      birthDate,
      address,
      whatsapp,
      email,
      schoolName,
      grade,
      parentName,
      parentPhone,
      medicalHistory,
      shirtSize
    } = body

    // Validate required fields
    const requiredFields = [
      nis, fullName, gender, birthPlace, birthDate, 
      address, whatsapp, email, schoolName, grade, 
      parentName, parentPhone, shirtSize
    ]

    if (requiredFields.some(field => !field)) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    // Check if NIS already exists
    const existingParticipant = await db.participant.findUnique({
      where: { nis }
    })

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'NIS already exists' },
        { status: 400 }
      )
    }

    // Auto-approve manually added students
    const participant = await db.participant.create({
      data: {
        nis,
        fullName,
        gender,
        birthPlace,
        birthDate: new Date(birthDate),
        address,
        whatsapp,
        email,
        schoolName: schoolName || "SMP & SMA Harapan Bangsa Modernhill",
        grade,
        parentName,
        parentPhone,
        medicalHistory: medicalHistory || null,
        shirtSize,
        status: 'approved' // Auto-approve manually added students
      }
    })

    return NextResponse.json(
      { 
        message: 'Student data added successfully', 
        participant: {
          id: participant.id,
          nis: participant.nis,
          fullName: participant.fullName,
          status: participant.status
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding student:', error)
    return NextResponse.json(
      { error: 'Failed to add student data' },
      { status: 500 }
    )
  }
}