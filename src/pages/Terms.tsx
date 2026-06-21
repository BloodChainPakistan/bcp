import { FileText } from 'lucide-react';

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'Acceptance of these terms',
    body: [
      'By accessing or using the Blood Chain Pakistan (BCP) website and services, you agree to these Terms & Conditions. If you do not agree, please do not use the site or submit any information through it.',
    ],
  },
  {
    heading: 'About our service',
    body: [
      'BCP is a non-profit, volunteer-driven welfare organization that facilitates voluntary blood donation and connects willing donors with patients in need. BCP is a facilitator and awareness platform — it is not a hospital, blood bank, or medical provider, and does not itself collect, test, store, or transfuse blood.',
    ],
  },
  {
    heading: 'No medical guarantee',
    body: [
      'BCP does not guarantee the availability, suitability, or compatibility of any blood donor or donation. All medical decisions, screening, cross-matching, and transfusions must be carried out by qualified medical professionals and licensed facilities. Information on this site is for general awareness and coordination only and is not medical advice.',
    ],
  },
  {
    heading: 'Your responsibilities',
    body: [
      'You agree to provide accurate, current, and complete information when registering as a donor, volunteer, or partner. Donors must disclose health information honestly so eligibility can be assessed responsibly. Voluntary blood donation through BCP is unpaid; buying or selling blood is strictly prohibited.',
    ],
  },
  {
    heading: 'Acceptable use & data protection',
    body: [
      'You must not misuse the platform, attempt to access data you are not authorized to, submit false or malicious entries, or use any contact information obtained through BCP for spam, harassment, or any unlawful purpose.',
      'Donor and partner data made available through coordination must be used solely for the purpose of facilitating a specific, consented blood donation — never for marketing, resale, or any unrelated purpose.',
    ],
  },
  {
    heading: 'Volunteers & partners',
    body: [
      'Volunteers and partner organizations agree to act ethically and lawfully, to follow BCP coordination guidelines, and to maintain the confidentiality and integrity of any donor information they handle.',
    ],
  },
  {
    heading: 'Limitation of liability',
    body: [
      'To the maximum extent permitted by law, BCP and its volunteers are not liable for any loss, harm, or damages arising from the use of this platform, from interactions between donors and recipients, or from reliance on information provided through the site. Coordination is provided on a best-effort, good-faith basis.',
    ],
  },
  {
    heading: 'Changes to these terms',
    body: [
      'We may update these Terms & Conditions from time to time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.',
    ],
  },
  {
    heading: 'Governing law',
    body: [
      'These terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes shall be subject to the jurisdiction of the courts of Pakistan.',
    ],
  },
  {
    heading: 'Contact us',
    body: [
      'For any question about these terms, email bloodchainpakistan@gmail.com or call our helpline at 0349-9021062.',
    ],
  },
];

export default function Terms() {
  return (
    <div className="bg-white">
      <div className="bg-bcp-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-bcp-red mb-6">
            <FileText className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms &amp; Conditions</h1>
          <p className="text-gray-300">The rules and terms for using the Blood Chain Pakistan platform.</p>
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
          Blood Chain Pakistan should have these terms reviewed by a qualified professional before
          relying on them for compliance purposes.
        </p>
      </div>
    </div>
  );
}
