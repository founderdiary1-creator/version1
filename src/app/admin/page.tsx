'use client';

import { useState } from 'react';
import { useAdminStoriesQuery, useDeleteStoryMutation } from '@/hooks/useStories';
import { Plus, Edit2, Trash2, Search, FileText, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: articles = [], isLoading: loading } = useAdminStoriesQuery();
  const deleteMutation = useDeleteStoryMutation();

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      alert('Failed to delete article');
    }
  }

  const filtered = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    draft: articles.filter((a) => a.status === 'draft').length,
    premium: articles.filter((a) => a.is_premium).length,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage articles, content, and settings</p>
          </div>
          <Link
            href="/admin/editor"
            className="flex items-center gap-2 bg-[#E31E24] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#C41A20] transition-colors"
          >
            <Plus size={18} /> New Article
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Articles', value: stats.total, icon: FileText },
            { label: 'Published', value: stats.published, icon: Eye },
            { label: 'Drafts', value: stats.draft, icon: EyeOff },
            { label: 'Premium', value: stats.premium, icon: FileText },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center">
                  <stat.icon size={20} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#E31E24]"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'published', 'draft', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-[#E31E24] text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No articles found</p>
              <p className="text-gray-400 text-sm mt-1">
                {articles.length === 0
                  ? 'Create your first article to get started, or configure Supabase to connect your database.'
                  : 'Try adjusting your search or filter.'}
              </p>
              <Link
                href="/admin/editor"
                className="inline-flex items-center gap-2 mt-4 bg-[#E31E24] text-white font-medium px-5 py-2.5 rounded-lg hover:bg-[#C41A20] transition-colors"
              >
                <Plus size={16} /> Create Article
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 line-clamp-1">{article.title}</span>
                        {article.is_premium && (
                          <span className="bg-[#E31E24] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">PLUS</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500">{article.category?.name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                        article.status === 'published'
                          ? 'bg-green-50 text-green-700'
                          : article.status === 'draft'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-500">
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString()
                          : new Date(article.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/editor/${article.id}`}
                          className="p-2 text-gray-400 hover:text-[#E31E24] transition-colors rounded-lg hover:bg-gray-50"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
