import { Shield } from 'lucide-react';

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'Who we are',
    body: [
      'Blood Chain Pakistan (BCP) is a non-profit, volunteer-driven welfare organization working to make safe blood available across Pakistan. This policy explains what personal information we collect, why we collect it, and how we protect it.',
    ],
  },
  {
    heading: 'Information we collect',
    body: [
      'When you register as a donor, volunteer, or partner, we collect the details you provide — such as name, contact number, email, city/area, blood group, and (for donors) basic health-eligibility information.',
      'We collect this information only because you choose to submit it, and only to operate our blood-donation and matching services.',
    ],
  },
  {
    heading: 'Why we collect it',
    body: [
      'To maintain a verified donor registry, to match willing donors with patients in need, to coordinate blood-donation activities, and to contact you about donation opportunities you have consented to.',
      'We do not sell your personal information, and we do not use it for advertising.',
    ],
  },
  {
    heading: 'Consent',
    body: [
      'We process your information on the basis of the consent you give when you submit a form. You can withdraw your consent at any time by contacting us, after which we will stop contacting you and remove or deactivate your record.',
    ],
  },
  {
    heading: 'How we protect your data',
    body: [
      'Your data is stored in a managed, access-controlled database. Access is restricted by role, and sensitive contact details are never shown publicly. Donor contact information is shared with a requester only after the donor accepts a specific blood request.',
      'We keep an internal audit trail of changes to support accountability and investigation in case of misuse.',
    ],
  },
  {
    heading: 'Who can see your information',
    body: [
      'Only authorized BCP administrators and, where relevant, verified partner hospitals coordinating a specific request. We do not share donor data with third parties for any purpose other than facilitating blood donation, and never without the protections described above.',
    ],
  },
  {
    heading: 'Data retention',
    body: [
      'We retain your information for as long as you remain part of our donor/volunteer/partner community or as required to provide our services. You may request deletion at any time.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'You may request to access, correct, or delete your personal information, or to stop being contacted. To make any such request, contact us using the details below.',
    ],
  },
  {
    heading: 'Contact us',
    body: [
      'For any privacy question or data request, email bloodchainpakistan@gmail.com or call our helpline at 0349-9021062.',
    ],
  },
];

export default function Privacy() {
  return (
    <div className="bg-white">
      <div className="bg-bcp-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-bcp-red mb-6">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-300">How Blood Chain Pakistan collects, uses, and protects your information.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm text-gray-400 mb-10">Last updated: 18 June 2026</p>

        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.heading}>
              <h2 className="text-2xl font-bold text-bcp-dark mb-4">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-3">{p}</p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-12 text-sm text-gray-400 border-t border-gray-100 pt-6">
          This page is provided for transparency and is not a substitute for formal legal advice.
          Blood Chain Pakistan should have this policy reviewed by a qualified professional before
          relying on it for compliance purposes.
        </p>
      </div>
    </div>
  );
}
