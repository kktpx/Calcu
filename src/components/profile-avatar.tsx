'use client'

import { useState, useRef } from 'react'
import { Camera, Pencil, Check, X } from 'lucide-react'
import { updateUserInfo } from '@/app/actions/user'
import { useLanguage } from './language-provider'

type UserData = {
  email: string
  name: string | null
  image: string | null
}

export function ProfileAvatar({ user }: { user: UserData }) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(user.name || user.email.split('@')[0])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  const displayName = user.name || user.email.split('@')[0]
  const avatarLetter = displayName[0].toUpperCase()

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('name', nameValue)
      await updateUserInfo(formData)
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleNameSave() {
    if (!nameValue.trim()) return
    try {
      const formData = new FormData()
      formData.append('name', nameValue.trim())
      await updateUserInfo(formData)
      setIsEditingName(false)
    } catch (err) {
      console.error(err)
      alert('Failed to update name')
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="relative group"
        title={t('changePhoto')}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={displayName}
            className="w-14 h-14 rounded-full object-cover border-2 border-zinc-100 dark:border-zinc-800"
          />
        ) : (
          <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center text-xl font-bold">
            {avatarLetter}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-5 h-5 text-white" />
        </div>
      </button>

      <div className="flex-1 min-w-0">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              className="text-lg font-bold bg-transparent border-b-2 border-teal-500 outline-none w-full py-0.5"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave()
                if (e.key === 'Escape') { setIsEditingName(false); setNameValue(displayName) }
              }}
            />
            <button onClick={handleNameSave} className="p-1 text-teal-600 hover:text-teal-700">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => { setIsEditingName(false); setNameValue(displayName) }} className="p-1 text-zinc-400 hover:text-zinc-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg truncate">{displayName}</h1>
            <button
              onClick={() => setIsEditingName(true)}
              className="p-1 text-zinc-400 hover:text-teal-600 transition-colors"
              title={t('editName')}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <p className="text-sm text-zinc-500 truncate">{user.email}</p>
      </div>
    </div>
  )
}
