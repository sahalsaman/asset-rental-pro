import React from "react";
import {
  Building2,
  UsersRound,
  MailOpen,
  ShieldHalf,
  UserPlus,
  Lock,
  User,
  Check
} from "lucide-react";

export default function ManagerManagementPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1a5f7a]">
              Manager Management
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Assign roles and delegate operations securely per property
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#1a5f7a] font-bold">
            <Building2 size={24} />
            <span className="hidden md:inline">RENTITIES</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col xl:flex-row gap-10">
          {/* Left – Features */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
              <FeatureCard
                icon={UsersRound}
                title="Property-Based Assignments"
              >
                <span>
                  <strong>Scoped Access:</strong> Managers are assigned only to
                  specific properties they manage.
                </span>
                <span>
                  <strong>Role Clarity:</strong> Managers handle daily operations
                  without ownership privileges.
                </span>
                <span>
                  <strong>Multi-Property Support:</strong> Assign one manager to
                  multiple properties through a single profile.
                </span>
              </FeatureCard>

              <FeatureCard
                icon={MailOpen}
                title="Invitation System"
              >
                <span>
                  <strong>Email Invites:</strong> Invite managers using their
                  email with a secure onboarding link.
                </span>
                <span>
                  <strong>Status Tracking:</strong> Track invited, accepted, and
                  pending managers.
                </span>
                <span>
                  <strong>Seamless Onboarding:</strong> Managers join with guided
                  setup linked to your organization.
                </span>
              </FeatureCard>

              <FeatureCard
                icon={ShieldHalf}
                title="Access Control & Security"
              >
                <span>
                  <strong>Granular Permissions:</strong> Restrict access to
                  sensitive modules like finances.
                </span>
                <span>
                  <strong>Accountability:</strong> Log manager actions for audit
                  and compliance.
                </span>
                <span>
                  <strong>Instant Revocation:</strong> Disable access immediately
                  if a manager leaves.
                </span>
              </FeatureCard>
            </div>
          </div>

          {/* Right – Preview */}
          <div className="w-full xl:w-[35%] flex flex-col gap-6">
            <div className="bg-gray-50 border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">
                Team Overview
              </p>

              {/* Invite Button */}
              <div className="mb-5 bg-sky-500 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer hover:bg-sky-600 transition-colors">
                <UserPlus size={16} />
                Invite New Manager
              </div>

              <ManagerCard
                name="David Miller"
                role="Property Manager"
                status="Active"
                color="border-blue-500"
              />

              <ManagerCard
                name="Sarah Lee"
                role="Maintenance Supervisor"
                status="Invited"
                color="border-yellow-500"
              />

              <ManagerCard
                name="James Chen"
                role="Front Desk"
                status="Active"
                color="border-blue-500"
              />
            </div>

            {/* Tip Box */}
            <div className="bg-[#1a5f7a] rounded-xl p-6 text-white">
              <h4 className="font-bold font-montserrat mb-2 flex items-center gap-2">
                <Lock className="text-yellow-300" size={16} />
                Security Tip
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">
                New managers start with restricted access. Review and adjust
                permissions immediately after invitation acceptance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function FeatureCard({ icon: Icon, title, children }: any) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="flex items-center gap-3 font-montserrat font-bold text-lg text-gray-800 mb-4 border-b pb-3">
        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-100 text-sky-600 text-sm">
          <Icon size={16} />
        </span>
        {title}
      </h3>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}

function ManagerCard({ name, role, status, color }: any) {
  const statusStyle =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div
      className={`bg-white border-l-4 rounded-xl p-4 mb-4 shadow-sm flex items-center ${color}`}
    >
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
        <User size={16} />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>

      <span
        className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusStyle}`}
      >
        {status}
      </span>
    </div>
  );
}

function CheckItem({ children }: any) {
  return (
    <div className="flex gap-2 items-start">
      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
      <span>{children}</span>
    </div>
  );
}
