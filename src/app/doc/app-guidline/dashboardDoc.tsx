// app/documentation/dashboard/page.tsx
import {
  Building,
  DoorOpen,
  CalendarCheck,
  Grid2X2,
  BarChart3,
  CalendarDays,
  FileText,
  Megaphone,
  Plus,
  QrCode,
  Crown,
  Headset,
  ChevronDown,
  User,
  ChartLine,
  DoorClosed,
  Building as BuildingIcon,
  UserCircle,
  Map,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a]">
            Dashboard Overview
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Central hub for monitoring property performance and quick actions
          </p>
        </div>

        {/* Content - Responsive Stack/Row */}
        <div className="flex flex-col xl:flex-row gap-10">

          {/* Left - Explanation Panel (Now visible on mobile, distinct from mockup) */}
          <div className="flex-1 order-2 xl:order-1 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 xl:hidden">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
              {[
                {
                  icon: Building,
                  title: "Property Selector",
                  desc: "Switch between managed properties instantly. If no property exists, prompts to 'Add Property'. The entire dashboard context updates based on selection."
                },
                {
                  icon: BarChart3,
                  title: "KPI Metrics",
                  desc: "Real-time data snapshot: Total Units, Available Units, Active Bookings, and Outstanding Invoices for the selected property."
                },
                {
                  icon: Grid2X2,
                  title: "Quick Actions",
                  desc: "Direct access to core functions: Bookings, Invoice management, Announcements, Manager controls, and QR Codes."
                },
                {
                  icon: BarChart3,
                  title: "Navigation Footer",
                  desc: "Persistent bottom navigation to switch between Dashboard, Unit/Rooms, Property Settings, and Organization details."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border-l-4 border-[#1a5f7a] p-5 rounded-r-lg shadow-sm hover:shadow transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-5 h-5 text-[#1a5f7a]" />
                    <h3 className="font-semibold font-montserrat text-gray-800 text-sm">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - App Mockup */}
          <div className="flex-[1.5] order-1 xl:order-2">
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg flex flex-col max-w-2xl mx-auto xl:mx-0">
              {/* Dashboard Header */}
              <div className="bg-[#10506a] text-white p-4 flex justify-between items-center">
                <div className="bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium text-sm">
                  <span>Sunset Apartments</span>
                  <ChevronDown size={14} />
                </div>
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
              </div>

              {/* Dashboard Body */}
              <div className="flex-1 bg-gray-100 p-4 sm:p-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: DoorOpen, value: "12", label: "Available", highlight: true },
                    { icon: Building, value: "45", label: "Total Units", highlight: false },
                    { icon: CalendarCheck, value: "8", label: "Bookings", highlight: false }
                  ].map((kpi, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-3 shadow-sm ${kpi.highlight
                        ? 'bg-[#1a5f7a] text-white'
                        : 'bg-white'
                        }`}
                    >
                      <kpi.icon
                        className={`mb-2 ${kpi.highlight ? 'text-white' : 'text-[#2c83a5]'}`}
                        size={20}
                      />
                      <div className={`text-2xl font-bold font-montserrat ${kpi.highlight ? 'text-white' : 'text-gray-900'}`}>
                        {kpi.value}
                      </div>
                      <div className={`text-xs mt-1 ${kpi.highlight ? 'text-white/80' : 'text-gray-600'}`}>
                        {kpi.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {[
                      { icon: CalendarDays, color: 'blue-100', textColor: 'blue-600', label: 'Bookings' },
                      { icon: FileText, color: 'emerald-100', textColor: 'emerald-600', label: 'Invoices' },
                      { icon: Megaphone, color: 'pink-100', textColor: 'pink-600', label: 'Broadcast' },
                      { icon: UserCircle, color: 'gray-100', textColor: 'gray-600', label: 'Managers' },
                      { icon: Plus, color: 'amber-100', textColor: 'amber-600', label: 'New Book' },
                      { icon: QrCode, color: 'indigo-100', textColor: 'indigo-600', label: 'QR Code' },
                      { icon: Crown, color: 'yellow-100', textColor: 'yellow-600', label: 'Plan' },
                      { icon: Headset, color: 'gray-100', textColor: 'gray-600', label: 'Support' }
                    ].map((action, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg p-2 flex flex-col items-center text-center shadow-sm"
                      >
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 bg-${action.color} text-${action.textColor}`}
                        >
                          <action.icon size={16} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-700 truncate w-full">{action.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="bg-white border-t border-gray-200 h-14 flex items-center justify-around">
                {[
                  { icon: ChartLine, label: 'Dashboard', active: true },
                  { icon: DoorClosed, label: 'Units', active: false },
                  { icon: BuildingIcon, label: 'Property', active: false },
                  { icon: Map, label: 'Org', active: false }
                ].map((nav, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${nav.active ? 'text-[#1a5f7a] font-semibold' : 'text-gray-500'
                      }`}
                  >
                    <nav.icon size={18} />
                    <span>{nav.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}