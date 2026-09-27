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

export const PILLARS = [
    {
        id: 'mentoring',
        emoji: '🎓',
        title: 'Mentoring',
        description:
            'Helping individuals learn, grow, and navigate their professional journey with the right guidance.',
        points: ['Career direction', 'Skill building', 'Professional growth'],
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
        id: 'enterprise',
        emoji: '🏢',
        title: 'Enterprise Solutions',
        description:
            'Helping organizations solve complex challenges through scalable, technology-driven solutions and services.',
        points: ['Scalable systems', 'Technology delivery', 'Process engineering'],
    },
] as const

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
        description: 'Work in progress across mentoring, consultation, and enterprise engagements.',
    },
    {
        title: 'Work with us',
        description: 'Openings for collaborators who want to grow alongside the platform.',
    },
] as const

export const HASHTAGS = [
    '#HelloWorld',
    '#RunningChores',
    '#Mentoring',
    '#Consultation',
    '#EnterpriseSolutions',
    '#Hiring',
    '#JobOpenings',
    '#Careers',
    '#Business',
    '#Technology',
] as const
