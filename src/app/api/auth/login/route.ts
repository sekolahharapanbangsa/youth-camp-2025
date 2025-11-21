import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nis } = body

    if (!nis) {
      return NextResponse.json(
        { error: 'NIS is required' },
        { status: 400 }
      )
    }

    const participant = await db.participant.findUnique({
      where: { nis },
      include: {
        attendances: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    if (participant.status !== 'approved') {
      return NextResponse.json(
        { error: 'Registration not approved yet' },
        { status: 403 }
      )
    }

    // Return participant data without sensitive information
    const { attendances, ...participantData } = participant
    
    return NextResponse.json({
      message: 'Login successful',
      participant: {
        id: participantData.id,
        nis: participantData.nis,
        fullName: participantData.fullName,
        schoolName: participantData.schoolName,
        status: participantData.status
      },
      attendances
    })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}