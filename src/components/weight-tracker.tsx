'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { logWeight, deleteWeightRecord } from '@/app/actions/weight'
import { Trash2, Scale } from 'lucide-react'
import { useLanguage } from './language-provider'

type WeightRecord = {
  id: string
  weightKg: number
  recordDate: Date
}

export function WeightTracker({ records }: { records: WeightRecord[] }) {
  const [weightInput, setWeightInput] = useState('')
  const [dateInput, setDateInput] = useState(() => {
    const today = new Date()
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()

  const sortedRecords = [...records].sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime())

  const chartData = sortedRecords.map(r => ({
    id: r.id,
    date: new Date(r.recordDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: new Date(r.recordDate).toLocaleDateString(),
    weight: r.weightKg
  }))

  const weights = sortedRecords.map(r => r.weightKg)
  const minWeight = weights.length ? Math.floor(Math.min(...weights) - 2) : 0
  const maxWeight = weights.length ? Math.ceil(Math.max(...weights) + 2) : 100

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!weightInput) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('weightKg', weightInput)
    formData.append('date', dateInput)

    try {
      await logWeight(formData)
      setWeightInput('')
    } catch (err) {
      console.error(err)
      alert('Failed to log weight')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Scale className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          {t('weightProgress')}
        </h2>
        
        {chartData.length > 0 ? (
          <div className="h-56 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" strokeOpacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} dy={10} />
                <YAxis domain={[minWeight, maxWeight]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                <Tooltip 
                  cursor={{ stroke: '#0d9488', strokeWidth: 1, strokeDasharray: '3 3' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  formatter={(value: any) => [`${value} kg`, 'Weight']}
                  labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#0d9488" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-56 flex items-center justify-center text-zinc-400 text-sm italic border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl">
            No weight data logged yet.
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h3 className="font-bold mb-4">{t('logWeight')}</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <input 
                type="date" 
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                required
              />
            </div>
            <div>
              <input 
                type="number" 
                step="0.1" 
                min="20"
                max="300"
                value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                placeholder="Weight in kg (e.g. 70.5)"
                className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl" disabled={isSubmitting}>
              {t('save')}
            </Button>
          </form>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h3 className="font-bold mb-4">{t('history')}</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {[...sortedRecords].reverse().map(record => (
              <div key={record.id} className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 group">
                <div>
                  <div className="font-semibold text-lg text-teal-700 dark:text-teal-400">{record.weightKg} <span className="text-sm text-zinc-500 font-normal">kg</span></div>
                  <div className="text-xs text-zinc-500">{new Date(record.recordDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
                <button 
                  onClick={() => confirm('Delete this record?') && deleteWeightRecord(record.id)}
                  className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {sortedRecords.length === 0 && (
              <div className="text-sm text-zinc-500 italic text-center py-4">No records found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
