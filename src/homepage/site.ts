export const LINKEDIN_POST_URL =
    'https://www.linkedin.com/posts/running-chores_runningchores-activity-7509355014411304960-4yIn?utm_source=share&utm_medium=member_android&rcm=ACoAACqXzh4Bge7yyvqT0XqC42e-CRwvdh4cTw8'

export const LINKEDIN_COMPANY_URL = 'https://www.linkedin.com/company/running-chores/'

export const CONTACT_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScswKCHqEvzwhAKxV4X5GadwjOFwIb7Un1NgxyN06Ds9HDngw/viewform?usp=publish-editor'

export const MENTOR_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSd-pbQIoSXC0H_JS57YYLEIe5ECOxiqgbKpkwXKG1t4f6G4Aw/viewform?usp=publish-editor'

export const SITE_URL = 'https://www.runningchores.com'

export const SOCIAL_LINKS = [
    { label: 'WhatsApp', href: 'https://wa.me/919039422642', type: 'whatsapp' },
    { label: 'Gmail', href: 'mailto:runningchores@gmail.com', type: 'email' },
] as const 

export type Pillar = {
    id: string
    emoji: string
    title: string
    description: string
    points: readonly string[]
    cta?: { label: string; href: string }
}

export const PILLARS: readonly Pillar[] = [
    {
        id: 'enterprise',
        emoji: '🏢',
        title: 'Enterprise Solutions',
        description:
            'Helping organizations solve complex challenges through scalable, technology-driven solutions and services.',
        points: ['Scalable systems', 'Technology delivery', 'Process engineering'],
    },
    {
        id: 'consultation',
        emoji: '🤝',
        title: 'Consultation',
        description:
            'Providing practical expertise and guidance to help individuals and organizations make better-informed decisions across different business and professional needs.',
        points: ['Business advisory', 'Strategy sessions', 'Decision support'],
    },
    {
        id: 'mentoring',
        emoji: '🎓',
        title: 'Become a Mentor',
        description:
            'A freelance opportunity for professionals. Sign up with the skills you already have, and we will connect you with someone who is actively looking for a mentor.',
        points: [
            'Share your own skills',
            'Work as a freelance mentor',
            'Paid, flexible engagements',
        ],
    },
]

export const UPCOMING = [
    {
        title: 'Career opportunities',
        description: 'Roles and openings for people who want to do meaningful, practical work.',
    },
    {
        title: 'Job openings',
        description: 'Regularly updated openings across the projects we run and the teams we build.',
    },
    {
        title: 'Projects',
        description:
            'Work in progress across mentor–mentee engagements, consultation, and enterprise deliveries.',
    },
    {
        title: 'Work with us',
        description:
            'Become a freelance mentor, or join as a collaborator who wants to grow alongside the platform.',
    },
] as const

export const MENTOR_STEPS = [
    {
        step: '01',
        title: 'Sign yourself up',
        description:
            'Tell us what you do and which skills you can share — the industry you know, the tools you use, the mistakes you have already made.',
    },
    {
        step: '02',
        title: 'We find the match',
        description:
            'Someone who is looking for a mentor in your area reaches out to you directly. You decide whether the engagement works for you.',
    },
    {
        step: '03',
        title: 'You work as a Mentor',
        description:
            'Guide them on a freelance basis, on your own terms and schedule. You are the expert — this is your time being paid for.',
    },
] as const

export const HASHTAGS = [
    '#HelloWorld',
    '#RunningChores',
    '#Mentors',
    '#Freelance',
    '#Consultation',
    '#EnterpriseSolutions',
    '#Hiring',
    '#JobOpenings',
    '#Careers',
    '#Business',
    '#Technology',
] as const
