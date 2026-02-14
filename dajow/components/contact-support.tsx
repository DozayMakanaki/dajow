"use client"

import { useState } from "react"
import { Phone, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const phones = [
  { number: "+447704335223", display: "+44 7704 335223" },
  { number: "+447763701737", display: "+44 7763 701737" },
  { number: "+447920693240", display: "+44 7920 693240" },
]

const email = "aloziemaureen89@gmail.com"

export default function ContactSupport() {
  const [selectedPhone, setSelectedPhone] = useState(phones[0].number)

  const handleCall = () => {
    window.location.href = `tel:${selectedPhone}`
  }

  const handleSMS = () => {
    window.location.href = `sms:${selectedPhone}`
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi, I need help with my order.")
    window.open(`https://wa.me/${selectedPhone.replace("+", "")}?text=${message}`, "_blank")
  }

  const handleEmail = () => {
    window.location.href = `mailto:${email}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help! Choose your preferred way to contact us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Phone Selection Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Call or Message Us</h3>
                <p className="text-sm text-gray-500">Choose a number below</p>
              </div>
            </div>

            {/* Phone Number Selection */}
            <div className="space-y-3 mb-6">
              {phones.map((phone) => (
                <label
                  key={phone.number}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPhone === phone.number
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="phone"
                    checked={selectedPhone === phone.number}
                    onChange={() => setSelectedPhone(phone.number)}
                    className="w-5 h-5 accent-orange-600"
                  />
                  <span className="font-semibold text-gray-900">{phone.display}</span>
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={handleCall}
                className="flex-col h-24 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Phone className="h-6 w-6 mb-2" />
                <span className="text-sm font-semibold">Call</span>
              </Button>

              <Button
                onClick={handleSMS}
                className="flex-col h-24 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <MessageCircle className="h-6 w-6 mb-2" />
                <span className="text-sm font-semibold">SMS</span>
              </Button>

              <Button
                onClick={handleWhatsApp}
                className="flex-col h-24 bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-6 w-6 mb-2" />
                <span className="text-sm font-semibold">WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Email Us</h3>
                <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Email Address:</p>
              
                href={`mailto:${email}`}
                className="text-lg font-semibold text-orange-600 hover:text-orange-700 break-all"
              
                {email}
              
            </div>

            <Button
              onClick={handleEmail}
              className="w-full bg-orange-600 hover:bg-orange-700 h-12"
            >
              <Mail className="mr-2 h-5 w-5" />
              Send Email
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Quick Response</h4>
            <p className="text-sm text-gray-600">Average response time under 2 hours during business hours</p>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">WhatsApp Support</h4>
            <p className="text-sm text-gray-600">Get instant help via WhatsApp messaging</p>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Email Support</h4>
            <p className="text-sm text-gray-600">Detailed inquiries answered within 24 hours</p>
          </div>
        </div>
      </div>
</div>
  )
}