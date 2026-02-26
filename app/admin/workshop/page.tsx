"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { getApiUrl } from "@/lib/api";
import {
  Loader2,
  Users,
  Download,
  Trash2,
  Search,
  BookOpen,
} from "lucide-react";

interface Registration {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  numPeople: number;
  createdAt: string;
}

export default function AdminWorkshopPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Auth check
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl("/workshop/registrations"), {
        credentials: "include",
      });
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchRegistrations();
    }
  }, [user, fetchRegistrations]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this registration? This cannot be undone.")) return;

    setDeleting(id);
    try {
      const res = await fetch(getApiUrl(`/workshop/registrations/${id}`), {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchRegistrations();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete registration");
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleExportCSV = () => {
    // Open the export URL in a new tab (it will download the CSV)
    window.open(getApiUrl("/workshop/registrations/export"), "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRegistrations = registrations.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q)
    );
  });

  const totalPeople = registrations.reduce((sum, r) => sum + r.numPeople, 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
        <Sidebar />
        <main className="w-full flex-1 lg:ml-[280px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#355189]" />
        </main>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-50 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 px-6 lg:px-12 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#14213D]">
                Workshop <span className="text-teal-600">Registrations</span>
              </h1>
              <p className="text-gray-500 text-sm">
                Manage ILAAP Workshop registrations
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-[#E1E7EF] p-5">
              <p className="text-sm text-gray-500 mb-1">Total Registrations</p>
              <p className="text-2xl font-bold text-[#14213D]">
                {registrations.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#E1E7EF] p-5">
              <p className="text-sm text-gray-500 mb-1">Total Attendees</p>
              <p className="text-2xl font-bold text-[#14213D]">{totalPeople}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E1E7EF] p-5">
              <p className="text-sm text-gray-500 mb-1">Unique Companies</p>
              <p className="text-2xl font-bold text-[#14213D]">
                {new Set(registrations.map((r) => r.company)).size}
              </p>
            </div>
          </div>

          {/* Search & Export */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, email..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <button
              onClick={handleExportCSV}
              disabled={registrations.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Table */}
          {filteredRegistrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E1E7EF] p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery
                  ? "No registrations match your search."
                  : "No registrations yet."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E1E7EF] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left px-5 py-3.5 font-semibold text-[#14213D]">
                        Name
                      </th>
                      <th className="text-left px-5 py-3.5 font-semibold text-[#14213D]">
                        Company
                      </th>
                      <th className="text-left px-5 py-3.5 font-semibold text-[#14213D]">
                        Phone
                      </th>
                      <th className="text-left px-5 py-3.5 font-semibold text-[#14213D]">
                        Email
                      </th>
                      <th className="text-center px-5 py-3.5 font-semibold text-[#14213D]">
                        People
                      </th>
                      <th className="text-left px-5 py-3.5 font-semibold text-[#14213D]">
                        Date
                      </th>
                      <th className="text-center px-5 py-3.5 font-semibold text-[#14213D]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((reg) => (
                      <tr
                        key={reg.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-medium text-[#14213D]">
                          {reg.name}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {reg.company}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {reg.phone}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {reg.email}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold">
                            <Users className="w-3 h-3" />
                            {reg.numPeople}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs">
                          {formatDate(reg.createdAt)}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => handleDelete(reg.id)}
                            disabled={deleting === reg.id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === reg.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
