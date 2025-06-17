import type { TimeSlot, ClassStatus, ClassItem, Section, ScheduleDay } from '$lib/types';
import { routine, courseDetails, dayNames, dayLabels } from '$lib/data';

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

// --- MODIFIED FUNCTION ---
export function getCurrentStatus(
    daySchedule: TimeSlot[],
    currentTime: Date,
    section: Section // <-- 1. ADDED SECTION PARAMETER
): ClassStatus {
    // 2. FILTER THE SCHEDULE FOR THE SPECIFIC SECTION FIRST
    const sectionDaySchedule = daySchedule.filter(
        (slot) => slot[`section${section}` as keyof TimeSlot]
    );

    // If the section has no classes on this day, return 'no-classes'
    if (!sectionDaySchedule || sectionDaySchedule.length === 0) return { status: 'no-classes' };

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    // 3. USE THE FILTERED SCHEDULE FOR THE REST OF THE LOGIC
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
            // If it's before the very first class of the section
            if (i === 0) {
                return { status: 'before-classes' };
            }

            // It's a break between two classes for this section
            const prevSlot = sectionDaySchedule[i - 1];
            const [prevEndTime] = prevSlot.time.split(' - ').slice(1);
            const [prevEndHour, prevEndMinute] = prevEndTime.split(':').map(Number);
            const prevEndMinutes = prevEndHour * 60 + prevEndMinute;

            const breakProgress =
                ((currentMinutes - prevEndMinutes) / (startMinutes - prevEndMinutes)) * 100;
            return { status: 'break', nextIndex: i, progress: breakProgress };
        }
    }

    // If the loop finishes, it means we are after the last class of the section
    return { status: 'after-classes' };
}
// --- END OF MODIFIED FUNCTION ---

export function getClassesForSection(daySchedule: TimeSlot[], section: Section): ClassItem[] {
    if (!daySchedule) return [];

    return daySchedule
        .map((slot): ClassItem | null => {
            const courseCode = slot[`section${section}` as keyof TimeSlot] as string | undefined;
            if (!courseCode) return null;

            const courseInfo = courseDetails[courseCode.split(' ')[0]];
            return {
                time: slot.time,
                code: courseCode,
                name: courseInfo?.name || 'Unknown Course',
                teachers: courseInfo?.teachers || []
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

export function getScheduleData(currentTime: Date, currentSection: Section): ScheduleDay[] {
    const today = currentTime.getDay();
    const todaySchedule = getDaySchedule(today);

    const todayStatus = getCurrentStatus(todaySchedule, currentTime, currentSection);


    const scheduleData: ScheduleDay[] = [];

    if (todayStatus.status === 'after-classes' || todayStatus.status === 'no-classes') {
        scheduleData.push({
            title: `Today (${dayLabels[today]})`,
            classes: getClassesForSection(todaySchedule, currentSection),
            isOffDay: getClassesForSection(todaySchedule, currentSection).length === 0, // Check if section has classes
            highlight: false
        });

        const tomorrowIndex = (today + 1) % 7;
        const tomorrowSchedule = getDaySchedule(tomorrowIndex);
        scheduleData.push({
            title: `Tomorrow (${dayLabels[tomorrowIndex]})`,
            classes: getClassesForSection(tomorrowSchedule, currentSection),
            isOffDay: getClassesForSection(tomorrowSchedule, currentSection).length === 0,
            highlight: true,
        });

        for (let i = 2; i < 7; i++) {
            const dayIndex = (today + i) % 7;
            const daySchedule = getDaySchedule(dayIndex);
            scheduleData.push({
                title: dayLabels[dayIndex],
                classes: getClassesForSection(daySchedule, currentSection),
                isOffDay: getClassesForSection(daySchedule, currentSection).length === 0,
                highlight: false
            });
        }
    } else {
        const yesterdayIndex = (today - 1 + 7) % 7;
        const yesterdaySchedule = getDaySchedule(yesterdayIndex);
        scheduleData.push({
            title: `Yesterday (${dayLabels[yesterdayIndex]})`,
            classes: getClassesForSection(yesterdaySchedule, currentSection),
            isOffDay: getClassesForSection(yesterdaySchedule, currentSection).length === 0,
            highlight: false,
        });

        scheduleData.push({
            title: `Today (${dayLabels[today]})`,
            classes: getClassesForSection(todaySchedule, currentSection),
            status: todayStatus,
            isOffDay: getClassesForSection(todaySchedule, currentSection).length === 0,
            highlight: true
        });

        for (let i = 1; i < 6; i++) {
            const dayIndex = (today + i) % 7;
            const daySchedule = getDaySchedule(dayIndex);
            scheduleData.push({
                title: dayLabels[dayIndex],
                classes: getClassesForSection(daySchedule, currentSection),
                isOffDay: getClassesForSection(daySchedule, currentSection).length === 0,
                highlight: false
            });
        }
    }

    return scheduleData;
}