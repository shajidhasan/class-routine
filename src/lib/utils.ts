import type { TimeSlot, ClassStatus, ClassItem, Section, ScheduleDay } from './types';
import { routine, courseDetails, dayNames, dayLabels } from './data';

export function formatTimeFromMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

export function parseTime(timeStr: string): Date {
    const [hour, minute] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
}

export function getCurrentStatus(
    daySchedule: TimeSlot[],
    currentTime: Date,
    section: Section
): ClassStatus {
    const sectionDaySchedule = daySchedule.filter(
        (slot) => slot[`section${section}` as keyof TimeSlot]
    );

    if (!sectionDaySchedule || sectionDaySchedule.length === 0) return { status: 'no-classes' };

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    for (let i = 0; i < sectionDaySchedule.length; i++) {
        const slot = sectionDaySchedule[i];
        const [startTime, endTime] = slot.time.split(' - ');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
            const progress = ((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100;
            return { status: 'ongoing', index: i, progress };
        }

        if (currentMinutes < startMinutes) {
            if (i === 0) {
                return { status: 'before-classes' };
            }
            const prevSlot = sectionDaySchedule[i - 1];
            const [prevEndTime] = prevSlot.time.split(' - ').slice(1);
            const [prevEndHour, prevEndMinute] = prevEndTime.split(':').map(Number);
            const prevEndMinutes = prevEndHour * 60 + prevEndMinute;

            const breakProgress =
                ((currentMinutes - prevEndMinutes) / (startMinutes - prevEndMinutes)) * 100;
            return { status: 'break', nextIndex: i, progress: breakProgress };
        }
    }
    return { status: 'after-classes' };
}

export function getClassesForSection(daySchedule: TimeSlot[], section: Section, selectedElective?: string): ClassItem[] {
    if (!daySchedule) return [];

    return daySchedule
        .map((slot): ClassItem | null => {
            let courseCode = slot[`section${section}` as keyof TimeSlot] as string | undefined;
            if (!courseCode) return null;

            // Replace ELECTIVE placeholder with selected elective course
            if (courseCode === 'ELECTIVE') {
                courseCode = selectedElective || 'ELECTIVE';
            }

            const courseInfo = courseDetails[courseCode.split(' ')[0]];
            return {
                time: slot.time,
                code: courseCode,
                name: courseInfo?.name || 'Unknown Course',
                teachers: courseInfo?.teachers || [],
                sessional: courseInfo?.sessional || false
            };
        })
        .filter((item): item is ClassItem => item !== null);
}

export function getDaySchedule(dayIndex: number): TimeSlot[] {
    const dayName = dayNames[dayIndex];
    if (dayName === 'friday' || dayName === 'saturday') {
        return [];
    }
    return routine[dayName] || [];
}

// --- MODIFIED FUNCTION ---
export function getScheduleData(currentTime: Date, currentSection: Section, selectedElective?: string): ScheduleDay[] {
    const todayIndex = currentTime.getDay();
    const todaySchedule = getDaySchedule(todayIndex);
    const todayStatus = getCurrentStatus(todaySchedule, currentTime, currentSection);

    const startDayIndex =
        todayStatus.status === 'after-classes' || todayStatus.status === 'no-classes'
            ? (todayIndex + 1) % 7
            : todayIndex;

    const scheduleData: ScheduleDay[] = [];
    const tomorrowIndex = (todayIndex + 1) % 7;

    for (let i = 0; i < 7; i++) {
        const currentDayIndex = (startDayIndex + i) % 7;
        const daySchedule = getDaySchedule(currentDayIndex);
        const classes = getClassesForSection(daySchedule, currentSection, selectedElective);

        let title: string;
        if (currentDayIndex === todayIndex) {
            title = `Today (${dayLabels[currentDayIndex]})`;
        } else if (currentDayIndex === tomorrowIndex) {
            title = `Tomorrow (${dayLabels[currentDayIndex]})`;
        } else {
            title = dayLabels[currentDayIndex];
        }

        const dayData: ScheduleDay = {
            title: title,
            classes: classes,
            isOffDay: classes.length === 0,
            highlight: i === 0
        };

        if (currentDayIndex === todayIndex) {
            dayData.status = todayStatus;
        }

        scheduleData.push(dayData);
    }

    return scheduleData;
}
