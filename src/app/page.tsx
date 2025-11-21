'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { CalendarDays, Users, MapPin, Clock, CheckCircle, UserPlus, BarChart3, Settings, Camera, RotateCw, RotateCcw, Download, FileText, TrendingUp, Table, UserCheck } from 'lucide-react'

export default function Home() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('info')
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [students, setStudents] = useState([])
  const [uploadResults, setUploadResults] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    nis: '',
    fullName: '',
    gender: '',
    birthPlace: '',
    birthDate: '',
    address: '',
    whatsapp: '',
    email: '',
    schoolName: 'SMP & SMA Harapan Bangsa Modernhill',
    grade: '',
    parentName: '',
    parentPhone: '',
    medicalHistory: ''
  })

  // Attendance states
  const [loginNis, setLoginNis] = useState('')
  const [loggedInParticipant, setLoggedInParticipant] = useState(null)
  const [attendances, setAttendances] = useState([])
  const [allAttendances, setAllAttendances] = useState([])
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    permission: 0
  })
  
  // Admin dashboard states
  const [dashboardStats, setDashboardStats] = useState({
    totalParticipants: 0,
    todayAttendances: 0,
    attendanceRate: 0,
    pendingParticipants: 0
  })
  const [recentRegistrations, setRecentRegistrations] = useState([])
  const [todayAttendanceDetails, setTodayAttendanceDetails] = useState([])
  
  // Camera states for attendance
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const [cameraError, setCameraError] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      const video = document.getElementById('camera-video')
      if (video && video.srcObject) {
        const stream = video.srcObject
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  // Start camera stream when modal opens
  useEffect(() => {
    if (showCamera) {
      const video = document.getElementById('camera-video')
      if (video) {
        navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        }).then(stream => {
          video.srcObject = stream
        }).catch(error => {
          console.error('Camera access error:', error)
          setCameraError('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera.')
        })
      }
    }
  }, [showCamera])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    const fileInput = document.getElementById('fileInput')
    const file = fileInput.files[0]

    if (!file) {
      toast({
        title: "Error",
        description: "Pilih file terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/participants/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (response.ok) {
        setUploadResults(result)
        toast({
          title: "Upload Berhasil",
          description: `Berhasil: ${result.summary.successful}, Gagal: ${result.summary.failed}`,
        })
        
        if (result.errors.length > 0) {
          console.error('Upload errors:', result.errors)
        }
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat upload file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `nis,nama_lengkap,jenis_kelamin,tempat_lahir,tanggal_lahir,alamat,whatsapp,email,kelas,nama_orang_tua,no_telepon_orang_tua,riwayat_penyakit
12345,Ahmad Rizki,L,Bandung,2007-01-15,Jl. Merdeka No. 123,0812345678,ahmad@email.com,X,Bapak Ahmad,0812345679,-
12346,Siti Nurhaliza,P,Bogor,2007-03-22,Jl. Sudirman No. 456,0823456789,siti@email.com,VII,Ibu Siti,0823456789,asma
12347,Budi Santoso,L,Jakarta,2006-06-15,Jl. Thamrin No. 789,0876543210,budi@email.com,XI,Bapak Budi,0876543211,diabetes
12348,Dewi Lestari,P,Bandung,2007-08-10,Jl. Gatot Subroto No. 234,0876543212,dewi@email.com,XII,Ibu Dewi,0876543213,-`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_data_siswa.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const downloadExample = () => {
    const csvContent = `Contoh Data Siswa Youth Camp 2025

Format CSV:
nis,nama_lengkap,jenis_kelamin,tempat_lahir,tanggal_lahir,alamat,whatsapp,email,kelas,nama_orang_tua,no_telepon_orang_tua,riwayat_penyakit

Contoh Data:
12345,Ahmad Rizki,L,Bandung,2007-01-15,Jl. Merdeka No. 123,0812345678,ahmad@email.com,X,Bapak Ahmad,0812345679,-
12346,Siti Nurhaliza,P,Bogor,2007-03-22,Jl. Sudirman No. 456,0823456789,siti@email.com,VII,Ibu Siti,0823456789,asma
12347,Budi Santoso,L,Jakarta,2006-06-15,Jl. Thamrin No. 789,0876543210,budi@email.com,XI,Bapak Budi,0876543211,diabetes
12348,Dewi Lestari,P,Bandung,2007-08-10,Jl. Gatot Subroto No. 234,0876543212,dewi@email.com,XII,Ibu Dewi,0876543213,-

Penting:
- NIS harus unik dan tidak boleh ada duplikat
- Format tanggal: YYYY-MM-DD
- Jenis kelamin: L/P
- Kelas: VII/VIII/IX/X/XI/XII
- Riwayat penyakit: isi dengan - jika tidak ada`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contoh_data_siswa.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Attendance functions
  const handleLogin = async () => {
    if (!loginNis.trim()) {
      toast({
        title: "Error",
        description: "Masukkan NIS terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/participants')
      const participants = await response.json()
      
      const participant = participants.find(p => p.nis === loginNis.trim())
      
      if (participant) {
        setLoggedInParticipant(participant)
        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${participant.fullName}!`,
        })
        
        // Load attendance data for this participant
        loadAttendanceData(participant.id)
      } else {
        toast({
          title: "Error",
          description: "NIS tidak ditemukan. Pastikan NIS sudah terdaftar.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadAttendanceData = async (participantId) => {
    try {
      const response = await fetch('/api/attendance')
      const allAttendances = await response.json()
      
      const participantAttendances = allAttendances.filter(
        attendance => attendance.participantId === participantId
      )
      
      setAttendances(participantAttendances)
    } catch (error) {
      console.error('Error loading attendance:', error)
    }
  }

  const handleAttendance = async (day, sessionType) => {
    if (!loggedInParticipant) {
      toast({
        title: "Error",
        description: "Login terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    // Check if attendance already exists
    const existingAttendance = attendances.find(
      att => att.day === day && att.sessionType === sessionType
    )

    if (existingAttendance) {
      toast({
        title: "Info",
        description: `Absensi ${sessionType} hari ke-${day} sudah dilakukan`,
        variant: "default",
      })
      return
    }

    // Validate time range
    const timeStatus = getTimeStatus(day, sessionType)
    if (!timeStatus.isWithinRange) {
      toast({
        title: "Diluar Jadwal",
        description: timeStatus.message,
        variant: "default",
      })
      return
    }

    // Check if photo is required
    if (!capturedImage) {
      toast({
        title: "Foto Diperlukan",
        description: "Silakan ambil foto terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      
      // Create form data
      const formData = new FormData()
      formData.append('nis', loggedInParticipant.nis)
      formData.append('day', day.toString())
      formData.append('sessionType', sessionType)
      formData.append('photo', blob, `attendance-${loggedInParticipant.nis}-${day}-${sessionType}.jpg`)
      
      const apiResponse = await fetch('/api/attendance', {
        method: 'POST',
        body: formData
      })

      const result = await apiResponse.json()
      
      if (apiResponse.ok) {
        toast({
          title: "Absensi Berhasil",
          description: `Absensi ${sessionType} hari ke-${day} berhasil!`,
        })
        
        // Clear photo after successful attendance
        setCapturedImage(null)
        
        // Refresh attendance data
        loadAttendanceData(loggedInParticipant.id)
        loadAllAttendanceData() // Refresh summary and recent activity
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Attendance error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat melakukan absensi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setLoggedInParticipant(null)
    setLoginNis('')
    setAttendances([])
    toast({
      title: "Logout Berhasil",
      description: "Anda telah logout",
    })
  }

  const hasAttendance = (day, sessionType) => {
    return attendances.some(att => att.day === day && att.sessionType === sessionType)
  }

  // Time validation functions
  const isWithinTimeRange = (day, sessionType) => {
    const now = new Date()
    
    // Check if current date matches the camp date
    const currentDate = now.getDate()
    const currentMonth = now.getMonth() // 0-11 (11 = December)
    const currentYear = now.getFullYear()
    
    // Define valid dates for each day
    const validDates = {
      1: { date: 3, month: 11, year: 2025 }, // 3 Desember 2025
      2: { date: 4, month: 11, year: 2025 }, // 4 Desember 2025
      3: { date: 5, month: 11, year: 2025 }  // 5 Desember 2025
    }
    
    const validDate = validDates[day]
    if (!validDate || currentDate !== validDate.date || currentMonth !== validDate.month || currentYear !== validDate.year) {
      return false // Not the correct date for this day
    }
    
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour + currentMinute / 60

    // Define time ranges for each session
    const timeRanges = {
      1: { // Hari 1 - 3 Desember 2025
        checkin: { start: 6.0, end: 8.0 },     // 06:00-08:00
        checkout: { start: 19.0, end: 21.0 }   // 19:00-21:00
      },
      2: { // Hari 2 - 4 Desember 2025
        checkin: { start: 6.0, end: 8.0 },     // 06:00-08:00
        checkout: { start: 19.0, end: 21.0 }   // 19:00-21:00
      },
      3: { // Hari 3 - 5 Desember 2025
        checkin: { start: 6.0, end: 8.0 },     // 06:00-08:00
        checkout: { start: 15.0, end: 18.0 }   // 15:00-18:00
      }
    }

    const range = timeRanges[day]?.[sessionType]
    if (!range) return false

    return currentTime >= range.start && currentTime <= range.end
  }

  const getTimeStatus = (day, sessionType) => {
    const now = new Date()
    
    // Check if current date matches the camp date
    const currentDate = now.getDate()
    const currentMonth = now.getMonth() // 0-11 (11 = December)
    const currentYear = now.getFullYear()
    
    // Define valid dates for each day
    const validDates = {
      1: { date: 3, month: 11, year: 2025 }, // 3 Desember 2025
      2: { date: 4, month: 11, year: 2025 }, // 4 Desember 2025
      3: { date: 5, month: 11, year: 2025 }  // 5 Desember 2025
    }
    
    const validDate = validDates[day]
    if (!validDate || currentDate !== validDate.date || currentMonth !== validDate.month || currentYear !== validDate.year) {
      // Find which day is currently active (if any)
      let currentDay = null
      for (const [dayNum, dayInfo] of Object.entries(validDates)) {
        if (currentDate === dayInfo.date && currentMonth === dayInfo.month && currentYear === dayInfo.year) {
          currentDay = parseInt(dayNum)
          break
        }
      }
      
      if (currentDay) {
        return {
          isWithinRange: false,
          status: 'wrong_day',
          message: `Hari ini adalah Hari ${currentDay}, bukan Hari ${day}`,
          color: 'text-orange-600'
        }
      } else {
        return {
          isWithinRange: false,
          status: 'wrong_date',
          message: 'Belum tanggal kegiatan Youth Camp',
          color: 'text-gray-500'
        }
      }
    }
    
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour + currentMinute / 60

    const timeRanges = {
      1: { checkin: { start: 6.0, end: 8.0 }, checkout: { start: 19.0, end: 21.0 } },
      2: { checkin: { start: 6.0, end: 8.0 }, checkout: { start: 19.0, end: 21.0 } },
      3: { checkin: { start: 6.0, end: 8.0 }, checkout: { start: 15.0, end: 18.0 } }
    }

    const range = timeRanges[day]?.[sessionType]
    if (!range) return { isWithinRange: false, status: 'invalid', message: 'Jadwal tidak valid', color: 'text-red-500' }

    if (currentTime < range.start) {
      return {
        isWithinRange: false,
        status: 'early',
        message: `Belum waktunya (buka jam ${formatTime(range.start)})`,
        color: 'text-yellow-600'
      }
    }

    if (currentTime > range.end) {
      return {
        isWithinRange: false,
        status: 'late',
        message: `Terlambat (tutup jam ${formatTime(range.end)})`,
        color: 'text-red-600'
      }
    }

    return {
      isWithinRange: true,
      status: 'available',
      message: 'Sedang dalam jadwal absensi',
      color: 'text-green-600'
    }
  }

  const formatTime = (time) => {
    const hours = Math.floor(time)
    const minutes = Math.round((time - hours) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  // Load all attendance data and summary
  const loadAllAttendanceData = async () => {
    try {
      const response = await fetch('/api/attendance')
      const data = await response.json()
      
      setAllAttendances(data)
      
      // Calculate summary
      const summary = data.reduce((acc, attendance) => {
        acc[attendance.status] = (acc[attendance.status] || 0) + 1
        return acc
      }, { present: 0, absent: 0, late: 0, permission: 0 })
      
      setAttendanceSummary(summary)
    } catch (error) {
      console.error('Error loading all attendance data:', error)
    }
  }

  // Camera functions
  const startCamera = async () => {
    setShowCamera(true)
    setCameraError('')
    setCapturedImage(null)
    
    toast({
      title: "Membuka Kamera",
      description: "Meminta izin kamera...",
    })
  }

  const stopCamera = () => {
    const video = document.getElementById('camera-video')
    if (video && video.srcObject) {
      const stream = video.srcObject
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      video.srcObject = null
    }
    
    setShowCamera(false)
    setCapturedImage(null)
    setCameraError('')
  }

  const capturePhoto = () => {
    setIsCameraLoading(true)
    setCameraError('')
    
    try {
      const video = document.getElementById('camera-video')
      const canvas = document.getElementById('camera-canvas')
      
      if (!video || !canvas) {
        throw new Error('Camera elements not found')
      }

      const context = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
      setCapturedImage(imageDataUrl)
      
      toast({
        title: "Foto Berhasil",
        description: "Foto berhasil diambil",
      })
    } catch (error) {
      console.error('Camera capture error:', error)
      setCameraError('Gagal mengambil foto. Silakan coba lagi.')
      toast({
        title: "Error",
        description: "Gagal mengambil foto",
        variant: "destructive",
      })
    } finally {
      setIsCameraLoading(false)
    }
  }

  

  const retakePhoto = () => {
    setCapturedImage(null)
    setCameraError('')
  }

  const confirmPhoto = () => {
    if (!capturedImage) {
      toast({
        title: "Error",
        description: "Tidak ada foto yang dipilih",
        variant: "destructive",
      })
      return
    }
    
    // Close camera modal and return to attendance flow
    setShowCamera(false)
    toast({
      title: "Foto Siap",
      description: "Foto siap digunakan untuk absensi",
    })
  }

  // Export functions
  const exportParticipantsData = async () => {
    try {
      const response = await fetch('/api/participants/export')
      const data = await response.json()
      
      if (response.ok) {
        // Create CSV content
        const headers = [
          'NIS', 'Nama Lengkap', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir',
          'Alamat', 'WhatsApp', 'Email', 'Sekolah', 'Kelas', 'Nama Orang Tua',
          'Telepon Orang Tua', 'Riwayat Penyakit', 'Status', 'Total Kehadiran', 'Tanggal Daftar'
        ]
        
        const csvContent = [
          headers.join(','),
          ...data.map(row => [
            row.nis,
            `"${row.nama_lengkap}"`,
            row.jenis_kelamin,
            `"${row.tempat_lahir}"`,
            row.tanggal_lahir,
            `"${row.alamat}"`,
            row.whatsapp,
            row.email,
            `"${row.sekolah}"`,
            row.kelas,
            `"${row.nama_orang_tua}"`,
            row.telepon_orang_tua,
            `"${row.riwayat_penyakit}"`,
            row.status,
            row.total_kehadiran,
            row.tanggal_daftar
          ].join(','))
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `data_siswa_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        
        toast({
          title: "Export Berhasil",
          description: "Data siswa berhasil diekspor",
        })
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat export data",
        variant: "destructive",
      })
    }
  }

  const exportAttendanceReport = async () => {
    try {
      const response = await fetch('/api/attendance/report')
      const data = await response.json()
      
      if (response.ok) {
        // Create CSV content
        const headers = [
          'NIS', 'Nama Lengkap', 'Kelas', 'Hari', 'Sesi', 'Status', 'Catatan', 
          'Foto', 'Tanggal Absen', 'Waktu Absen'
        ]
        
        const csvContent = [
          headers.join(','),
          ...data.data.map(row => [
            row.nis,
            `"${row.nama_lengkap}"`,
            row.kelas,
            row.hari,
            row.sesi,
            row.status,
            `"${row.catatan}"`,
            row.foto,
            row.tanggal_absen,
            row.waktu_absen
          ].join(','))
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `laporan_kehadiran_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        
        toast({
          title: "Export Berhasil",
          description: "Laporan kehadiran berhasil diekspor",
        })
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat export laporan",
        variant: "destructive",
      })
    }
  }

  // Statistics state
  const [statistics, setStatistics] = useState(null)
  const [attendanceReport, setAttendanceReport] = useState(null)
  const [showStatistics, setShowStatistics] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const loadStatistics = async () => {
    try {
      const response = await fetch('/api/statistics')
      const data = await response.json()
      
      if (response.ok) {
        setStatistics(data)
        setShowStatistics(true)
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Statistics error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat statistik",
        variant: "destructive",
      })
    }
  }

  const loadAttendanceReport = async () => {
    try {
      const response = await fetch('/api/attendance/report')
      const data = await response.json()
      
      if (response.ok) {
        setAttendanceReport(data)
        setShowReport(true)
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Report error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat laporan",
        variant: "destructive",
      })
    }
  }

  // Load data when component mounts or tab changes to attendance
  useEffect(() => {
    if (activeTab === 'attendance') {
      loadAllAttendanceData()
    }
  }, [activeTab])

  // Load dashboard data when admin tab is active
  useEffect(() => {
    if (activeTab === 'admin') {
      loadDashboardData()
    }
  }, [activeTab])

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      
      setDashboardStats(data.statistics || {
        totalParticipants: 0,
        todayAttendances: 0,
        attendanceRate: 0,
        pendingParticipants: 0
      })
      
      setRecentRegistrations(data.recentRegistrations || [])
      setTodayAttendanceDetails(data.todayAttendanceDetails || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-2">
            Youth Camp 2025
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            SMP & SMA Harapan Bangsa | Modernhill
          </p>
          <p className="text-lg text-gray-500 mb-6">
            "Knowledge, Faith and Character are. The Ultimate Goals of Education."
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <CalendarDays className="w-5 h-5 mr-2" />
              3-5 Desember 2025
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 flex gap-2 flex-wrap justify-center">
            <Button
              variant={activeTab === 'info' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('info')}
              className="px-6"
            >
              Informasi
            </Button>
            <Button
              variant={activeTab === 'attendance' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('attendance')}
              className="px-6"
            >
              Absensi
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'info' && (
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Jadwal Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-green-600" />
                  Jadwal Kegiatan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">Hari 1 - 3 Desember 2025</h4>
                  <p className="text-sm text-gray-600">Check-in, Pembukaan, Ice Breaking</p>
                  <p className="text-xs text-gray-500">08:00 - 21:00 WIB</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Hari 2 - 4 Desember 2025</h4>
                  <p className="text-sm text-gray-600">Workshop, Outdoor Activities, Team Building</p>
                  <p className="text-xs text-gray-500">07:00 - 22:00 WIB</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">Hari 3 - 5 Desember 2025</h4>
                  <p className="text-sm text-gray-600">Leadership Training, Penutupan, Check-out</p>
                  <p className="text-xs text-gray-500">07:00 - 15:00 WIB</p>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Lokasi & Fasilitas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">📍 Lokasi</h4>
                  <p className="text-sm text-gray-600">Villa Bukit Pancawati, Bogor</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🏠 Fasilitas</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Penginapan (3 hari 2 malam)</li>
                    <li>• Makan 6x selama kegiatan</li>
                    <li>• Materi dan sertifikat</li>
                    <li>• Asuransi kegiatan</li>
                    <li>• Kaos event</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Informasi Kegiatan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tanggal Kegiatan</span>
                  <Badge variant="outline">3-5 Desember 2025</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lokasi</span>
                  <Badge className="bg-blue-100 text-blue-800">Villa Bukit Pancawati</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Peserta</span>
                  <Badge className="bg-green-100 text-green-800">Siswa/i Harapan Bangsa</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {activeTab === 'attendance' && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <CheckCircle className="w-6 h-6" />
                Sistem Absensi Youth Camp 2025
              </CardTitle>
              <CardDescription>
                Sistem absensi digital untuk siswa/i SMP & SMA Harapan Bangsa Modernhill
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Login Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Login Peserta</CardTitle>
                    <CardDescription>
                      Masukkan NIS untuk melakukan absensi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loggedInParticipant ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-800">👤 Selamat Datang!</h4>
                          <p className="text-sm text-green-700">
                            <strong>Nama:</strong> {loggedInParticipant.fullName}<br />
                            <strong>NIS:</strong> {loggedInParticipant.nis}<br />
                            <strong>Kelas:</strong> {loggedInParticipant.grade}
                          </p>
                        </div>
                        <Button 
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full"
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={loginNis}
                          onChange={(e) => setLoginNis(e.target.value)}
                          className="flex-1 p-2 border rounded-md"
                          placeholder="Masukkan NIS"
                          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        <Button 
                          onClick={handleLogin}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : 'Login'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Daily Attendance Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <CalendarDays className="w-5 h-5" />
                        Hari 1
                      </CardTitle>
                      <CardDescription>3 Desember 2025</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Check-in Pagi</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600">06:00-08:00</Badge>
                            {(() => {
                              const status = getTimeStatus(1, 'checkin')
                              return (
                                <span className={`text-xs font-medium ${status.color}`}>
                                  {status.message}
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                        
                        {/* Camera button above Check-in */}
                        <div className="flex justify-center">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={startCamera}
                            disabled={!loggedInParticipant || hasAttendance(1, 'checkin') || isLoading || !getTimeStatus(1, 'checkin').isWithinRange}
                          >
                            <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Ambil Foto
                          </Button>
                        </div>
                        
                        <Button 
                          variant={hasAttendance(1, 'checkin') ? "secondary" : "outline"} 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleAttendance(1, 'checkin')}
                          disabled={!loggedInParticipant || hasAttendance(1, 'checkin') || isLoading || !getTimeStatus(1, 'checkin').isWithinRange}
                        >
                          {hasAttendance(1, 'checkin') ? '✓ Sudah Check-in' : 'Absensi Check-in'}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Check-out Malam</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-blue-600">19:00-21:00</Badge>
                            {(() => {
                              const status = getTimeStatus(1, 'checkout')
                              return (
                                <span className={`text-xs font-medium ${status.color}`}>
                                  {status.message}
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                        <Button 
                          variant={hasAttendance(1, 'checkout') ? "secondary" : "outline"} 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleAttendance(1, 'checkout')}
                          disabled={!loggedInParticipant || hasAttendance(1, 'checkout') || isLoading || !getTimeStatus(1, 'checkout').isWithinRange}
                        >
                          {hasAttendance(1, 'checkout') ? '✓ Sudah Check-out' : 'Absensi Check-out'}
                        </Button>
                        
                        {/* Camera button below Check-out */}
                        <div className="flex justify-center">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={startCamera}
                            disabled={!loggedInParticipant || hasAttendance(1, 'checkout') || isLoading || !getTimeStatus(1, 'checkout').isWithinRange}
                          >
                            <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Ambil Foto
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        <CalendarDays className="w-5 h-5" />
                        Hari 2
                      </CardTitle>
                      <CardDescription>4 Desember 2025</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Check-in Pagi</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600">06:00-08:00</Badge>
                            {(() => {
                              const status = getTimeStatus(2, 'checkin')
                              return (
                                <span className={`text-xs font-medium ${status.color}`}>
                                  {status.message}
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                        
                        {/* Camera button above Check-in */}
                        <div className="flex justify-center">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={startCamera}
                            disabled={!loggedInParticipant || hasAttendance(2, 'checkin') || isLoading || !getTimeStatus(2, 'checkin').isWithinRange}
                          >
                            <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Ambil Foto
                          </Button>
                        </div>
                        
                        <Button 
                          variant={hasAttendance(2, 'checkin') ? "secondary" : "outline"} 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleAttendance(2, 'checkin')}
                          disabled={!loggedInParticipant || hasAttendance(2, 'checkin') || isLoading || !getTimeStatus(2, 'checkin').isWithinRange}
                        >
                          {hasAttendance(2, 'checkin') ? '✓ Sudah Check-in' : 'Absensi Check-in'}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Check-out Malam</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-blue-600">19:00-21:00</Badge>
                            {(() => {
                              const status = getTimeStatus(2, 'checkout')
                              return (
                                <span className={`text-xs font-medium ${status.color}`}>
                                  {status.message}
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                        <Button 
                          variant={hasAttendance(2, 'checkout') ? "secondary" : "outline"} 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleAttendance(2, 'checkout')}
                          disabled={!loggedInParticipant || hasAttendance(2, 'checkout') || isLoading || !getTimeStatus(2, 'checkout').isWithinRange}
                        >
                          {hasAttendance(2, 'checkout') ? '✓ Sudah Check-out' : 'Absensi Check-out'}
                        </Button>
                        
                        {/* Camera button below Check-out */}
                        <div className="flex justify-center">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={startCamera}
                            disabled={!loggedInParticipant || hasAttendance(2, 'checkout') || isLoading || !getTimeStatus(2, 'checkout').isWithinRange}
                          >
                            <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Ambil Foto
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-700">
                        <CalendarDays className="w-5 h-5" />
                        Hari 3
                      </CardTitle>
                      <CardDescription>5 Desember 2025</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Check-in Pagi</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600">06:00-08:00</Badge>
                            {(() => {
                              const status = getTimeStatus(3, 'checkin')
                              return (
                                <span className={`text-xs font-medium ${status.color}`}>
                                  {status.message}
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                        
                        {/* Camera button above Check-in */}
                        <div className="flex justify-center">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={startCamera}
                            disabled={!loggedInParticipant || hasAttendance(3, 'checkin') || isLoading || !getTimeStatus(3, 'checkin').isWithinRange}
                          >
                            <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Ambil Foto
                          </Button>
                        </div>
                        
                        <Button 
                          variant={hasAttendance(3, 'checkin') ? "secondary" : "outline"} 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleAttendance(3, 'checkin')}
                          disabled={!loggedInParticipant || hasAttendance(3, 'checkin') || isLoading || !getTimeStatus(3, 'checkin').isWithinRange}
                        >
                          {hasAttendance(3, 'checkin') ? '✓ Sudah Check-in' : 'Absensi Check-in'}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Check-out Final</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-orange-600">15:00-18:00</Badge>
                            {(() => {
                              const status = getTimeStatus(3, 'checkout')
                              return (
                                <span className={`text-xs font-medium ${status.color}`}>
                                  {status.message}
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                        <Button 
                          variant={hasAttendance(3, 'checkout') ? "secondary" : "outline"} 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleAttendance(3, 'checkout')}
                          disabled={!loggedInParticipant || hasAttendance(3, 'checkout') || isLoading || !getTimeStatus(3, 'checkout').isWithinRange}
                        >
                          {hasAttendance(3, 'checkout') ? '✓ Sudah Check-out' : 'Absensi Check-out'}
                        </Button>
                        
                        {/* Camera button below Check-out */}
                        <div className="flex justify-center">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={startCamera}
                            disabled={!loggedInParticipant || hasAttendance(3, 'checkout') || isLoading || !getTimeStatus(3, 'checkout').isWithinRange}
                          >
                            <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Ambil Foto
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Attendance Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Ringkasan Kehadiran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{attendanceSummary.present}</div>
                        <div className="text-sm text-gray-600">Hadir</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</div>
                        <div className="text-sm text-gray-600">Tidak Hadir</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{attendanceSummary.late}</div>
                        <div className="text-sm text-gray-600">Terlambat</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{attendanceSummary.permission}</div>
                        <div className="text-sm text-gray-600">Izin</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Aktivitas Terbaru</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {allAttendances.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {allAttendances.slice(0, 10).map((attendance, index) => (
                          <div key={attendance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div>
                                <p className="font-medium text-sm">
                                  {attendance.participant?.fullName || 'Unknown'} - {attendance.participant?.nis || 'Unknown'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Hari {attendance.day} - {attendance.sessionType} • {new Date(attendance.timestamp).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant={attendance.status === 'present' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {attendance.status === 'present' ? 'Hadir' : attendance.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Belum ada aktivitas absensi</p>
                        <p className="text-sm">Login dan lakukan absensi untuk melihat aktivitas di sini</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}


      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Upload Data Siswa
                </span>
                <Button variant="ghost" size="sm" onClick={() => setShowAddStudent(false)}>
                  ✕
                </Button>
              </CardTitle>
              <CardDescription>
                Upload data siswa/i SMP & SMA Harapan Bangsa | Modernhill
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Template Section */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-blue-800">📋 Template Format Data</h4>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-blue-700">Format CSV yang diharapkan:</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <Button variant="outline" size="sm" className="w-full" onClick={downloadTemplate}>
                      📥 Download Template CSV
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={downloadExample}>
                      📄 Download Contoh Data
                    </Button>
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <form className="space-y-4" onSubmit={handleFileUpload}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pilih File CSV/Excel *</label>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="w-full p-2 border rounded-md"
                    placeholder="Pilih file CSV atau Excel"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAddStudent(false)}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                  >
                    📤 Upload & Proses Data
                  </Button>
                </div>
              </form>

              {/* Upload Results */}
              {uploadResults && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-800">📊 Hasil Upload</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Baris:</span>
                      <span className="font-bold">{uploadResults.summary.totalRows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-green-600">Berhasil:</span>
                      <span className="font-bold text-green-600">{uploadResults.summary.successful}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-red-600">Gagal:</span>
                      <span className="font-bold text-red-600">{uploadResults.summary.failed}</span>
                    </div>
                  </div>
                  
                  {uploadResults.errors.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-2">❌ Error Details:</h5>
                      <div className="max-h-32 overflow-y-auto text-xs text-red-700">
                        {uploadResults.errors.map((error, index) => (
                          <div key={index} className="mb-1">{error}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Instructions */}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-yellow-800">⚠️ Penting:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Pastikan format CSV sesuai template di atas</li>
                  <li>• NIS harus unik (tidak boleh ada duplikat)</li>
                  <li>• Tanggal lahir format: YYYY-MM-DD</li>
                  <li>• Jenis kelamin: L/P</li>
                  <li>• Kelas: VII/VIII/IX/X/XI/XII</li>
                  <li>• Data siswa akan otomatis disetujui (approved)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Ambil Foto Absensi
                </span>
                <Button variant="ghost" size="sm" onClick={stopCamera}>
                  ✕
                </Button>
              </CardTitle>
              <CardDescription>
                Ambil foto selfie untuk bukti absensi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cameraError && (
                <div className="p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                  {cameraError}
                </div>
              )}
              
              {/* Camera View */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  id="camera-video"
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
                <canvas
                  id="camera-canvas"
                  className="hidden"
                />
              </div>

              {/* Photo Preview */}
              {capturedImage && (
                <div className="mt-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={capturedImage} 
                      alt="Preview foto absensi" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Camera Controls */}
              <div className="flex justify-center">
                <Button
                  onClick={capturePhoto}
                  disabled={isCameraLoading}
                  className="flex-1"
                >
                  {isCameraLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span className="ml-2">Mengambil foto...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Ambil Foto</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-center mt-4">
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi</span>
                </Button>
                <Button
                  onClick={confirmPhoto}
                  disabled={!capturedImage}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Gunakan Foto</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatistics && statistics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="w-6 h-6" />
                  Statistik Lengkap - Youth Camp 2025
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowStatistics(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overview Statistics */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">{statistics.overview.totalParticipants}</div>
                        <div className="text-sm text-gray-600">Total Peserta</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">{statistics.overview.attendanceRate}%</div>
                        <div className="text-sm text-gray-600">Tingkat Kehadiran</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold">{statistics.overview.totalAttendances}</div>
                        <div className="text-sm text-gray-600">Total Absensi</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Breakdown Kehadiran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Hadir
                        </span>
                        <span className="font-bold">{statistics.attendanceBreakdown.present}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          Terlambat
                        </span>
                        <span className="font-bold">{statistics.attendanceBreakdown.late}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Izin
                        </span>
                        <span className="font-bold">{statistics.attendanceBreakdown.permission}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          Tanpa Keterangan
                        </span>
                        <span className="font-bold">{statistics.attendanceBreakdown.absent}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistik Foto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Dengan Foto</span>
                        <span className="font-bold">{statistics.photoStatistics.withPhoto}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tanpa Foto</span>
                        <span className="font-bold">{statistics.photoStatistics.withoutPhoto}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Persentase Foto</span>
                        <span className="font-bold">{statistics.photoStatistics.photoPercentage}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Statistics by Grade */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistik per Kelas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Kelas</th>
                          <th className="text-center p-2">Total</th>
                          <th className="text-center p-2">Sudah Absen</th>
                          <th className="text-center p-2">Total Absensi</th>
                          <th className="text-center p-2">Tingkat Kehadiran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statistics.gradeStatistics.map((grade, index) => (
                          <tr key={grade.grade} className="border-b">
                            <td className="p-2 font-medium">{grade.grade}</td>
                            <td className="text-center p-2">{grade.total}</td>
                            <td className="text-center p-2">{grade.withAttendance}</td>
                            <td className="text-center p-2">{grade.totalAttendances}</td>
                            <td className="text-center p-2">
                              <Badge variant={grade.attendanceRate >= 80 ? 'default' : 'secondary'}>
                                {grade.attendanceRate}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics by Gender */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistik per Jenis Kelamin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {statistics.genderStatistics.map((gender) => (
                      <div key={gender.gender} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-3">{gender.gender}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-medium">{gender.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sudah Absen:</span>
                            <span className="font-medium">{gender.withAttendance}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Absensi:</span>
                            <span className="font-medium">{gender.totalAttendances}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tingkat Kehadiran:</span>
                            <Badge variant={gender.attendanceRate >= 80 ? 'default' : 'secondary'}>
                              {gender.attendanceRate}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Report Modal */}
      {showReport && attendanceReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="w-6 h-6" />
                  Laporan Kehadiran - Youth Camp 2025
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportAttendanceReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowReport(false)}>
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Summary */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{attendanceReport.summary.total_absensi}</div>
                      <div className="text-sm text-gray-600">Total Absensi</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{attendanceReport.summary.hadir}</div>
                      <div className="text-sm text-gray-600">Hadir</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{attendanceReport.summary.terlambat}</div>
                      <div className="text-sm text-gray-600">Terlambat</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{attendanceReport.summary.dengan_foto}</div>
                      <div className="text-sm text-gray-600">Dengan Foto</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Details Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detail Kehadiran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3">NIS</th>
                          <th className="text-left p-3">Nama Lengkap</th>
                          <th className="text-left p-3">Kelas</th>
                          <th className="text-center p-3">Hari</th>
                          <th className="text-center p-3">Sesi</th>
                          <th className="text-center p-3">Status</th>
                          <th className="text-center p-3">Foto</th>
                          <th className="text-left p-3">Tanggal</th>
                          <th className="text-left p-3">Waktu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceReport.data.map((record, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{record.nis}</td>
                            <td className="p-3">{record.nama_lengkap}</td>
                            <td className="p-3">{record.kelas}</td>
                            <td className="text-center p-3">{record.hari}</td>
                            <td className="text-center p-3">{record.sesi}</td>
                            <td className="text-center p-3">
                              <Badge 
                                variant={
                                  record.status === 'present' ? 'default' :
                                  record.status === 'late' ? 'secondary' :
                                  record.status === 'permission' ? 'outline' : 'destructive'
                                }
                                className="text-xs"
                              >
                                {record.status === 'present' ? 'Hadir' :
                                 record.status === 'late' ? 'Terlambat' :
                                 record.status === 'permission' ? 'Izin' : 'Tanpa Keterangan'}
                              </Badge>
                            </td>
                            <td className="text-center p-3">
                              <Badge variant={record.foto === 'Ada' ? 'default' : 'secondary'}>
                                {record.foto}
                              </Badge>
                            </td>
                            <td className="p-3">{record.tanggal_absen}</td>
                            <td className="p-3">{record.waktu_absen}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {attendanceReport.data.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Belum ada data kehadiran</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}