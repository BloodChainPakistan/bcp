import { Users, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { volunteerFromForm, insertRegistration } from '../lib/forms';
import { validateVolunteer } from '../lib/validation';
import { Link } from 'react-router-dom';
import { useFeature } from '../lib/featureFlags';
import RegistrationClosed from '../components/RegistrationClosed';
import PhoneField from '../components/PhoneField';
import Honeypot, { isHoneypotFilled } from '../components/Honeypot';
import CnicField from '../components/CnicField';

const INTERESTS = [
  'Blood Camp Management', 'Donor Coordination', 'Social Media & Media',
  'Event Management', 'Research & Documentation', 'Fundraising',
  'Campus Ambassador', 'Medical Support', 'Administration',
];

export default function RegisterMember() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    if (isHoneypotFilled(fd)) { setSubmitStatus('success'); return; } // silently drop bots
    const errs = validateVolunteer({
      phone: String(fd.get('phone') || ''),
      cnic: String(fd.get('cnic') || ''),
      email: String(fd.get('email') || ''),
    });
    if (Object.keys(errs).length) {
      setErrorMsg(Object.values(errs)[0]);
      setSubmitStatus('error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await insertRegistration('volunteers', volunteerFromForm(fd));

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

  const registrationOn = useFeature('volunteer_registration');
  if (!registrationOn) return <RegistrationClosed title="Volunteer registration" />;

  return (
    <div className="bg-bcp-light min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-bcp-dark p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Become a BCP Volunteer</h1>
            <p className="text-gray-300">Purpose: To recruit committed volunteers and leaders who will actively contribute to blood activism and organizational growth.</p>
          </div>

          {submitStatus === 'success' ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Application Received!</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Thank you for stepping up. Our team will review your application and reach out about next steps.
              </p>
              <button
                onClick={() => setSubmitStatus('idle')}
                className="bg-bcp-dark hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Submit Another Application
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

              {/* Personal Info */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">A. Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input name="full_name" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                    <input name="father_name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CNIC</label>
                    <CnicField name="cnic" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input name="dob" type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select name="gender" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                    <input name="qualification" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profession / Student (mention institute)</label>
                    <input name="profession" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">B. Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact / WhatsApp Number</label>
                    <PhoneField name="phone" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input name="city" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <input name="district" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                </div>
              </section>

              {/* Area of Interest */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">C. Area of Interest (Multi-select)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {INTERESTS.map((interest) => (
                    <label key={interest} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input name="interests" value={interest} type="checkbox" className="rounded text-bcp-red focus:ring-bcp-red w-5 h-5" />
                      <span className="text-sm font-medium text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Experience & Skills */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">D. Experience & Skills</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous volunteer experience</label>
                    <textarea name="prev_volunteer_experience" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Leadership experience</label>
                    <textarea name="leadership_experience" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none resize-none"></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Social media handling</label>
                      <select name="skill_social_media" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                        <option value="">Select</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Graphic design / video editing</label>
                      <select name="skill_design" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                        <option value="">Select</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Public speaking ability</label>
                      <select name="skill_public_speaking" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                        <option value="">Select</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Availability & Commitment */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">E. Availability & Commitment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours per week available</label>
                    <input name="hours_per_week" type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Willing to travel within city?</label>
                    <select name="willing_to_travel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Willing to lead a local team?</label>
                    <select name="willing_to_lead" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none bg-white">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Motivation Section */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">F. Motivation Section</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join Blood Chain Pakistan?</label>
                    <textarea name="motivation_join" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What does blood activism mean to you?</label>
                    <textarea name="motivation_activism" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How can you contribute uniquely?</label>
                    <textarea name="unique_contribution" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none resize-none"></textarea>
                  </div>
                </div>
              </section>

              {/* Declaration */}
              <section>
                <h2 className="text-xl font-bold text-bcp-dark border-b pb-2 mb-6">G. Declaration</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl space-y-3 border border-gray-100">
                    <label className="flex items-start gap-3">
                      <input name="agree_policies" required type="checkbox" className="mt-1 rounded text-bcp-red focus:ring-bcp-red w-5 h-5" />
                      <span className="text-sm text-gray-800">I agree to follow organizational policies.</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input name="commit_voluntary" required type="checkbox" className="mt-1 rounded text-bcp-red focus:ring-bcp-red w-5 h-5" />
                      <span className="text-sm text-gray-800">I commit to voluntary service.</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload CV (Optional)</label>
                      <input name="cv_file" type="file" accept="application/pdf" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-bcp-dark hover:file:bg-gray-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload recent photograph (Optional)</label>
                      <input name="photo_file" type="file" accept="image/jpeg,image/png,image/webp" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-bcp-dark hover:file:bg-gray-200" />
                    </div>
                  </div>
                </div>
              </section>

              <p className="text-sm text-gray-500 mb-4">
                By submitting, you confirm your commitment as a volunteer and agree to our{' '}
                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-bcp-red font-medium hover:underline">Terms &amp; Conditions</Link>{' '}and{' '}
                <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="text-bcp-red font-medium hover:underline">Privacy Policy</Link>.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-bcp-dark hover:bg-gray-900'} text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-lg flex items-center justify-center gap-2`}
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
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
