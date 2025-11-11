import type { DayName, TimeSlot, CourseInfo } from '$lib/types';

export const routine: Record<DayName, TimeSlot[]> = {
    sunday: [
        { time: '09:00 - 09:50', sectionA: 'ME411', sectionB: 'ME463' },
        { time: '09:50 - 10:40', sectionB: 'ME411', sectionC: 'ME463' },
        { time: '11:00 - 11:50', sectionA: 'ME463', sectionC: 'ME411' },
        { time: '11:50 - 12:40', sectionA: 'ELECTIVE', sectionB: 'ELECTIVE', sectionC: 'ELECTIVE' },
        { time: '14:30 - 17:00', sectionA: 'ME412', sectionC: 'ME422' }
    ],
    monday: [
        { time: '09:00 - 09:50', sectionA: 'ME455', sectionB: 'ME411', sectionC: 'ME463' },
        { time: '09:50 - 10:40', sectionA: 'ME463', sectionB: 'ME455', sectionC: 'ME411' },
        { time: '11:00 - 11:50', sectionA: 'ME411', sectionB: 'ME463', sectionC: 'ME455' },
        { time: '11:50 - 12:40', sectionA: 'ELECTIVE', sectionB: 'ELECTIVE', sectionC: 'ELECTIVE' },
        { time: '14:30 - 17:00', sectionA: 'ME412', sectionB: 'ME456' }
    ],
    tuesday: [
        { time: '09:00 - 09:50', sectionA: 'ME463', sectionB: 'ME421', sectionC: 'ME411' },
        { time: '09:50 - 10:40', sectionA: 'ME411', sectionB: 'ME463', sectionC: 'ME421' },
        { time: '11:00 - 11:50', sectionA: 'ME421', sectionB: 'ME411', sectionC: 'ME463' },
        { time: '11:50 - 12:40', sectionA: 'ELECTIVE', sectionB: 'ELECTIVE', sectionC: 'ELECTIVE' },
        { time: '14:30 - 17:00', sectionB: 'ME422', sectionC: 'ME412' }
    ],
    wednesday: [
        { time: '09:00 - 09:50', sectionA: 'ME421', sectionB: 'ME455' },
        { time: '09:50 - 10:40', sectionA: 'ME455', sectionC: 'ME421' },
        { time: '11:00 - 11:50', sectionB: 'ME421', sectionC: 'ME455' },
        { time: '11:00 - 13:30', sectionA: 'ME456' },
        { time: '14:30 - 17:00', sectionA: 'ME498', sectionB: 'ME498', sectionC: 'ME498' },
    ],
    thursday: [
        { time: '09:00 - 09:50', sectionA: 'ME421', sectionB: 'ME463', sectionC: 'ME455' },
        { time: '09:50 - 10:40', sectionA: 'ME455', sectionB: 'ME421', sectionC: 'ME463' },
        { time: '11:00 - 11:50', sectionA: 'ME463', sectionB: 'ME455', sectionC: 'ME421' },
        { time: '14:30 - 17:00', sectionB: 'ME456' }
    ],
    friday: [],
    saturday: []
};

export const courseDetails: Record<string, CourseInfo> = {
    ME411: {
        name: 'Applied Thermodynamics',
        teachers: ['Dr. B. Salam'],
        sessional: false
    },
    ME421: {
        name: 'Fluid Machinery',
        teachers: ['Dr. M. M. Alam', 'Dr. M. M. Roshid'],
        sessional: false
    },
    ME463: {
        name: 'Industrial Management',
        teachers: ['Dr. M. S. Rabbi', 'Dr. A. S. M. Sayem', 'Mr. A. A. Mamun'],
        sessional: false
    },
    ME455: {
        name: 'Mechatronics',
        teachers: ['Dr. S. C. Banik', 'Dr. M. S. Rabbi'],
        sessional: false
    },
    ME415: {
        name: 'Automobile Engineering',
        teachers: ['Dr. M. M. Rahman', 'Dr. M. A. M. Hossain'],
        sessional: false
    },
    ME423: {
        name: 'Aerodynamics',
        teachers: ['Dr. M. M. Alam', 'Dr. P. Das'],
        sessional: false
    },
    ME469: {
        name: 'Operations Research',
        teachers: ['Mr. M. A. Islam', 'Mr. R. M. Meraz'],
        sessional: false
    },
    ME412: {
        name: 'Applied Thermodynamics Sessional',
        teachers: ['Dr. B. Salam', 'Dr. S. M. H. Kabir', 'Dr. K. A. Rahman'],
        sessional: true
    },
    ME422: {
        name: 'Fluid Machinery Sessional',
        teachers: ['Dr. M. M. Alam', 'Dr. P. Das', 'Dr. M. M. Roshid'],
        sessional: true
    },
    ME456: {
        name: 'Mechatronics Sessional',
        teachers: ['Dr. S. C. Banik', 'Dr. M. S. Rabbi', 'Mr. R. M. Meraz'],
        sessional: true
    },
    ME498: {
        name: 'Project and Thesis',
        teachers: ['Corresponding Supervisors'],
        sessional: true
    }
};

export const electiveCourses = ['ME415', 'ME423', 'ME469'];

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