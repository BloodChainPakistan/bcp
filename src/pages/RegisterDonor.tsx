import { Droplet, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { donorFromForm, insertRegistration } from '../lib/forms';
import { validateDonor } from '../lib/validation';
import { geocode } from '../lib/geocode';
import { Link } from 'react-router-dom';
import { useFeature } from '../lib/featureFlags';
import RegistrationClosed from '../components/RegistrationClosed';
import PhoneField from '../components/PhoneField';
import Honeypot, { isHoneypotFilled } from '../components/Honeypot';

export default function RegisterDonor() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    if (isHoneypotFilled(fd)) { setSubmitStatus('success'); return; } // silently drop bots
    const errs = validateDonor({
      phone: String(fd.get('phone_primary') || ''),
      email: String(fd.get('email') || ''),
      weight: String(fd.get('weight') || ''),
    });
    if (Object.keys(errs).length) {
      setErrorMsg(Object.values(errs)[0]);
      setSubmitStatus('error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const payload = donorFromForm(fd);
    const loc = await geocode([payload.address, payload.district, payload.city].filter(Boolean).join(', '));
    const result = await insertRegistration('donors', loc ? { ...payload, lat: loc.lat, lng: loc.lng } : payload);

    if (result.ok) {
      setSubmitStatus('success');
      formRef.current.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMsg(result.error);
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  const registrationOn = useFeature('donor_registration');
  if (!registrationOn) return <RegistrationClosed title="Donor registration" />;

  return (
    <div className="bg-bcp-light min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-bcp-red p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplet className="w-8 h-8 fill-current" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Register as a Donor</h1>
            <p className="text-red-100">Purpose: To build a reliable, verified voluntary blood donor database for emergency and scheduled donation needs.</p>
          </div>

          {submitStatus === 'success' ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Registration Successful!</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Thank you for registering as a blood donor. You are now part of a life-saving community. We will contact you when there's a need.
              </p>
              <button
                onClick={() => setSubmitStatus('idle')}
                className="bg-bcp-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Register Another Donor
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
              <Honeypot />
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">{errorMsg || 'Something went wrong. Please check your connection and try again.'}</p>
                </div>
              )}

              {/* Basic Info */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">A. Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name (as per CNIC)</label>
                    <input name="full_name" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input name="dob" required type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select name="gender" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                    <select name="blood_group" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                      <option value="">Select</option>
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation / University / Organization</label>
                    <input name="occupation" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                </div>
              </section>

              {/* Contact Details */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">B. Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact / WhatsApp Number</label>
                    <PhoneField name="phone_primary" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input name="city" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <input name="district" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                    <textarea name="address" required rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none resize-none"></textarea>
                  </div>
                </div>
              </section>

              {/* Health & Eligibility */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">C. Health & Eligibility Screening</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Have you donated blood before?</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input value="Yes" type="radio" name="donated_before" className="text-bcp-red focus:ring-bcp-red" /> Yes</label>
                      <label className="flex items-center gap-2"><input value="No" type="radio" name="donated_before" className="text-bcp-red focus:ring-bcp-red" /> No</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last donation date</label>
                      <input name="last_donation" type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                      <input name="weight" required type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Any chronic disease? (Diabetes, Hepatitis, Heart Disease, etc.)</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input value="Yes" type="radio" name="chronic_disease" className="text-bcp-red focus:ring-bcp-red" /> Yes</label>
                      <label className="flex items-center gap-2"><input value="No" type="radio" name="chronic_disease" className="text-bcp-red focus:ring-bcp-red" /> No</label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Currently on medication?</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input value="Yes" type="radio" name="medication" className="text-bcp-red focus:ring-bcp-red" /> Yes</label>
                      <label className="flex items-center gap-2"><input value="No" type="radio" name="medication" className="text-bcp-red focus:ring-bcp-red" /> No</label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Recent surgery (last 6 months)?</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input value="Yes" type="radio" name="recent_surgery" className="text-bcp-red focus:ring-bcp-red" /> Yes</label>
                      <label className="flex items-center gap-2"><input value="No" type="radio" name="recent_surgery" className="text-bcp-red focus:ring-bcp-red" /> No</label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Vaccination in last 30 days?</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input value="Yes" type="radio" name="vaccination" className="text-bcp-red focus:ring-bcp-red" /> Yes</label>
                      <label className="flex items-center gap-2"><input value="No" type="radio" name="vaccination" className="text-bcp-red focus:ring-bcp-red" /> No</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel history (if applicable)</label>
                    <input name="travel_history" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">For female donors: Are you pregnant or breastfeeding?</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input value="Yes" type="radio" name="female_screening" className="text-bcp-red focus:ring-bcp-red" /> Yes</label>
                      <label className="flex items-center gap-2"><input value="No" type="radio" name="female_screening" className="text-bcp-red focus:ring-bcp-red" /> No</label>
                      <label className="flex items-center gap-2"><input value="N/A" type="radio" name="female_screening" className="text-bcp-red focus:ring-bcp-red" /> N/A</label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Donation Availability */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">D. Donation Availability</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available for:</label>
                    <select name="available_for" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                      <option value="">Select</option>
                      <option value="Emergency calls">Emergency calls</option>
                      <option value="Scheduled blood camps">Scheduled blood camps</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred time:</label>
                    <select name="preferred_time" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                      <option value="">Select</option>
                      <option value="Weekdays">Weekdays</option>
                      <option value="Weekends">Weekends</option>
                      <option value="Anytime">Anytime</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Consent & Declaration */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">E. Consent & Declaration</h2>
                <div className="space-y-6">
                  <div className="bg-red-50 p-6 rounded-xl space-y-3 border border-red-100">
                    <label className="flex items-start gap-3">
                      <input name="consent_accuracy" required type="checkbox" className="mt-1 rounded text-bcp-red focus:ring-bcp-red w-5 h-5" />
                      <span className="text-sm text-gray-800">I confirm that the information provided is accurate.</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input name="consent_voluntary" required type="checkbox" className="mt-1 rounded text-bcp-red focus:ring-bcp-red w-5 h-5" />
                      <span className="text-sm text-gray-800">I understand voluntary blood donation is unpaid.</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input name="consent_contact" required type="checkbox" className="mt-1 rounded text-bcp-red focus:ring-bcp-red w-5 h-5" />
                      <span className="text-sm text-gray-800">I consent to being contacted for blood donation purposes.</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload blood group report (Optional)</label>
                      <input name="report_file" type="file" accept="application/pdf,image/jpeg,image/png" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-bcp-red hover:file:bg-red-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add referral code (Optional)</label>
                      <input name="referral_code" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                    </div>
                  </div>
                </div>
              </section>

              <p className="text-sm text-gray-500 mb-4">
                By submitting, you confirm the information provided is accurate and agree to our{' '}
                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-bcp-red font-medium hover:underline">Terms &amp; Conditions</Link>{' '}and{' '}
                <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="text-bcp-red font-medium hover:underline">Privacy Policy</Link>.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-bcp-red hover:bg-red-700'} text-white font-bold py-4 rounded-xl transition-all shadow-lg text-lg flex items-center justify-center gap-2`}
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="w-5 h-5 text-white" />
                    Submit Registration
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
