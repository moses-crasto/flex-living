'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend
} from 'recharts';

import { useReviews } from './hooks/useReviews';
import { useChartData } from './hooks/useChartData';
import Select from 'react-select';
import { useState } from 'react';

const COLORS = ['#96c4d2', '#FF8042'];

export default function Dashboard() {
  const {
    reviews,
    filteredReviews,
    allCategories,
    loading,
    error,
    filterProperty,
    setFilterProperty,
    filterGuest,
    setFilterGuest,
    filterCategories,
    setFilterCategories,
    onlyApproved,
    setOnlyApproved,
    sort,
    setSort,
    toggleApproval,
    dateRange,
    setDateRange,
  } = useReviews();
  
  const { getRatingOverTime, getApprovedVsNotApproved, getRatingDistribution, getTopProperties } = useChartData(filteredReviews);
  const [tempDateRange, setTempDateRange] = useState(dateRange);

  if (loading) return <main className="p-6">Loading reviews...</main>;
  if (error) return <main className="p-6 text-red-500">Error: {error}</main>;

  return (
    <main className="funnel-display p-6">
      <h1 className="font-weight-800 text-5xl font-bold mb-4">Reviews Dashboard</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <Select
        options={[...new Set(reviews.map(r => r.listingName))].map(name => ({
            value: name,
            label: name,
        }))}
        placeholder="Filter by property name..."
        isClearable
        value={filterProperty ? { value: filterProperty, label: filterProperty } : null}
        onChange={(selected) => setFilterProperty(selected ? selected.value : '')}
        className="min-w-[200px]"
        />

        <Select
        options={[...new Set(reviews.map(r => r.guestName))].map(name => ({
            value: name,
            label: name,
        }))}
        placeholder="Filter by guest name..."
        isClearable
        value={filterGuest ? { value: filterGuest, label: filterGuest } : null}
        onChange={(selected) => setFilterGuest(selected ? selected.value : '')}
        className="min-w-[200px]"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyApproved}
            onChange={(e) => setOnlyApproved(e.target.checked)}
          />
          Show only approved
        </label>

        <div className="flex gap-2">
          <input
            className='px-2 bg-white rounded-xl'
            type="date"
            value={tempDateRange?.from ?? ''}
            onChange={(e) =>
              setTempDateRange({ ...(tempDateRange ?? { from: '', to: null }), from: e.target.value })
            }
          />
          <input
          className='px-2 bg-white rounded-xl'
            type="date"
            value={tempDateRange?.to ?? ''}
            onChange={(e) =>
              setTempDateRange({ ...(tempDateRange ?? { from: '', to: null }), to: e.target.value || null })
            }
          />
          <button
            onClick={() => setDateRange(tempDateRange)}
            className="px-3 py-1 bg-red-400 text-white rounded"
          >
            Apply
          </button>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="p-2 rounded-xl bg-white"
        >
          <option value="">Sort By</option>
          <option value="rating_asc">Rating ↑</option>
          <option value="rating_desc">Rating ↓</option>
          <option value="date_newest">Date: Newest</option>
          <option value="date_oldest">Date: Oldest</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Average Rating Over Time</h2>
          {getRatingOverTime().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                data={getRatingOverTime()}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgRating" stroke="#d63f54" />
                </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-900">No data available for the current filters.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Approved vs Not Approved</h2>
          {getApprovedVsNotApproved().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie
                    data={getApprovedVsNotApproved()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                >
                    {getApprovedVsNotApproved().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-900">No data available for the current filters.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Rating Distribution</h2>
          {getRatingDistribution().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getRatingDistribution()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-900">No data available for the current filters.</p>
         )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Top Properties by Average Rating</h2>
          {getTopProperties().length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getTopProperties()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="property" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="averageRating" fill="#d99292" />
            </BarChart>
          </ResponsiveContainer>
          ) : (
            <p className="text-gray-900">No data available for the current filters.</p>
         )}
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Property</th>
              <th className="p-2 border">Guest</th>
              <th className="p-2 border">Review</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Approved</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((r) => (
              <tr key={r.id} className="text-sm">
                <td className="p-2 border">{r.listingName}</td>
                <td className="p-2 border">{r.guestName}</td>
                <td className="p-2 border max-w-xs">{r.publicReview}</td>
                <td className="p-2 border">{r.rating ?? '-'}</td>
                <td className="p-2 border">{r.type}</td>
                <td className="p-2 border">
                  {new Date(r.submittedAt).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={r.approved}
                    onChange={() => toggleApproval(r.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
