import { motion } from 'motion/react';
import { Phone, Send } from 'lucide-react';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactSection() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        emailjs.sendForm(
            'service_75m4c3a',
            'template_7xstqxe',
            formRef.current,
            'ZWbspr-J4XgqVBIUA'
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
        <section className="py-32 bg-bcp-dark text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-bcp-red font-bold tracking-widest uppercase mb-4 text-sm">Get in Touch</h2>
                        <h3 className="text-4xl md:text-5xl font-semibold mb-8">Have questions or need assistance?</h3>
                        <p className="text-gray-400 text-lg mb-12 max-w-lg">
                            Whether you're looking to donate, volunteer, or partner with us, our team is ready to help you make an impact.
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-bcp-red" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Emergency Helpline</div>
                                    <div className="text-xl font-bold">0349-9021065</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2rem] p-8 md:p-12 text-bcp-dark"
                    >
                        <h4 className="text-2xl font-bold mb-8">Send us a message</h4>
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input 
                                        name="from_name"
                                        required
                                        type="text" 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" 
                                        placeholder="Your name" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input 
                                        name="phone"
                                        required
                                        type="tel" 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" 
                                        placeholder="Your phone" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                                    <select 
                                        name="blood_group"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white"
                                    >
                                        <option value="">Select</option>
                                        <option value="A+">A+</option><option value="A-">A-</option>
                                        <option value="B+">B+</option><option value="B-">B-</option>
                                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                        <option value="O+">O+</option><option value="O-">O-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input 
                                        name="city"
                                        required
                                        type="text" 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" 
                                        placeholder="Your city" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                                <select 
                                    name="purpose"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white"
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
                                    rows={3} 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none resize-none" 
                                    placeholder="How can we help?"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-bcp-red hover:bg-red-700'} text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        <Send className="w-5 h-5 text-white" />
                                        Send Message
                                    </>
                                )}
                            </button>

                            {submitStatus === 'success' && (
                                <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium">
                                    Message sent successfully!
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium">
                                    Something went wrong. Please try again.
                                </div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
