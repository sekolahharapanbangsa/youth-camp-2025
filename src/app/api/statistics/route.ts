import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get all participants
    const participants = await db.participant.findMany({
      include: {
        attendances: true
      }
    })

    // Get all attendances
    const attendances = await db.attendance.findMany({
      include: {
        participant: {
          select: {
            grade: true,
            gender: true
          }
        }
      }
    })

    // Basic statistics
    const totalParticipants = participants.length
    const totalAttendances = attendances.length
    const participantsWithAttendance = participants.filter(p => p.attendances.length > 0).length

    // Attendance status breakdown
    const attendanceByStatus = {
      present: attendances.filter(a => a.status === 'present').length,
      late: attendances.filter(a => a.status === 'late').length,
      permission: attendances.filter(a => a.status === 'permission').length,
      absent: attendances.filter(a => a.status === 'absent').length
    }

    // Attendance by day
    const attendanceByDay = [1, 2, 3].map(day => ({
      day: day,
      checkin: attendances.filter(a => a.day === day && a.sessionType === 'checkin').length,
      checkout: attendances.filter(a => a.day === day && a.sessionType === 'checkout').length,
      total: attendances.filter(a => a.day === day).length
    }))

    // Attendance by session type
    const attendanceBySession = {
      checkin: attendances.filter(a => a.sessionType === 'checkin').length,
      checkout: attendances.filter(a => a.sessionType === 'checkout').length
    }

    // Statistics by grade
    const gradeStats = {}
    participants.forEach(participant => {
      const grade = participant.grade
      if (!gradeStats[grade]) {
        gradeStats[grade] = {
          total: 0,
          withAttendance: 0,
          totalAttendances: 0
        }
      }
      gradeStats[grade].total++
      if (participant.attendances.length > 0) {
        gradeStats[grade].withAttendance++
      }
      gradeStats[grade].totalAttendances += participant.attendances.length
    })

    // Statistics by gender
    const genderStats = {
      L: {
        total: participants.filter(p => p.gender === 'L').length,
        withAttendance: participants.filter(p => p.gender === 'L' && p.attendances.length > 0).length,
        totalAttendances: attendances.filter(a => a.participant.gender === 'L').length
      },
      P: {
        total: participants.filter(p => p.gender === 'P').length,
        withAttendance: participants.filter(p => p.gender === 'P' && p.attendances.length > 0).length,
        totalAttendances: attendances.filter(a => a.participant.gender === 'P').length
      }
    }

    // Photo statistics
    const photoStats = {
      withPhoto: attendances.filter(a => a.photoUrl).length,
      withoutPhoto: attendances.filter(a => !a.photoUrl).length,
      photoPercentage: totalAttendances > 0 ? 
        Math.round((attendances.filter(a => a.photoUrl).length / totalAttendances) * 100) : 0
    }

    // Attendance rate calculation
    const expectedAttendancesPerParticipant = 6 // 3 days × 2 sessions
    const totalExpectedAttendances = totalParticipants * expectedAttendancesPerParticipant
    const attendanceRate = totalExpectedAttendances > 0 ? 
      Math.round((totalAttendances / totalExpectedAttendances) * 100) : 0

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentAttendances = attendances.filter(a => a.createdAt >= sevenDaysAgo)
    const recentRegistrations = participants.filter(p => p.createdAt >= sevenDaysAgo)

    const completeStatistics = {
      overview: {
        totalParticipants,
        totalAttendances,
        participantsWithAttendance,
        attendanceRate,
        recentRegistrations: recentRegistrations.length,
        recentAttendances: recentAttendances.length
      },
      attendanceBreakdown: attendanceByStatus,
      attendanceByDay,
      attendanceBySession,
      gradeStatistics: Object.entries(gradeStats).map(([grade, stats]) => ({
        grade,
        ...stats,
        attendanceRate: stats.total > 0 ? Math.round((stats.withAttendance / stats.total) * 100) : 0
      })),
      genderStatistics: Object.entries(genderStats).map(([gender, stats]) => ({
        gender: gender === 'L' ? 'Laki-laki' : 'Perempuan',
        ...stats,
        attendanceRate: stats.total > 0 ? Math.round((stats.withAttendance / stats.total) * 100) : 0
      })),
      photoStatistics: photoStats,
      dailyAttendanceRate: attendanceByDay.map(day => ({
        day: day.day,
        expectedParticipants: totalParticipants,
        actualAttendances: day.total,
        rate: totalParticipants > 0 ? Math.round((day.total / (totalParticipants * 2)) * 100) : 0
      }))
    }

    return NextResponse.json(completeStatistics)
  } catch (error) {
    console.error('Error generating statistics:', error)
    return NextResponse.json(
      { error: 'Failed to generate statistics' },
      { status: 500 }
    )
  }
}