import { themePhoto } from '../lib/stockPhotos';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

export const mockBlogs: BlogPost[] = [
  {
    id: "1",
    title: "The Lifesaving Power of Regular Blood Donation",
    excerpt: "Discover how a simple act of donating blood can save up to three lives and improve your own cardiovascular health.",
    content: `
      <p>Blood donation is one of the most significant contributions that a person can make towards society. It is not harmful to an adult person to donate blood. The body of the donor can regenerate the blood within a few days.</p>
      <h2>Why Donate Blood?</h2>
      <p>Every two seconds, someone needs blood. Since blood cannot be manufactured outside the body and has a limited shelf life, the supply must constantly be replenished by generous blood donors.</p>
      <ul>
        <li><strong>Saves Lives:</strong> A single donation can save up to three lives.</li>
        <li><strong>Health Benefits:</strong> Regular blood donation is linked to lower blood pressure and a lower risk of heart attacks.</li>
        <li><strong>Free Health Checkup:</strong> Before donating, you receive a mini-physical to check your pulse, blood pressure, body temperature, and hemoglobin levels.</li>
      </ul>
      <h2>The Donation Process</h2>
      <p>The process is simple and safe. It takes about 10-15 minutes to donate the blood, and the entire process from registration to refreshments takes about an hour.</p>
      <blockquote>"You don't have to be a doctor to save lives. Just donate blood."</blockquote>
      <p>Join us in our mission to ensure that no one suffers due to a lack of blood. Your contribution matters.</p>
    `,
    category: "Blood Education",
    author: "Dr. Ayesha Khan",
    date: "October 12, 2023",
    readTime: "5 min read",
    imageUrl: themePhoto('bloodDonationArm')
  },
  {
    id: "2",
    title: "Understanding Thalassemia: A Genetic Challenge in Pakistan",
    excerpt: "Thalassemia is a major health concern in Pakistan. Learn about its causes, symptoms, and the importance of premarital screening.",
    content: `
      <p>Thalassemia is an inherited blood disorder characterized by less oxygen-carrying protein (hemoglobin) and fewer red blood cells in the body than normal.</p>
      <h2>The Situation in Pakistan</h2>
      <p>Pakistan has a high prevalence of Thalassemia, with an estimated 5-7% of the population being carriers. Every year, thousands of children are born with Thalassemia Major, requiring lifelong blood transfusions.</p>
      <h2>Symptoms and Treatment</h2>
      <p>Symptoms include fatigue, weakness, pale or yellowish skin, facial bone deformities, slow growth, and abdominal swelling. The primary treatment for Thalassemia Major is regular blood transfusions and chelation therapy to remove excess iron from the body.</p>
      <h2>Prevention is Key</h2>
      <p>The most effective way to control the spread of Thalassemia is through premarital screening. If both partners are carriers, there is a 25% chance with each pregnancy that the child will have Thalassemia Major.</p>
      <p>Blood Chain Pakistan strongly advocates for mandatory premarital screening to build a Thalassemia-free future.</p>
    `,
    category: "Thalassemia Awareness",
    author: "Ali Raza",
    date: "November 5, 2023",
    readTime: "7 min read",
    imageUrl: themePhoto('labTestTubes')
  },
  {
    id: "3",
    title: "My Journey as a Volunteer: Finding Purpose in Saving Lives",
    excerpt: "Read the inspiring story of Sarah, a dedicated volunteer who found her life's calling in organizing blood donation camps.",
    content: `
      <p>When I first joined Blood Chain Pakistan as a university student, I was just looking for something to add to my resume. I had no idea that it would completely change my perspective on life.</p>
      <h2>The First Camp</h2>
      <p>I still remember my first blood donation camp. The energy, the nervousness of first-time donors, and the overwhelming sense of community. Seeing people from all walks of life come together for a common cause was truly inspiring.</p>
      <h2>A Life-Changing Moment</h2>
      <p>A few months into my volunteering, we received an emergency call for a rare blood type for a child undergoing surgery. We managed to find a donor within an hour. Meeting the child's parents later and seeing the relief in their eyes made me realize the true impact of our work.</p>
      <h2>Why I Stay</h2>
      <p>Volunteering is not just about giving time; it's about giving hope. It has taught me empathy, leadership, and the power of collective action. I encourage everyone to volunteer, whether it's by donating blood or helping organize camps.</p>
    `,
    category: "Volunteer Stories",
    author: "Sarah Ahmed",
    date: "December 20, 2023",
    readTime: "4 min read",
    imageUrl: "/src/assets/gallery/ABC_3439.webp"
  },
  {
    id: "4",
    title: "Emergency Blood Requests: How to Act Fast",
    excerpt: "In medical emergencies, every second counts. Learn the best practices for finding blood donors quickly and efficiently.",
    content: `
      <p>Finding a blood donor during an emergency can be a stressful and chaotic experience. However, knowing the right steps can save precious time and lives.</p>
      <h2>Step 1: Verify the Requirement</h2>
      <p>Before broadcasting a request, ensure you have the correct information: the exact blood group, the hospital name, the patient's name, and a reliable contact number.</p>
      <h2>Step 2: Reach Out to Blood Banks</h2>
      <p>Your first point of contact should always be local blood banks and organizations like Blood Chain Pakistan. We maintain a verified database of donors and can often match requests quickly.</p>
      <h2>Step 3: Use Social Media Wisely</h2>
      <p>When posting on social media, be clear and concise. Avoid sharing unverified or old requests, as this can lead to confusion and donor fatigue.</p>
      <h2>Step 4: Keep the Patient's Family Informed</h2>
      <p>Communication is crucial. Keep the family updated on your progress to reduce their anxiety.</p>
    `,
    category: "Emergency Awareness",
    author: "Usman Tariq",
    date: "January 15, 2024",
    readTime: "6 min read",
    imageUrl: themePhoto('medicalTeam')
  },
  {
    id: "5",
    title: "The Islamic Perspective on Blood Donation",
    excerpt: "Explore the ethical and religious significance of donating blood in Islam, emphasizing the sanctity of human life.",
    content: `
      <p>In Islam, the preservation of human life is of paramount importance. The Quran states, "And whoever saves one - it is as if he had saved mankind entirely" (Surah Al-Ma'idah 5:32).</p>
      <h2>A Noble Act of Charity</h2>
      <p>Donating blood is considered a highly commendable act of charity (Sadaqah). It is a selfless act that directly contributes to saving a life, which aligns perfectly with Islamic teachings of compassion and helping those in need.</p>
      <h2>Scholarly Consensus</h2>
      <p>The majority of Islamic scholars agree that blood donation is permissible and encouraged, provided it does not harm the donor and is done voluntarily without any financial compensation.</p>
      <h2>A Moral Responsibility</h2>
      <p>As Muslims, we have a moral responsibility to support our community. By donating blood, we fulfill this duty and earn immense spiritual rewards.</p>
    `,
    category: "Religious Perspective",
    author: "Mufti Bilal",
    date: "February 2, 2024",
    readTime: "5 min read",
    imageUrl: themePhoto('ramadanMosque')
  },
  {
    id: "6",
    title: "Debunking Common Myths About Blood Donation",
    excerpt: "Does donating blood make you weak? Can you get infections? We address the most common misconceptions about blood donation.",
    content: `
      <p>Despite the constant need for blood, many people hesitate to donate due to misconceptions and fears. Let's debunk some of the most common myths.</p>
      <h2>Myth 1: Donating blood makes you weak.</h2>
      <p>Fact: Your body replenishes the lost fluid within 24 hours and the red blood cells within a few weeks. Most donors feel completely normal after donating.</p>
      <h2>Myth 2: You can catch an infection from donating blood.</h2>
      <p>Fact: A sterile, new needle is used for each donation and then discarded. There is no risk of contracting infections like HIV or Hepatitis from donating blood.</p>
      <h2>Myth 3: I can't donate because I have high blood pressure.</h2>
      <p>Fact: As long as your blood pressure is under control at the time of donation, you can usually donate. The medical staff will check your vitals before proceeding.</p>
      <h2>Myth 4: It takes too much time.</h2>
      <p>Fact: The actual donation process only takes about 10-15 minutes. The entire process, including registration and resting, takes about an hour.</p>
    `,
    category: "Blood Education",
    author: "Dr. Ayesha Khan",
    date: "February 18, 2024",
    readTime: "6 min read",
    imageUrl: themePhoto('bloodBagsLab')
  }
];
