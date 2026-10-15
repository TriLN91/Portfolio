/* =====================================================================
   YOUR CONTENT — edit this file to change everything on the website.
   Every text has an English (en) and Vietnamese (vi) version.
   ===================================================================== */
import type { ExperienceItem, Profile, Project, SkillGroup } from './types'

export const profile: Profile = {
  name: 'Lê Ngọc Trí',
  initials: 'LNT',
  role: { en: 'Full-stack Developer', vi: 'Lập trình viên Full-stack' },
  status: { en: 'Open to Fresher / Junior roles · Available now', vi: 'Tìm vị trí Fresher / Junior · Có thể đi làm ngay' },
  lede: {
    en: 'Software Engineering student at FPT University who enjoys building user-focused web applications. My strength is the frontend with React and TypeScript, and I work comfortably with Spring Boot APIs and PostgreSQL on the backend.',
    vi: 'Sinh viên Kỹ thuật Phần mềm tại Đại học FPT, yêu thích xây dựng ứng dụng web lấy người dùng làm trung tâm. Thế mạnh của tôi là frontend với React và TypeScript, đồng thời tôi có thể làm việc với API Spring Boot và PostgreSQL ở backend.',
  },
  location: { en: 'Ho Chi Minh City, Vietnam', vi: 'TP. Hồ Chí Minh, Việt Nam' },
  email: 'nightt9104@gmail.com',
  cv: '/cv.pdf',
  avatar: '/avatar.jpg',
  githubUsername: 'TriLN91',
  socials: [
    { label: 'GitHub', url: 'https://github.com/TriLN91' },
    { label: 'Zalo', url: 'https://zalo.me/0353857111' },
  ],
  facts: [
    { label: { en: 'Role', vi: 'Vị trí' }, value: { en: 'Full-stack Developer (Fresher / Junior)', vi: 'Lập trình viên Full-stack (Fresher / Junior)' } },
    { label: { en: 'Location', vi: 'Nơi ở' }, value: { en: 'Ho Chi Minh City, Vietnam', vi: 'TP. Hồ Chí Minh' } },
    { label: { en: 'Available', vi: 'Bắt đầu' }, value: { en: 'Immediately', vi: 'Có thể đi làm ngay' } },
    { label: { en: 'Education', vi: 'Học vấn' }, value: { en: 'B.Sc. Software Engineering, FPT University', vi: 'Cử nhân Kỹ thuật Phần mềm, Đại học FPT' } },
    { label: { en: 'Experience', vi: 'Kinh nghiệm' }, value: { en: 'Frontend Intern at FPT Software', vi: 'Thực tập sinh Frontend tại FPT Software' } },
    {
      label: { en: 'Languages', vi: 'Ngoại ngữ' },
      value: {
        en: 'English & Japanese: basic conversation, reading technical documents',
        vi: 'Tiếng Anh & tiếng Nhật: giao tiếp cơ bản, đọc hiểu tài liệu',
      },
    },
  ],
  stats: [
    { value: '3', label: { en: 'Featured projects', vi: 'Dự án nổi bật' } },
    { value: '1', label: { en: 'Internship at FPT Software', vi: 'Kỳ thực tập tại FPT Software' } },
    { value: '2', label: { en: 'Foreign languages (EN, JP)', vi: 'Ngoại ngữ (Anh, Nhật)' } },
  ],
  bio: [
    {
      en: 'I turn ideas into software people can actually use.',
      vi: 'Tôi biến ý tưởng thành phần mềm người dùng thật sự dùng được.',
    },
    {
      en: 'Frontend is my strength (React, TypeScript, Figma), and I can build Spring Boot APIs when the project needs it. In a team I listen, adapt quickly and keep the work moving.',
      vi: 'Thế mạnh của tôi là frontend (React, TypeScript, Figma), và tôi có thể viết API Spring Boot khi dự án cần. Trong nhóm, tôi biết lắng nghe, thích nghi nhanh và giữ tiến độ công việc.',
    },
  ],
  contactText: {
    en: "I'm looking for a Fresher or Junior full-stack role where I can learn from an experienced team and contribute from day one. I can start immediately.",
    vi: 'Tôi đang tìm vị trí Fresher hoặc Junior full-stack, nơi tôi có thể học hỏi từ một đội ngũ giàu kinh nghiệm và đóng góp ngay từ ngày đầu. Tôi có thể bắt đầu ngay.',
  },
}

export const projects: Project[] = [
  {
    slug: 'fitflex-ai',
    title: 'FitFlex AI',
    year: '2026',
    kind: { en: 'Capstone project · Team of 4', vi: 'Đồ án · Nhóm 4 người' },
    role: { en: 'UI/UX, business analysis, frontend & backend', vi: 'UI/UX, phân tích nghiệp vụ, frontend & backend' },
    status: 'in-progress',
    url: 'fitflex-ai · demo',
    summary: {
      en: 'An AI fitness coaching and gym service platform. It analyzes a member’s body condition and health goals, builds workout and nutrition plans, checks exercise form from movement, and connects members with gyms and trainers.',
      vi: 'Nền tảng huấn luyện thể hình bằng AI và dịch vụ phòng gym. Hệ thống phân tích thể trạng và mục tiêu sức khỏe, lên lịch tập và chế độ dinh dưỡng, phân tích chuyển động để sửa form cho người tập, đồng thời kết nối với phòng gym và huấn luyện viên.',
    },
    impact: [
      { en: 'Designed and refined the user interface, then built it in React', vi: 'Thiết kế, cải thiện giao diện và hiện thực bằng React' },
      { en: 'Analyzed business requirements for coaching, gym and trainer flows', vi: 'Phân tích nghiệp vụ cho các luồng huấn luyện, phòng gym và huấn luyện viên' },
      { en: 'Built the backend for a core flow: workout progression', vi: 'Code backend cho một core flow: theo dõi tiến độ tập luyện' },
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Spring Boot', 'PostgreSQL'],
    render: 'dash',
    video: '/shots/fitflex.webm',
    code: 'https://github.com/TriLN91/GymManagement_UI',
    caseStudy: {
      problem: {
        en: 'People who train on their own rarely get a plan that fits their body, often practice with the wrong form, and spend a lot of time finding a suitable gym or trainer.',
        vi: 'Người tự tập hiếm khi có kế hoạch phù hợp với thể trạng, dễ tập sai form, và mất nhiều thời gian để tìm phòng gym hoặc huấn luyện viên phù hợp.',
      },
      solution: {
        en: 'One platform where AI builds a personal workout and nutrition plan, reviews exercise form from movement, tracks progress, and helps members find gyms and trainers.',
        vi: 'Một nền tảng nơi AI lập kế hoạch tập luyện và dinh dưỡng cá nhân, phân tích chuyển động để sửa form, theo dõi tiến độ, và giúp người tập tìm phòng gym, huấn luyện viên.',
      },
      architecture: ['React UI', 'REST API (Spring Boot)', 'AI analysis', 'PostgreSQL'],
      decisions: [
        {
          en: 'Mapped each screen to a use case before designing it, so the UI and the business rules stayed consistent.',
          vi: 'Gắn mỗi màn hình với một use case trước khi thiết kế để giao diện và nghiệp vụ luôn khớp nhau.',
        },
        {
          en: 'Owned the workout progression flow end to end, from the API to the screens that show it.',
          vi: 'Phụ trách trọn vẹn luồng tiến độ tập luyện, từ API đến các màn hình hiển thị.',
        },
      ],
    },
  },
  {
    slug: 'grandstride',
    title: 'GrandStride',
    kind: { en: 'Course project · Team of 5', vi: 'Dự án môn học · Nhóm 5 người' },
    role: { en: 'Business analysis, frontend & UI testing', vi: 'Phân tích nghiệp vụ, frontend & kiểm thử UI' },
    status: 'completed',
    url: 'grandstride · HorseRace',
    summary: {
      en: 'A horse racing management platform: racecourses run tournaments and race schedules, owners register their horses, and fans follow the leaderboard and place bets in one place.',
      vi: 'Nền tảng quản lý trường đua ngựa: tổ chức giải đấu và lịch đua, chủ ngựa đăng ký ngựa, người hâm mộ theo dõi bảng xếp hạng và đặt cược ở cùng một nơi.',
    },
    impact: [
      { en: 'Analyzed business flows for races, horse registration and betting', vi: 'Phân tích nghiệp vụ các luồng giải đua, đăng ký ngựa và đặt cược' },
      { en: 'Built the frontend pages with React and Tailwind CSS', vi: 'Xây dựng các trang frontend bằng React và Tailwind CSS' },
      { en: 'Tested the UI across pages and reported issues to the team', vi: 'Kiểm thử giao diện các trang và báo lỗi cho nhóm' },
    ],
    stack: ['React', 'JavaScript', 'Tailwind CSS', 'Spring Boot', 'PostgreSQL', 'Supabase'],
    render: 'dash',
    image: '/shots/grandstride.webp',
    code: 'https://github.com/MyHanh264/HorseRace.FE',
    caseStudy: {
      problem: {
        en: 'Racecourses handle race schedules, horse registrations and bets across separate tools, which is slow and easy to get wrong.',
        vi: 'Trường đua quản lý lịch đua, đăng ký ngựa và đặt cược bằng nhiều công cụ rời rạc, vừa chậm vừa dễ sai sót.',
      },
      solution: {
        en: 'A single web platform with separate roles for organizers, horse owners and fans: tournaments, race schedule, leaderboard, horse registration and betting.',
        vi: 'Một nền tảng web duy nhất với vai trò riêng cho ban tổ chức, chủ ngựa và người hâm mộ: giải đấu, lịch đua, bảng xếp hạng, đăng ký ngựa và đặt cược.',
      },
      architecture: ['React + Tailwind', 'REST API (Spring Boot)', 'PostgreSQL (Supabase)'],
    },
  },
  {
    slug: 'portfolio',
    title: 'Portfolio Website',
    year: '2026',
    kind: { en: 'Personal project · Solo', vi: 'Dự án cá nhân' },
    role: { en: 'Full-stack: design, frontend & backend', vi: 'Full-stack: thiết kế, frontend & backend' },
    status: 'completed',
    url: 'github.com/TriLN91/Portfolio',
    summary: {
      en: 'The site you are on: a 3D growth tree built with Three.js, smooth scroll animations, English and Vietnamese content, and a Spring Boot backend that stores contact messages and serves live GitHub stats.',
      vi: 'Chính website bạn đang xem: cây 3D phát triển dựng bằng Three.js, hiệu ứng cuộn mượt, nội dung song ngữ Anh – Việt, cùng backend Spring Boot lưu tin nhắn liên hệ và cung cấp số liệu GitHub trực tiếp.',
    },
    impact: [
      { en: 'Procedural 3D tree rendered with instanced meshes in React Three Fiber', vi: 'Cây 3D sinh bằng thuật toán, render bằng instanced mesh trong React Three Fiber' },
      { en: 'Smooth scroll, pinned horizontal gallery and page transitions (GSAP, Framer Motion)', vi: 'Smooth scroll, gallery ghim trượt ngang và chuyển trang (GSAP, Framer Motion)' },
      { en: 'Spring Boot API with PostgreSQL, email alerts, spam protection and CI', vi: 'API Spring Boot với PostgreSQL, gửi email, chống spam và CI' },
    ],
    stack: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Tailwind CSS', 'Spring Boot', 'PostgreSQL', 'Docker'],
    render: 'dash',
    image: '/shots/portfolio.jpg',
    code: 'https://github.com/TriLN91/Portfolio',
    caseStudy: {
      problem: {
        en: 'Most student portfolios are templates that list skills without showing them. I wanted a site that itself proves I can build a full-stack product.',
        vi: 'Phần lớn portfolio sinh viên là template chỉ liệt kê kỹ năng mà không chứng minh được. Tôi muốn một website tự nó chứng minh tôi làm được sản phẩm full-stack.',
      },
      solution: {
        en: 'A React frontend with a 3D scene that grows as you scroll, case studies for each project, and a real backend: the contact form is stored in PostgreSQL and emailed to me, and GitHub stats are fetched and cached by the API.',
        vi: 'Frontend React với cảnh 3D lớn dần theo thao tác cuộn, case study cho từng dự án, và backend thật: form liên hệ được lưu vào PostgreSQL và gửi email cho tôi, số liệu GitHub được API lấy về và lưu cache.',
      },
      architecture: ['React + Three.js', 'REST API (Spring Boot)', 'PostgreSQL', 'SMTP · GitHub API'],
      decisions: [
        {
          en: 'Rendered branches, leaves and blossoms as three instanced meshes, so the whole tree costs three draw calls and stays smooth on laptops.',
          vi: 'Render cành, lá và hoa bằng 3 instanced mesh, nên cả cây chỉ tốn 3 draw call và vẫn mượt trên laptop.',
        },
        {
          en: 'Kept all content in one bilingual file, so updating the site never means touching components.',
          vi: 'Gom toàn bộ nội dung vào một file song ngữ để cập nhật website mà không phải sửa component.',
        },
        {
          en: 'Protected the contact form with a honeypot field and a per-IP hourly limit, and sent emails only after the database commit.',
          vi: 'Bảo vệ form liên hệ bằng ô bẫy bot và giới hạn số tin theo IP mỗi giờ; email chỉ được gửi sau khi lưu vào cơ sở dữ liệu thành công.',
        },
      ],
      results: [
        { value: 'EN / VI', label: { en: 'bilingual content', vi: 'nội dung song ngữ' } },
        { value: '3', label: { en: 'draw calls for the 3D tree', vi: 'draw call cho cây 3D' } },
        { value: 'CI', label: { en: 'build & test on every push', vi: 'build & test mỗi lần push' } },
      ],
      learnings: {
        en: 'Animation should guide the reader, not slow them down. Every effect here had to keep the content readable first.',
        vi: 'Hiệu ứng nên dẫn dắt người xem chứ không làm họ chậm lại. Mọi hiệu ứng ở đây đều phải giữ nội dung dễ đọc trước tiên.',
      },
    },
  },
]

export const skills: SkillGroup[] = [
  {
    name: { en: 'Frontend', vi: 'Frontend' },
    note: { en: 'My strongest area', vi: 'Thế mạnh chính' },
    core: ['React', 'TypeScript', 'JavaScript', 'HTML / CSS', 'Tailwind CSS'],
    more: ['Three.js', 'Framer Motion', 'GSAP'],
  },
  {
    name: { en: 'Backend', vi: 'Backend' },
    note: { en: 'APIs and business logic', vi: 'API và nghiệp vụ' },
    core: ['Java', 'Spring Boot', 'REST APIs'],
    more: ['Microservices'],
  },
  {
    name: { en: 'Database', vi: 'Cơ sở dữ liệu' },
    note: { en: 'Storing and querying data', vi: 'Lưu trữ và truy vấn dữ liệu' },
    core: ['PostgreSQL', 'Supabase'],
    more: [],
  },
  {
    name: { en: 'Tools & workflow', vi: 'Công cụ & quy trình' },
    note: { en: 'Design, collaboration, delivery', vi: 'Thiết kế, làm việc nhóm, triển khai' },
    core: ['Git / GitHub', 'Figma', 'Swagger', 'Docker Compose'],
    more: ['Use case analysis', 'UI testing'],
  },
]

export const experience: ExperienceItem[] = [
  {
    period: '09/2025 — 12/2025',
    title: { en: 'Frontend Intern', vi: 'Thực tập sinh Frontend' },
    org: 'FPT Software',
    type: 'work',
    text: {
      en: 'Worked on the frontend of a hospital management system. Learned how a microservices architecture is organized and how the frontend works with multiple backend services.',
      vi: 'Tham gia phát triển frontend cho hệ thống quản lý bệnh viện. Học được cách tổ chức kiến trúc microservices và cách frontend làm việc với nhiều dịch vụ backend.',
    },
  },
  {
    title: { en: 'B.Sc. Software Engineering', vi: 'Cử nhân Kỹ thuật Phần mềm' },
    org: 'FPT University',
    type: 'education',
    text: {
      en: 'Studying software engineering with a focus on web development. Built team projects every semester, including GrandStride and the FitFlex AI capstone.',
      vi: 'Theo học Kỹ thuật Phần mềm, tập trung vào phát triển web. Làm dự án nhóm mỗi học kỳ, trong đó có GrandStride và đồ án FitFlex AI.',
    },
  },
]
