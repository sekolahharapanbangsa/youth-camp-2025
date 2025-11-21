import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const attendances = await db.attendance.findMany({
      include: {
        participant: {
          select: {
            nis: true,
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(attendances)
  } catch (error) {
    console.error('Error fetching attendances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendances' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    
    let body
    let photoFile = null
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle form data with photo
      const formData = await request.formData()
      body = {
        nis: formData.get('nis'),
        day: parseInt(formData.get('day')),
        sessionType: formData.get('sessionType')
      }
      photoFile = formData.get('photo')
    } else {
      // Handle JSON data (backward compatibility)
      body = await request.json()
    }
    
    const { nis, day, sessionType } = body
    
    // Validate required fields
    if (!nis || !day || !sessionType) {
      return NextResponse.json(
        { error: 'NIS, day, and sessionType are required' },
        { status: 400 }
      )
    }

    // Find participant by NIS
    const participant = await db.participant.findUnique({
      where: { nis }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    // Check if attendance already exists for this session
    const existingAttendance = await db.attendance.findFirst({
      where: {
        participantId: participant.id,
        day,
        sessionType
      }
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance already recorded for this session' },
        { status: 400 }
      )
    }

    // Prepare attendance data
    const attendanceData: any = {
      participantId: participant.id,
      day,
      sessionType,
      status: 'present'
    }

    // Add photo URL if photo was uploaded
    if (photoFile) {
      // In a real implementation, you would save the photo and get the URL
      // For now, we'll simulate the photo URL
      const photoUrl = `/api/attendance/photos/${participant.nis}-${day}-${sessionType}.jpg`
      attendanceData.photoUrl = photoUrl
      attendanceData.photoName = `${participant.nis}-${day}-${sessionType}.jpg`
    }

    const attendance = await db.attendance.create({
      data: attendanceData,
      include: {
        participant: {
          select: {
            nis: true,
            fullName: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Attendance recorded successfully', 
        attendance
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance' },
      { status: 500 }
    )
  }
}