'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FormSubmission } from '@/types/onboarding';
import { Search, Filter, MoreVertical, Eye, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function SubmissionsTable({ initialData }: { initialData: FormSubmission[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredData = initialData.filter(sub => {
    const matchesSearch = (sub.company_name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (sub.founder_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">New</span>;
      case 'UNDER_REVIEW': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">Under Review</span>;
      case 'DRAFTING': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">Drafting</span>;
      case 'PUBLISHED': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Published</span>;
      case 'ARCHIVED': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">Archived</span>;
      default: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search founders or companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] outline-none transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] outline-none text-sm font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="DRAFTING">Drafting</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-900 font-semibold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Founder & Company</th>
              <th className="px-6 py-4">Archetype</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No submissions found matching your filters.
                </td>
              </tr>
            ) : (
              filteredData.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {sub.company_logo ? (
                        <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden border border-gray-200">
                          <img src={sub.company_logo} alt={sub.company_name || 'Logo'} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0 font-bold text-gray-500">
                          {(sub.founder_name?.[0] || '?').toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900 text-base">{sub.founder_name || 'Unknown Founder'}</div>
                        <div className="text-gray-500">{sub.company_name || 'No Company Provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sub.archetype ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200">
                        {sub.archetype.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(sub.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/submissions/${sub.id}`}
                      className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-[#E31E24] hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Eye size={20} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
