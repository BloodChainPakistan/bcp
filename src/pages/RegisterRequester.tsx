import { HeartPulse, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { requesterFromForm, insertRegistration } from '../lib/forms';
import { validateBloodRequest } from '../lib/validation';
import { geocode } from '../lib/geocode';
import { PK_CITIES } from '../lib/pkCities';
import PhoneField from '../components/PhoneField';
import Honeypot, { isHoneypotFilled } from '../components/Honeypot';

const GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const inputCls =
  'w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none';

/**
 * Public emergency blood-request intake. Anyone can submit; the row lands in the
 * admin command center as an "open" request (DB intake trigger forces safe
 * values), where staff match nearby eligible donors and alert them on WhatsApp.
 */
export default function RegisterRequester() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    if (isHoneypotFilled(fd)) { setSubmitStatus('success'); return; } // silently drop bots

    // Client-side guard (server still re-validates + forces safe values).
    const errs = validateBloodRequest({
      requester_name: String(fd.get('requester_name') || ''),
      requester_phone: String(fd.get('requester_phone') || ''),
      blood_group: String(fd.get('blood_group') || ''),
      units_needed: Number(fd.get('units_needed') || 0),
      city: String(fd.get('city') || ''),
      hospital_name: String(fd.get('hospital_name') || ''),
    });
    if (Object.keys(errs).length > 0) {
      setErrorMsg(Object.values(errs)[0]);
      setSubmitStatus('error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const payload = requesterFromForm(fd);
    const loc = await geocode(`${payload.city}, Pakistan`);
    const result = await insertRegistration(
      'blood_requests',
      loc ? { ...payload, lat: loc.lat, lng: loc.lng } : payload,
    );

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

  return (
    <div className="bg-bcp-light min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-bcp-red p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartPulse className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Request Blood</h1>
            <p className="text-red-100">
              Need blood urgently? Submit a request and our team will match and alert nearby
              verified donors right away.
            </p>
          </div>

          {submitStatus === 'success' ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Request Received</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Your blood request has been logged. Our team is matching nearby eligible donors and
                will contact you on the number you provided. For a life-threatening emergency, please
                also call your nearest hospital blood bank.
              </p>
              <button
                onClick={() => setSubmitStatus('idle')}
                className="bg-bcp-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10" noValidate>
              <Honeypot />
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium">{errorMsg || 'Something went wrong. Please check your details and try again.'}</p>
                </div>
              )}

              {/* Patient & requester */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">A. Patient &amp; Requester</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient name <span className="text-gray-400">(optional)</span></label>
                    <input name="patient_name" type="text" placeholder="Who the blood is for" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your name <span className="text-bcp-red">*</span></label>
                    <input name="requester_name" required type="text" placeholder="Person making the request" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact / WhatsApp number <span className="text-bcp-red">*</span></label>
                    <PhoneField name="requester_phone" required />
                  </div>
                </div>
              </section>

              {/* Requirement */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">B. Requirement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood group needed <span className="text-bcp-red">*</span></label>
                    <select name="blood_group" required defaultValue="" className={`${inputCls} bg-white`}>
                      <option value="">Select</option>
                      {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Units needed <span className="text-bcp-red">*</span></label>
                    <input name="units_needed" required type="number" min={1} max={20} defaultValue={1} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency <span className="text-bcp-red">*</span></label>
                    <select name="urgency" required defaultValue="urgent" className={`${inputCls} bg-white`}>
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="critical">Critical (emergency)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Needed by <span className="text-gray-400">(optional)</span></label>
                    <input name="needed_by" type="date" className={inputCls} />
                  </div>
                </div>
              </section>

              {/* Location */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">C. Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital / blood bank <span className="text-bcp-red">*</span></label>
                    <input name="hospital_name" required type="text" placeholder="e.g. Lady Reading Hospital" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City <span className="text-bcp-red">*</span></label>
                    <input name="city" required type="text" list="requester-cities" placeholder="e.g. Peshawar" className={inputCls} />
                    <datalist id="requester-cities">
                      {PK_CITIES.map((c) => <option key={c} value={c} />)}
                    </datalist>
                    <p className="mt-1 text-xs text-gray-400">Used to find the nearest eligible donors.</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional notes <span className="text-gray-400">(optional)</span></label>
                    <textarea name="notes" rows={2} placeholder="Ward / bed number, attending doctor, or anything that helps a donor reach you." className={`${inputCls} resize-none`}></textarea>
                  </div>
                </div>
              </section>

              <p className="text-sm text-gray-500">
                By submitting, you confirm the information is accurate and agree to our{' '}
                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-bcp-red font-medium hover:underline">Terms &amp; Conditions</Link>{' '}and{' '}
                <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="text-bcp-red font-medium hover:underline">Privacy Policy</Link>.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-bcp-red hover:bg-red-700'} text-white font-bold py-4 rounded-xl transition-all shadow-lg text-lg flex items-center justify-center gap-2`}
              >
                {isSubmitting ? 'Submitting…' : (
                  <>
                    <Send className="w-5 h-5 text-white" />
                    Submit Blood Request
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
