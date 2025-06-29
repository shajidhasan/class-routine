import type { DayName, TimeSlot, CourseInfo } from '$lib/types';

export const routine: Record<DayName, TimeSlot[]> = {
    sunday: [
        { time: '09:00 - 09:50', sectionA: 'ME461', sectionB: 'ME431', sectionC: 'ME451' },
        { time: '09:50 - 10:40', sectionA: 'ME451', sectionB: 'ME461', sectionC: 'ME431' },
        { time: '11:00 - 11:50', sectionA: 'ME431', sectionB: 'ME451', sectionC: 'ME461' },
        { time: '14:30 - 17:00', sectionA: 'ME494', sectionB: 'ME494', sectionC: 'ME494' }
    ],
    monday: [
        { time: '09:00 - 09:50', sectionA: 'ME461', sectionB: 'ME413', sectionC: 'ME431' },
        { time: '09:50 - 10:40', sectionA: 'ME431', sectionB: 'ME451', sectionC: 'ME413' },
        { time: '11:00 - 11:50', sectionA: 'ME451', sectionB: 'ME431', sectionC: 'ME461' },
        { time: '11:50 - 12:40', sectionA: 'ME413', sectionB: 'ME461', sectionC: 'ME451' },
        { time: '14:30 - 17:00', sectionA: 'ME452 (A1/A2)', sectionC: 'ME432 (C1/C2)' }
    ],
    tuesday: [
        { time: '09:00 - 09:50', sectionA: 'ME413', sectionB: 'ME461', sectionC: 'ME417' },
        { time: '09:50 - 10:40', sectionA: 'ME417', sectionB: 'ME413', sectionC: 'ME461' },
        { time: '11:00 - 11:50', sectionA: 'ME461', sectionB: 'ME417', sectionC: 'ME413' },
        { time: '14:30 - 17:00', sectionB: 'ME432 (B1/B2)', sectionC: 'ME452 (C1/C2)' }
    ],
    wednesday: [
        { time: '09:00 - 09:50', sectionA: 'ME417', sectionB: 'ME431', sectionC: 'ME461' },
        { time: '09:50 - 10:40', sectionA: 'ME461', sectionB: 'ME417', sectionC: 'ME451' },
        { time: '11:00 - 11:50', sectionA: 'ME451', sectionB: 'ME461', sectionC: 'ME431' },
        { time: '11:50 - 12:40', sectionA: 'ME431', sectionB: 'ME451', sectionC: 'ME417' },
        { time: '14:30 - 17:00', sectionA: 'ME432 (A1/A2)', sectionB: 'ME452 (B1/B2)' }
    ],
    thursday: [
        { time: '09:00 - 09:50', sectionA: 'ME417', sectionB: 'ME451', sectionC: 'ME413' },
        { time: '09:50 - 10:40', sectionA: 'ME451', sectionB: 'ME413', sectionC: 'ME417' },
        { time: '11:00 - 11:50', sectionA: 'ME413', sectionB: 'ME417', sectionC: 'ME451' }
    ],
    friday: [],
    saturday: []
};

export const courseDetails: Record<string, CourseInfo> = {
    ME413: {
        name: 'Power Plant Engineering',
        teachers: ['Dr. Bodius Salam', 'Dr. Kazi Afzalur Rahman'],
        sessional: false
    },
    ME461: {
        name: 'Production and Operations Management',
        teachers: ['Dr. Md. Sanaul Rabbi', 'Dr. Md. Abu Mowazzem Hossain'],
        sessional: false
    },
    ME451: {
        name: 'Machine Tools and Tool Engineering',
        teachers: ['Dr. Md. Arafat Rahman', 'Mr. Redoy Masum Meraz'],
        sessional: false
    },
    ME431: {
        name: 'Machine Design-II',
        teachers: ['Mr. Syed Masrur Ahmmad', 'Mr. Minhaz Ahmed'],
        sessional: false
    },
    ME417: {
        name: 'Refrigeration and Air-conditioning',
        teachers: ['Dr. Jamal Uddin Ahamed', 'Mr. Md. Aminul Islam'],
        sessional: false
    },
    ME452: {
        name: 'Machine Tools and Tool Engineering',
        teachers: ['Dr. Md. Sanaul Rabbi', 'Dr. Md. Arafat Rahman', 'Mr. Redoy Masum Meraz'],
        sessional: true
    },
    ME432: {
        name: 'Machine Design-II',
        teachers: ['Mr. Syed Masrur Ahmmad', 'Mr. Redoy Masum Meraz', 'Mr. Minhaz Ahmed'],
        sessional: true
    },
    ME494: {
        name: 'Project and Thesis',
        teachers: ['Corresponding Supervisors'],
        sessional: true
    }
};

export const dayNames: DayName[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
];

export const dayLabels: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];
