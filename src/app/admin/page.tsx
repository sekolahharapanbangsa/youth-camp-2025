'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { 
  Users, 
  Upload, 
  Download, 
  Shield, 
  Eye, 
  CalendarDays,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon
} from 'lucide-react'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadResults, setUploadResults] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [participants, setParticipants] = useState([])
  const [attendances, setAttendances] = useState([])
  const [gallery, setGallery] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Admin password - in production, this should be stored securely
  const ADMIN_PASSWORD = 'admin123'

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      setLoginError('')
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di Admin Panel",
      })
      loadData()
    } else {
      setLoginError('Password salah!')
      toast({
        title: "Login Gagal",
        description: "Password yang Anda masukkan salah",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setPassword('')
    setLoginError('')
    setParticipants([])
    setAttendances([])
    setGallery([])
    toast({
      title: "Logout Berhasil",
      description: "Anda telah logout dari Admin Panel",
    })
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load participants
      const participantsRes = await fetch('/api/participants')
      if (participantsRes.ok) {
        const participantsData = await participantsRes.json()
        setParticipants(participantsData)
      }

      // Load attendances
      const attendancesRes = await fetch('/api/attendance')
      if (attendancesRes.ok) {
        const attendancesData = await attendancesRes.json()
        setAttendances(attendancesData)
      }

      // Load gallery
      const galleryRes = await fetch('/api/gallery')
      if (galleryRes.ok) {
        const galleryData = await galleryRes.json()
        setGallery(galleryData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadFile) {
      toast({
        title: "Error",
        description: "Pilih file CSV terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)

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
        loadData() // Reload participants data
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
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const exportParticipants = async () => {
    try {
      const response = await fetch('/api/participants/export')
      const csvContent = await response.text()
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `data_siswa_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Export Berhasil",
        description: "Data siswa berhasil diexport",
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Error",
        description: "Gagal export data siswa",
        variant: "destructive",
      })
    }
  }

  const exportAttendances = async () => {
    try {
      const response = await fetch('/api/attendance/export')
      const csvContent = await response.text()
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `laporan_kehadiran_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Export Berhasil",
        description: "Laporan kehadiran berhasil diexport",
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Error",
        description: "Gagal export laporan kehadiran",
        variant: "destructive",
      })
    }
  }

  // Calculate statistics
  const totalParticipants = participants.length
  const totalAttendances = attendances.length
  const uniqueParticipantsAttended = new Set(attendances.map(a => a.nis)).size
  const attendanceRate = totalParticipants > 0 ? (uniqueParticipantsAttended / totalParticipants * 100).toFixed(1) : 0

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900">Admin Panel</CardTitle>
            <CardDescription>
              Youth Camp 2025 - Masukkan password untuk mengakses admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Masukkan password admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-500 text-sm text-center">{loginError}</div>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Shield className="w-4 h-4 mr-2" />
                Login
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Kembali ke Halaman Utama
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Youth Camp 2025 - Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="hidden sm:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                Lihat Halaman Siswa
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                  <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Kehadiran</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAttendances}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Siswa Hadir</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueParticipantsAttended}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tingkat Kehadiran</p>
                  <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="participants">Data Siswa</TabsTrigger>
            <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="reports">Laporan</TabsTrigger>
          </TabsList>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Data Siswa</CardTitle>
                <CardDescription>
                  Upload file CSV untuk menambahkan data siswa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="flex-1"
                  />
                  <Button onClick={downloadTemplate} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                <Button 
                  onClick={handleUpload} 
                  disabled={!uploadFile || isUploading}
                  className="w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Mengupload...' : 'Upload Data'}
                </Button>
                
                {uploadResults && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Hasil Upload:</h4>
                    <div className="space-y-1 text-sm">
                      <p>✅ Berhasil: {uploadResults.summary.successful}</p>
                      <p>❌ Gagal: {uploadResults.summary.failed}</p>
                      <p>📊 Total: {uploadResults.summary.total}</p>
                    </div>
                    {uploadResults.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold text-red-600">Error Details:</p>
                        <ScrollArea className="h-20 mt-1">
                          {uploadResults.errors.map((error, index) => (
                            <p key={index} className="text-xs text-red-600">
                              Baris {error.row}: {error.error}
                            </p>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Daftar Siswa</CardTitle>
                    <CardDescription>
                      Total {totalParticipants} siswa terdaftar
                    </CardDescription>
                  </div>
                  <Button onClick={exportParticipants} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{participant.nama_lengkap}</p>
                            <p className="text-sm text-gray-600">NIS: {participant.nis}</p>
                            <p className="text-sm text-gray-600">Kelas: {participant.kelas}</p>
                          </div>
                          <Badge variant={participant.jenis_kelamin === 'L' ? 'default' : 'secondary'}>
                            {participant.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Data Kehadiran</CardTitle>
                    <CardDescription>
                      Total {totalAttendances} record kehadiran
                    </CardDescription>
                  </div>
                  <Button onClick={exportAttendances} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {attendances.map((attendance) => (
                      <div key={attendance.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">Hari {attendance.day} - {attendance.sessionType}</p>
                            <p className="text-sm text-gray-600">NIS: {attendance.nis}</p>
                            <p className="text-sm text-gray-600">
                              Waktu: {new Date(attendance.timestamp).toLocaleString('id-ID')}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {attendance.sessionType === 'checkin' ? 'Check-in' : 'Check-out'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gallery Foto</CardTitle>
                <CardDescription>
                  Total {gallery.length} foto kehadiran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map((photo) => (
                      <div key={photo.id} className="border rounded-lg overflow-hidden">
                        <img 
                          src={photo.photo_data} 
                          alt={`Photo ${photo.id}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <p className="text-sm font-semibold">Hari {photo.day} - {photo.sessionType}</p>
                          <p className="text-xs text-gray-600">NIS: {photo.nis}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(photo.timestamp).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Data Siswa</CardTitle>
                  <CardDescription>
                    Download semua data siswa dalam format CSV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={exportParticipants} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data Siswa
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Laporan Kehadiran</CardTitle>
                  <CardDescription>
                    Download laporan kehadiran dalam format CSV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={exportAttendances} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Laporan Kehadiran
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}