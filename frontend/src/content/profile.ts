/* =====================================================================
   YOUR CONTENT — edit this file to change everything on the website.
   Every text has an English (en) and Vietnamese (vi) version.
   The values below are SAMPLE data. Replace them with your own.
   ===================================================================== */
import type { ExperienceItem, Profile, Project, SkillGroup } from './types'

export const profile: Profile = {
  name: 'Nguyen Van A',
  role: { en: 'Full-stack Developer', vi: 'Lập trình viên Full-stack' },
  status: { en: 'Open to internship & junior roles', vi: 'Đang tìm vị trí thực tập / junior' },
  lede: {
    en: 'Software Engineering student who builds complete web products, from database design and REST APIs to a polished React interface. I care about clean code a team can keep working on.',
    vi: 'Sinh viên Kỹ thuật Phần mềm, xây dựng sản phẩm web trọn vẹn: từ thiết kế cơ sở dữ liệu, REST API đến giao diện React chỉn chu. Tôi coi trọng code sạch để cả team có thể tiếp tục phát triển.',
  },
  location: { en: 'Ho Chi Minh City, Vietnam', vi: 'TP. Hồ Chí Minh, Việt Nam' },
  email: 'your.email@gmail.com',
  cv: '/cv.pdf',
  avatar: '',
  githubUsername: 'your-username',
  socials: [
    { label: 'GitHub', url: 'https://github.com/your-username' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/your-username' },
    { label: 'Zalo', url: 'https://zalo.me/0900000000' },
  ],
  facts: [
    { label: { en: 'Role', vi: 'Vị trí' }, value: { en: 'Full-stack (Java · React)', vi: 'Full-stack (Java · React)' } },
    { label: { en: 'Location', vi: 'Nơi ở' }, value: { en: 'Ho Chi Minh City · Remote OK', vi: 'TP.HCM · Có thể làm remote' } },
    { label: { en: 'Available', vi: 'Có thể bắt đầu' }, value: { en: 'Full-time from 01/2027', vi: 'Toàn thời gian từ 01/2027' } },
    { label: { en: 'Education', vi: 'Học vấn' }, value: { en: 'B.Sc. Software Engineering, FPT University', vi: 'Cử nhân KTPM, Đại học FPT' } },
    { label: { en: 'Languages', vi: 'Ngoại ngữ' }, value: { en: 'Vietnamese, English (IELTS 6.5)', vi: 'Tiếng Việt, Tiếng Anh (IELTS 6.5)' } },
  ],
  stats: [
    { value: '3', label: { en: 'Products shipped', vi: 'Sản phẩm hoàn thiện' } },
    { value: '12k', label: { en: 'Lines of code on GitHub', vi: 'Dòng code trên GitHub' } },
    { value: '3.4', label: { en: 'GPA / 4.0', vi: 'GPA / 4.0' } },
  ],
  bio: [
    {
      en: 'I like turning a vague requirement into a working product people can click through.',
      vi: 'Tôi thích biến một yêu cầu còn mơ hồ thành sản phẩm chạy được mà người dùng có thể bấm thử ngay.',
    },
    {
      en: 'In team projects I usually own the backend: designing the database, writing REST APIs with Spring Boot, documenting them, and connecting them to the React frontend. I write clear pull requests and keep the README current so new teammates can run the project in minutes.',
      vi: 'Trong các dự án nhóm, tôi thường phụ trách backend: thiết kế cơ sở dữ liệu, viết REST API bằng Spring Boot, viết tài liệu API và kết nối với frontend React. Tôi viết pull request rõ ràng và luôn cập nhật README để thành viên mới chạy được dự án trong vài phút.',
    },
    {
      en: "Right now I'm improving my testing habits (JUnit, React Testing Library) and learning to deploy with Docker and CI.",
      vi: 'Hiện tại tôi đang rèn thói quen viết test (JUnit, React Testing Library) và học deploy với Docker, CI.',
    },
  ],
  contactText: {
    en: "I'm looking for an internship or junior role where I can ship real features with a team. I usually reply within a day.",
    vi: 'Tôi đang tìm vị trí thực tập hoặc junior để cùng team làm ra tính năng thật. Tôi thường phản hồi trong vòng một ngày.',
  },
}

export const projects: Project[] = [
  {
    slug: 'shopdesk-admin',
    title: 'ShopDesk Admin',
    year: '2026',
    kind: { en: 'Web app · Team of 4', vi: 'Ứng dụng web · Nhóm 4 người' },
    role: { en: 'Backend lead & API design', vi: 'Trưởng nhóm backend & thiết kế API' },
    status: 'live',
    url: 'shopdesk-admin.vercel.app',
    summary: {
      en: 'An admin dashboard for small online shops to manage orders, stock and revenue in one place instead of spreadsheets.',
      vi: 'Trang quản trị giúp shop online nhỏ quản lý đơn hàng, tồn kho và doanh thu ở một nơi thay vì bảng tính.',
    },
    impact: [
      { en: 'Designed a 9-table PostgreSQL schema and 25 REST endpoints', vi: 'Thiết kế CSDL PostgreSQL 9 bảng và 25 REST endpoint' },
      { en: 'Revenue report loads in under 300 ms on 50k orders', vi: 'Báo cáo doanh thu tải dưới 300 ms với 50.000 đơn' },
      { en: 'Role-based login for owner and staff accounts', vi: 'Phân quyền đăng nhập cho chủ shop và nhân viên' },
    ],
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Docker'],
    render: 'dash',
    demo: 'https://example.com',
    code: 'https://github.com/your-username/shopdesk',
    caseStudy: {
      problem: {
        en: 'The client tracked 300+ orders a month in Google Sheets. Stock numbers were often wrong and nobody could see weekly revenue.',
        vi: 'Khách hàng theo dõi hơn 300 đơn mỗi tháng bằng Google Sheets. Số tồn kho thường sai và không ai xem được doanh thu theo tuần.',
      },
      solution: {
        en: 'A dashboard with live stock, order status tracking and a revenue chart. Staff update orders; the owner sees reports.',
        vi: 'Dashboard hiển thị tồn kho theo thời gian thực, trạng thái đơn hàng và biểu đồ doanh thu. Nhân viên cập nhật đơn, chủ shop xem báo cáo.',
      },
      architecture: ['React UI', 'REST API', 'Service layer', 'JPA', 'PostgreSQL'],
      decisions: [
        {
          en: 'Used DTOs and a service layer so the frontend never depends on database tables directly.',
          vi: 'Dùng DTO và tầng service để frontend không phụ thuộc trực tiếp vào bảng dữ liệu.',
        },
        {
          en: 'Profiled the slow revenue query and added composite indexes on order date and status (4.2 s → 0.3 s).',
          vi: 'Đo truy vấn doanh thu chậm và thêm index kết hợp trên ngày đặt và trạng thái đơn (4,2 s → 0,3 s).',
        },
        {
          en: 'Ran the whole stack with Docker Compose so every teammate had the same environment.',
          vi: 'Chạy toàn bộ hệ thống bằng Docker Compose để mọi thành viên có cùng môi trường.',
        },
      ],
      results: [
        { value: '25', label: { en: 'API endpoints', vi: 'API endpoint' } },
        { value: '<300ms', label: { en: 'report load time', vi: 'thời gian tải báo cáo' } },
        { value: '14x', label: { en: 'faster revenue query', vi: 'truy vấn nhanh hơn' } },
      ],
      learnings: {
        en: 'Measure before optimizing. The slow part was one query, not the framework.',
        vi: 'Hãy đo trước khi tối ưu. Phần chậm là một câu truy vấn, không phải framework.',
      },
    },
  },
  {
    slug: 'momcare-tracker',
    title: 'MomCare Tracker',
    year: '2025',
    kind: { en: 'Web + mobile web · Team of 5', vi: 'Web + mobile web · Nhóm 5 người' },
    role: { en: 'Backend / API contributor', vi: 'Phát triển backend / API' },
    status: 'completed',
    url: 'momcare.app/week/24',
    summary: {
      en: 'Helps expecting mothers follow their pregnancy week by week, log check-ups and get reminders for appointments.',
      vi: 'Giúp mẹ bầu theo dõi thai kỳ theo từng tuần, ghi lại các lần khám và nhận nhắc lịch hẹn.',
    },
    impact: [
      { en: 'Built auth, reminder scheduler and growth-chart APIs', vi: 'Xây dựng API xác thực, lịch nhắc và biểu đồ tăng trưởng' },
      { en: 'Documented every endpoint in Swagger for the frontend team', vi: 'Viết tài liệu Swagger cho mọi endpoint để team frontend dùng' },
      { en: 'Push reminders with Firebase Cloud Messaging', vi: 'Gửi thông báo nhắc lịch qua Firebase Cloud Messaging' },
    ],
    stack: ['Java', 'Spring Boot', 'SQL Server', 'React', 'Firebase'],
    render: 'track',
    code: 'https://github.com/your-username/momcare',
    caseStudy: {
      problem: {
        en: 'Mothers kept check-up notes on paper and missed appointments. Growth data from doctors was hard to compare week to week.',
        vi: 'Mẹ bầu ghi chép khám thai trên giấy và hay lỡ lịch hẹn. Số liệu tăng trưởng của bé khó so sánh giữa các tuần.',
      },
      solution: {
        en: 'A week-by-week timeline with growth charts against reference ranges, plus scheduled reminders.',
        vi: 'Dòng thời gian theo tuần với biểu đồ tăng trưởng so với chuẩn tham chiếu, kèm lịch nhắc tự động.',
      },
      architecture: ['React', 'Spring Boot API', 'Scheduler', 'SQL Server', 'Firebase FCM'],
      decisions: [
        {
          en: 'Moved reminders to a server-side scheduled job so they fire even when the app is closed.',
          vi: 'Chuyển nhắc lịch sang job chạy trên server để vẫn gửi được khi ứng dụng đã đóng.',
        },
        {
          en: 'Wrote the API contract in Swagger first, so frontend and backend could work in parallel.',
          vi: 'Viết đặc tả API bằng Swagger trước để frontend và backend làm song song.',
        },
      ],
      results: [
        { value: '40', label: { en: 'weeks of content', vi: 'tuần nội dung' } },
        { value: '18', label: { en: 'endpoints I owned', vi: 'endpoint tôi phụ trách' } },
        { value: '100%', label: { en: 'endpoints documented', vi: 'endpoint có tài liệu' } },
      ],
      learnings: {
        en: 'Agreeing on the API contract early saved the team more time than any library.',
        vi: 'Thống nhất đặc tả API sớm giúp team tiết kiệm thời gian hơn bất kỳ thư viện nào.',
      },
    },
  },
  {
    slug: 'family-balance',
    title: 'Family Balance',
    year: '2025',
    kind: { en: 'Real-time game · Solo', vi: 'Game thời gian thực · Cá nhân' },
    role: { en: 'Full-stack & game UI', vi: 'Full-stack & giao diện game' },
    status: 'live',
    url: 'family-balance.vercel.app/room/7Q2K',
    summary: {
      en: 'A multiplayer party game where teams answer family-life questions and try to keep the Wife and Husband scores balanced.',
      vi: 'Game nhiều người chơi: các đội trả lời câu hỏi về đời sống gia đình và giữ cân bằng điểm Vợ – Chồng.',
    },
    impact: [
      { en: 'Real-time rooms for up to 30 players with Socket.IO', vi: 'Phòng chơi thời gian thực tối đa 30 người với Socket.IO' },
      { en: 'Host screen + phone controller, no install needed', vi: 'Màn hình chính + điều khiển bằng điện thoại, không cần cài đặt' },
      { en: 'Played live at a 120-person company event', vi: 'Đã chạy thực tế tại sự kiện công ty 120 người' },
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'Socket.IO'],
    render: 'game',
    demo: 'https://example.com',
    code: 'https://github.com/your-username/family-balance',
    caseStudy: {
      problem: {
        en: 'The event team wanted a game everyone could join from their phones in seconds, shown on one big screen.',
        vi: 'Ban tổ chức cần một trò chơi mà mọi người tham gia bằng điện thoại trong vài giây và hiển thị trên màn hình lớn.',
      },
      solution: {
        en: 'A host screen that runs the rounds and a mobile controller joined by room code. State lives on the server, so a refresh never loses progress.',
        vi: 'Màn hình chủ điều khiển các vòng chơi, người chơi vào bằng mã phòng trên điện thoại. Trạng thái lưu trên server nên tải lại trang không mất tiến trình.',
      },
      architecture: ['Phone controller', 'Socket.IO', 'Node game server', 'Host screen'],
      decisions: [
        {
          en: 'Kept the server as the single source of truth and sent small events instead of the whole state.',
          vi: 'Server là nguồn dữ liệu duy nhất, chỉ gửi các sự kiện nhỏ thay vì toàn bộ trạng thái.',
        },
        {
          en: 'Load-tested with 40 simulated clients on venue-like Wi-Fi before the event.',
          vi: 'Kiểm thử tải với 40 client giả lập trên mạng Wi-Fi tương tự hội trường trước sự kiện.',
        },
      ],
      results: [
        { value: '120', label: { en: 'players at launch', vi: 'người chơi lần đầu' } },
        { value: '~80ms', label: { en: 'event latency', vi: 'độ trễ sự kiện' } },
        { value: '0', label: { en: 'crashes during event', vi: 'lỗi trong sự kiện' } },
      ],
      learnings: {
        en: 'Real users on real Wi-Fi behave differently from localhost. Test where the product will run.',
        vi: 'Người dùng thật trên Wi-Fi thật khác hẳn localhost. Hãy test ở nơi sản phẩm sẽ chạy.',
      },
    },
  },
]

export const skills: SkillGroup[] = [
  {
    name: { en: 'Backend', vi: 'Backend' },
    note: { en: 'APIs, data and business logic', vi: 'API, dữ liệu và nghiệp vụ' },
    core: ['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL'],
    more: ['Node.js', 'Express', 'SQL Server', 'JWT auth'],
  },
  {
    name: { en: 'Frontend', vi: 'Frontend' },
    note: { en: 'Interfaces people enjoy using', vi: 'Giao diện người dùng thích dùng' },
    core: ['React', 'TypeScript', 'HTML / CSS'],
    more: ['Tailwind', 'Material UI', 'Vite', 'Three.js'],
  },
  {
    name: { en: 'Tools & workflow', vi: 'Công cụ & quy trình' },
    note: { en: 'How I ship and collaborate', vi: 'Cách tôi làm việc nhóm và phát hành' },
    core: ['Git / GitHub', 'Docker Compose', 'Swagger'],
    more: ['Postman', 'Jira', 'GitHub Actions', 'Figma'],
  },
]

export const experience: ExperienceItem[] = [
  {
    period: '2026 — now',
    title: { en: 'Backend Developer Intern', vi: 'Thực tập sinh Backend' },
    org: 'Company Name',
    type: 'work',
    text: {
      en: 'Built 14 REST endpoints for an internal order system; cut a slow report query from 4.2 s to 0.3 s with indexes.',
      vi: 'Xây dựng 14 REST endpoint cho hệ thống đơn hàng nội bộ; giảm truy vấn báo cáo từ 4,2 s xuống 0,3 s bằng index.',
    },
  },
  {
    period: '2025',
    title: { en: 'Team Lead, capstone project', vi: 'Trưởng nhóm đồ án' },
    org: 'FPT University',
    type: 'leadership',
    text: {
      en: 'Led a team of 5 using Scrum, 2-week sprints and GitHub Projects. Delivered on schedule with a live demo.',
      vi: 'Dẫn dắt nhóm 5 người theo Scrum, sprint 2 tuần, quản lý bằng GitHub Projects. Hoàn thành đúng hạn với demo trực tiếp.',
    },
  },
  {
    period: '2023 — 2027',
    title: { en: 'B.Sc. Software Engineering', vi: 'Cử nhân Kỹ thuật Phần mềm' },
    org: 'FPT University',
    type: 'education',
    text: {
      en: 'Focus on web development and databases. GPA 3.4 / 4.0.',
      vi: 'Chuyên sâu phát triển web và cơ sở dữ liệu. GPA 3.4 / 4.0.',
    },
  },
]
