import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile-form'
import { ProfileAvatar } from '@/components/profile-avatar'
import { ProfilePageClient } from '@/components/profile-page-client'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.email) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true }
  })

  if (!user) return null

  const userData = {
    email: user.email,
    name: user.name,
    image: user.image,
  }

  const profileData = user.profile ? {
    age: user.profile.age,
    gender: user.profile.gender,
    heightCm: user.profile.heightCm,
    weightKg: user.profile.weightKg,
    activityLevel: user.profile.activityLevel,
    fitnessGoal: user.profile.fitnessGoal,
  } : null

  return (
    <ProfilePageClient user={userData} profile={profileData} />
  )
}
