import { Handshake, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { partnerFromForm, insertRegistration } from '../lib/forms';
import { validatePartner } from '../lib/validation';
import { Link } from 'react-router-dom';
import { useFeature } from '../lib/featureFlags';
import RegistrationClosed from '../components/RegistrationClosed';
import PhoneField from '../components/PhoneField';
import Honeypot, { isHoneypotFilled } from '../components/Honeypot';

const PARTNERSHIP_TYPES = [
  'Blood supply coordination', 'Joint awareness campaigns',
  'Blood camp collaboration', 'Ethical data sharing',
  'Volunteer mobilization', 'Financial or logistical support',
];

export default function RegisterPartner() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    if (isHoneypotFilled(fd)) { setSubmitStatus('success'); return; } // silently drop bots
    const errs = validatePartner({
      focal_phone: String(fd.get('focal_phone') || ''),
      email: String(fd.get('email') || ''),
      focal_email: String(fd.get('focal_email') || ''),
    });
    if (Object.keys(errs).length) {
      setErrorMsg(Object.values(errs)[0]);
      setSubmitStatus('error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await insertRegistration('partners', partnerFromForm(fd));

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

  const registrationOn = useFeature('partner_registration');
  if (!registrationOn) return <RegistrationClosed title="Partner registration" />;

  return (
    <div className="bg-bcp-light min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-bcp-orange p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-8 h-8 fill-current" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Register as a Partner</h1>
            <p className="text-orange-100">Purpose: To establish official collaborations with hospitals, blood banks, and other organizations to ensure safe blood availability and promote blood activism.</p>
          </div>

          {submitStatus === 'success' ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Partnership Request Received!</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Thank you. Our partnerships team will review your details and get in touch to discuss next steps.
              </p>
              <button
                onClick={() => setSubmitStatus('idle')}
                className="bg-bcp-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Submit Another Request
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

              {/* Organization Info */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">A. Organization Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                    <input name="org_name" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select name="org_type" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                      <option value="">Select Type</option>
                      <option value="hospital">Hospital</option>
                      <option value="blood_bank">Blood Bank</option>
                      <option value="thalassemia_centre">Thalassemia Centre</option>
                      <option value="welfare_society">Blood Welfare Society</option>
                      <option value="corporate">Corporate Entity</option>
                      <option value="educational">Educational Institute</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                    <input name="reg_number" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Established</label>
                    <input name="year_established" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number (if applicable)</label>
                    <input name="license_number" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                </div>
              </section>

              {/* Official Contact Details */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">B. Official Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Head Office Address</label>
                    <textarea name="address" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input name="city" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                    <input name="province" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Official Phone Number</label>
                    <input name="phone" type="tel" placeholder="+92 3XX XXXXXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Official Email Address</label>
                    <input name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website / Social Media Link</label>
                    <input name="website" type="url" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                </div>
              </section>

              {/* Focal Person Details */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">C. Focal Person Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input name="focal_name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input name="focal_designation" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Direct Contact Number</label>
                    <PhoneField name="focal_phone" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input name="focal_email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                </div>
              </section>

              {/* Operational Details */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">D. Operational Details (For Blood Banks/Hospitals)</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <span className="font-medium text-gray-700">Do you have an in-house blood screening facility?</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input value="yes" type="radio" name="has_screening" className="text-bcp-red focus:ring-bcp-red" /> Yes</label>
                      <label className="flex items-center gap-2"><input value="no" type="radio" name="has_screening" className="text-bcp-red focus:ring-bcp-red" /> No</label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <span className="font-medium text-gray-700">Do you provide blood without replacement in emergencies?</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input value="yes" type="radio" name="provides_without_replacement" className="text-bcp-red focus:ring-bcp-red" /> Yes</label>
                      <label className="flex items-center gap-2"><input value="no" type="radio" name="provides_without_replacement" className="text-bcp-red focus:ring-bcp-red" /> No</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average monthly blood requirement/collection</label>
                    <input name="monthly_blood_volume" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                </div>
              </section>

              {/* Partnership Type */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">E. Partnership Type</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PARTNERSHIP_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-orange-50 cursor-pointer">
                      <input name="partnership_types" value={type} type="checkbox" className="rounded text-bcp-red focus:ring-bcp-red w-5 h-5" />
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Documentation Upload */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">F. Documentation Upload</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Certificate</label>
                    <input name="registration_certificate" type="file" accept="application/pdf,image/jpeg,image/png" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-bcp-orange hover:file:bg-orange-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MoU / Letter of Intent (Optional)</label>
                    <input name="mou_file" type="file" accept="application/pdf" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-bcp-orange hover:file:bg-orange-100" />
                  </div>
                </div>
              </section>

              {/* Agreement & Ethics */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">G. Agreement & Ethics</h2>
                <div className="space-y-4">
                  <label className="flex items-start gap-3">
                    <input name="confirm_legal" required type="checkbox" className="mt-1 text-bcp-red focus:ring-bcp-red rounded" />
                    <span className="text-gray-700">We confirm that our organization operates legally and ethically.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input name="confirm_transparency" required type="checkbox" className="mt-1 text-bcp-red focus:ring-bcp-red rounded" />
                    <span className="text-gray-700">We agree to maintain transparency in blood coordination.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input name="confirm_no_misuse" required type="checkbox" className="mt-1 text-bcp-red focus:ring-bcp-red rounded" />
                    <span className="text-gray-700">We will not misuse donor data provided by Blood Chain Pakistan.</span>
                  </label>
                </div>
              </section>

              <p className="text-sm text-gray-500 mb-4">
                By submitting, you confirm your organization’s ethical commitment and agree to our{' '}
                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-bcp-red font-medium hover:underline">Terms &amp; Conditions</Link>{' '}and{' '}
                <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="text-bcp-red font-medium hover:underline">Privacy Policy</Link>.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-bcp-orange hover:bg-orange-600'} text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-lg flex items-center justify-center gap-2`}
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Partnership Request
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
