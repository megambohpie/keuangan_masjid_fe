import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Download, TrendingDown, TrendingUp, Wallet } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Hi, selamat datang kembali. Berikut ringkasan hari ini.</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Saat Ini</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-islamic-700">Rp 120.000.000</div>
              <div className="text-xs text-islamic-600 inline-flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +4% bulan lalu
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-islamic-100 text-islamic-700 inline-flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pemasukan Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-700">Rp 24.000.000</div>
              <div className="text-xs text-green-600 inline-flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +12% dibanding minggu lalu
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-100 text-green-700 inline-flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pengeluaran Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-700">Rp 7.000.000</div>
              <div className="text-xs text-red-600 inline-flex items-center gap-1">
                <TrendingDown className="h-3.5 w-3.5" /> -3% dibanding minggu lalu
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-red-100 text-red-700 inline-flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Filter Periode</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">17 April 2020 - 21 May 2020</div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarDays className="h-4 w-4" /> Pilih
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts and blocks grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Total Revenue</CardTitle>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
          </CardHeader>
          <CardContent>
            {/* Placeholder chart area */}
            <div className="h-64 rounded-md bg-muted/40" />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="space-y-0">
            <CardTitle>Customer Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md bg-muted/40" />
          </CardContent>
        </Card>
      </div>

      {/* Bottom blocks */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 rounded-md bg-muted/40" />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Chart Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 rounded-md bg-muted/40" />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 rounded-md bg-muted/40" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
