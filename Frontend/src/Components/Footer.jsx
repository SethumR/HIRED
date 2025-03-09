"use client"

import { useState } from "react"
import { Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react"
import { Link as ScrollLink } from 'react-scroll';

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e) => {
    e.preventDefault()
    // Add your subscription logic here
    console.log("Subscribing email:", email)
    setEmail("")
    // You could add a success message or API call here
  }

  return (
    <footer className="bg-[#0b0f1c] text-gray-300 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
        {/* Company Info */}
        <div>
          <h2 className="text-white text-xl font-bold mb-4">Hired</h2>
          <p className="mb-6">"Your AI-powered mock interview companion. Prepare with real-time feedback, AI-driven insights, and personalized coaching to ace your next interview with confidence."</p>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/hired.solutions/"
              className="hover:text-white transition-colors p-2 rounded-full bg-slate-800"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/hired.solutions/posts/?feedView=all"
              className="hover:text-white transition-colors p-2 rounded-full bg-slate-800"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-medium mb-4 ml-0 sm:ml-8">Quick Links</h3>
          <ul className="space-y-3 ml-0 sm:ml-8">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-medium mb-4">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
              <span>123, Hired Colombo, Srilanka</span>
            </li>
            <li className="flex items-center">
              <Phone size={18} className="mr-2 flex-shrink-0" />
              <span>+94 756413574</span>
            </li>
            <li className="flex items-center">
              <Mail size={18} className="mr-2 flex-shrink-0" />
              <span>hired.infous@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Updates */}
        <div>
          <h3 className="text-white text-lg font-medium mb-4">Updates</h3>
          <p className="mb-4">Stay tuned for updates and special offers.</p>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-[#1a2436] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              required
            />
            <button
              type="submit"
              className="w-full bg-white text-black font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="fixed bottom-1 -right-2">
  <ScrollLink
    to="contact" // ID of the target section
    smooth={true}
    duration={500}
    offset={-110}
    className="cursor-pointer"
  >
    <img 
      src="animated.gif" 
      alt="example gif" 
      className="w-30 h-[100px]" 
    />
  </ScrollLink>
</div>

     {/* Bottom Section */}
      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-gray-800  text-center mb-4">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <p>© 2025 Hired. All rights reserved.</p>
        </div>
      </div>


    </footer>
  )
}

