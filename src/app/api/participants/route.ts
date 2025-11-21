import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const participants = await db.participant.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(participants)
  } catch (error) {
    console.error('Error fetching participants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    )
  }
}

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
      medicalHistory
    } = body

    // Validate required fields
    const requiredFields = [
      nis, fullName, gender, birthPlace, birthDate, 
      address, whatsapp, email, schoolName, grade, 
      parentName, parentPhone
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
        { error: 'NIS already registered' },
        { status: 400 }
      )
    }

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
        schoolName,
        grade,
        parentName,
        parentPhone,
        medicalHistory: medicalHistory || null
      }
    })

    return NextResponse.json(
      { 
        message: 'Registration successful', 
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
    console.error('Error creating participant:', error)
    return NextResponse.json(
      { error: 'Failed to create participant' },
      { status: 500 }
    )
  }
}