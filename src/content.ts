export type Project = {
  title: string;
  category: string;
  description: string;
  technologies: string;
  url?: string;
};

export type SkillGroup = { label: string; value: string };

export const portfolio = {
  name: 'Mya Thinzar Aung',
  title: 'Computer Science & Engineering Student',
  institution: 'Myanmar Institute of Information and Technology',
  portrait: '/mya-thinzar-aung.png',
  cv: '/mya-thinzar-aung-cv.pdf',
  email: 'myathinzaraung872003@gmail.com',
  phone: '+959266361019',
  phoneLabel: '09 266 361 019',
  github: 'https://github.com/tyler872003',
  intro: 'Final-year CSE student specializing in full-stack mobile development with Flutter and Kotlin, with experience in web development, machine learning, and data analysis.',
  about: 'A collaborative, well-mannered team player looking to grow as a professional software developer. Studying Computer Science and Engineering at MIIT and Business & Administration online at University of the People.',
  education: [
    { degree: 'Computer Science and Engineering', institution: 'Myanmar Institute of Information and Technology (MIIT)', details: 'Expected graduation 2026 · CGPA 3.68 / 4.0' },
    { degree: 'Business & Administration', institution: 'University of the People', details: 'In progress · CGPA 3.77 / 4.0' },
  ],
  projects: [
    { title: 'Fitness Tracker', category: 'Web application', description: 'Built a fitness tracking application for logging workouts, tracking sets and reps, and visualizing progress through charts and history views.', technologies: 'Python · Django · MySQL', url: 'https://github.com/tyler872003/Fitness_Tracker' },
    { title: 'Social Media App', category: 'Mobile application', description: 'Developed a social media application supporting sign-up, posts, likes, comments, and a real-time news feed.', technologies: 'Flutter · Firebase Authentication · Firestore', url: 'https://github.com/tyler872003/Social_Media_App' },
    { title: 'Customer Churn Detection', category: 'Web application', description: 'Built an interactive dashboard that analyzes customer data and applies machine learning techniques to predict churn.', technologies: 'Python · Machine Learning · Data Analysis', url: 'https://github.com/MyatThiria1704/RiHub.git' },
    { title: 'Burmese Word Segmentation', category: 'Web application', description: 'Created a tool that segments Burmese text into words using NLP techniques and provides a web interface for testing text.', technologies: 'Python · NLP', url: 'https://github.com/tyler872003/Burmese-Word-Segmentation' },
    { title: 'Personal Finance Planner with AI Advisor', category: 'Mobile application', description: 'Created a personal finance planner for income, expenses, and savings goals, with an advisor that analyzes spending patterns to offer budgeting guidance.', technologies: 'Kotlin · Firebase Authentication · Firestore', url: 'https://github.com/tyler872003/MoneyMate' },
  ] satisfies Project[],
  skills: [
    { label: 'Programming', value: 'Flutter, Kotlin, Java, Python (Django), PHP, C++' },
    { label: 'Tools & other', value: 'Git, GitHub, Machine Learning, Data Analysis, Management' },
    { label: 'Languages', value: 'English, Burmese, Korean' },
    { label: 'Strengths', value: 'Team collaboration, professional communication' },
  ] satisfies SkillGroup[],
  courses: ['Management and Marketing — Myanmar Institute of College (MIC)', 'English 4 Skills — IH (International House)'],
  colors: {
    background: '#050608',
    surface: '#0c0e13',
    card: '#101722',
    accent: '#ffffff',
    text: '#ffffff',
    muted: '#b7bbc4',
    border: '#292d36',
  },
} as const;
