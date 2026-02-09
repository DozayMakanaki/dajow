"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Save, X, MapPin, Phone, Building, CheckCircle } from "lucide-react"

interface UserProfile {
  displayName: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
}

export default function ProfileDetails({ userId, user }: { userId: string; user: any }) {
  const [profile, setProfile] = useState<UserProfile>({
    displayName: user?.displayName || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: ""
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [userId])

  async function loadProfile() {
    try {
      const docRef = doc(db, "users", userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setProfile({ ...profile, ...docSnap.data() })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const docRef = doc(db, "users", userId)
      await setDoc(docRef, profile, { merge: true })
      setEditing(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>
  }

  return (
    <div className="p-6 md:p-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800 font-medium">Profile updated successfully!</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>
        {!editing ? (
          <Button
            onClick={() => setEditing(true)}
            variant="outline"
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => setEditing(false)}
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Building className="h-4 w-4 text-orange-600" />
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                disabled={!editing}
                className="disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!editing}
                placeholder="+234 XXX XXX XXXX"
                className="disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-600" />
            Delivery Address
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <Input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                disabled={!editing}
                placeholder="123 Main Street"
                className="disabled:opacity-60"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  disabled={!editing}
                  placeholder="Lagos"
                  className="disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Input
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  disabled={!editing}
                  placeholder="Lagos State"
                  className="disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <Input
                  value={profile.postalCode}
                  onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                  disabled={!editing}
                  placeholder="100001"
                  className="disabled:opacity-60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        {!editing && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              💡 <strong>Tip:</strong> Keep your profile up to date to ensure smooth delivery of your orders.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
