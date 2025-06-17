export interface TimeSlot {
    time: string;
    sectionA?: string;
    sectionB?: string;
    sectionC?: string;
}

export interface CourseInfo {
    name: string;
    teachers: string[];
}

export interface ClassItem {
    time: string;
    code: string;
    name: string;
    teachers: string[];
}

export interface ClassStatus {
    status: 'no-classes' | 'ongoing' | 'before-classes' | 'break' | 'after-classes';
    index?: number;
    nextIndex?: number;
    progress?: number;
}

export interface ScheduleDay {
    title: string;
    highlight: boolean;
    classes: ClassItem[];
    status?: ClassStatus;
    isOffDay: boolean;
}

export type Section = 'A' | 'B' | 'C';
export type DayName = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
