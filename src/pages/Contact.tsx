import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import FaqSection from '../components/FaqSection';

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Replace template_id and public_key when available
    emailjs.sendForm(
      'service_75m4c3a',
      'template_7xstqxe', // Placeholder, please update with your actual Template ID
      formRef.current,
      'ZWbspr-J4XgqVBIUA' // Placeholder, please update with your actual Public Key
    )
      .then(() => {
        setSubmitStatus('success');
        formRef.current?.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        setSubmitStatus('error');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-bcp-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're here to help. Reach out for emergencies, partnerships, or general inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-bcp-red text-white p-8 rounded-3xl shadow-lg">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Emergency Blood Request</h3>
              <p className="text-red-100 mb-4">Dedicated WhatsApp & Helpline</p>
              <p className="text-3xl font-bold tracking-wider">0349-9021065</p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-bcp-light rounded-full flex items-center justify-center mb-6 text-bcp-dark">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-bcp-dark mb-2">Head Office</h3>
              <p className="text-gray-600">
                Luqman Health Care, Shinwari Plaza<br />
                Nasir Bagh Road, Peshawar
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-bcp-light rounded-full flex items-center justify-center mb-6 text-bcp-dark">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-bcp-dark mb-2">Email Us</h3>
              <p className="text-gray-600">bloodchainpakistan@gmail.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white border border-gray-100 p-8 md:p-12 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-8 h-8 text-bcp-red" />
              <h2 className="text-3xl font-bold text-bcp-dark">Send a Message</h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    name="from_name"
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red focus:border-transparent outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    name="phone"
                    required
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red focus:border-transparent outline-none transition-all"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    name="city"
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red focus:border-transparent outline-none transition-all"
                    placeholder="Your city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                  <select
                    name="blood_group"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <select
                  name="purpose"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">Select Purpose</option>
                  <option value="donor">Donor</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="partner">Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red focus:border-transparent outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-bcp-dark hover:bg-gray-900'} text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium">
                  Something went wrong. Please try again later.
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      <FaqSection />
    </div>
  );
}
