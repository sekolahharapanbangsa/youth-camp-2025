import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get total participants
    const totalParticipants = await db.participant.count()

    // Get participants by status
    const pendingParticipants = await db.participant.count({
      where: { status: 'pending' }
    })
    
    const approvedParticipants = await db.participant.count({
      where: { status: 'approved' }
    })

    // Get today's attendance
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayAttendances = await db.attendance.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    // Get attendance summary
    const presentCount = await db.attendance.count({
      where: { status: 'present' }
    })

    const absentCount = await db.attendance.count({
      where: { status: 'absent' }
    })

    const lateCount = await db.attendance.count({
      where: { status: 'late' }
    })

    const permissionCount = await db.attendance.count({
      where: { status: 'permission' }
    })

    // Get recent registrations
    const recentRegistrations = await db.participant.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        nis: true,
        fullName: true,
        schoolName: true,
        status: true,
        createdAt: true
      }
    })

    // Get today's attendance details
    const todayAttendanceDetails = await db.attendance.findMany({
      where: {
        createdAt: {
          gte: today
        }
      },
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
      },
      take: 10
    })

    const attendanceRate = totalParticipants > 0 
      ? Math.round((presentCount / (totalParticipants * 6)) * 100) // 6 sessions total (3 days x 2 sessions)
      : 0

    return NextResponse.json({
      statistics: {
        totalParticipants,
        pendingParticipants,
        approvedParticipants,
        todayAttendances,
        attendanceRate
      },
      attendanceSummary: {
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        permission: permissionCount
      },
      recentRegistrations,
      todayAttendanceDetails
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}