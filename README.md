# Class Routine PWA

![App Icon](static/android-chrome-192x192.png)

A simple, fast, and clean web app to keep track of your class schedule, for mobile. I built this with SvelteKit and Tailwind CSS to have a real-time view of my university routine. [Try it here](https://routine.sh4jid.me).

*   **It's a PWA:** You can install it on your phone and it works offline.
*   **Always Live:** It highlights the current class, shows progress for ongoing classes and breaks, and tells you what's next.
*   **Smart View:** Shows you today's schedule, but once classes are done, it automatically highlights tomorrow so you're ready for the next day.
*   **Section Switching:** Easily toggle between sections A, B, and C. The section is saved in the local storage.
*   **Debug Mode:** Includes a time simulator to test the schedule at any given day or time.



## Add Your Own Routine

It's super easy to adapt this for your own schedule. **All you need to edit is one file: `src/lib/data.ts`**.

Inside that file, you'll find two main objects:

1.  **`routine`**: This holds the weekly schedule. Just map your class times and course codes for each section. If a section doesn't have a class, just leave it out for that time slot.

    ```ts
    // src/lib/data.ts
    export const routine = {
        // ...
        monday: [
            { time: '09:00 - 09:50', sectionA: 'ME461', sectionB: 'ME413', sectionC: 'ME431' },
            { time: '09:50 - 10:40', sectionA: 'ME431', sectionB: 'ME451', sectionC: 'ME413' },
            // Section B has no class here, so it's omitted
            { time: '14:30 - 17:00', sectionA: 'ME452 (A1/A2)', sectionC: 'ME432 (C1/C2)' }
        ],
        friday: [], // Empty for off-days
        // ...
    };
    ```

2.  **`courseDetails`**: This links the course codes from the `routine` to their full names and teachers.

    ```ts
    // src/lib/data.ts
    export const courseDetails = {
        ME413: {
            name: 'Power Plant Engineering',
            teachers: ['Dr. Bodius Salam', 'Dr. Kazi Afzalur Rahman']
        },
        // ...
    };
    ```

**Tip:** To save time, copy your routine text (from a PDF or document) and ask an AI like ChatGPT or Gemini to format it for you.

**Other small tweaks:**
*   Change the app title in `src/routes/+page.svelte`.
*   Adjust the section names in `src/lib/components/SectionSelector.svelte`.

## 🛠️ Running Locally

You'll need [Node.js](https://nodejs.org/) installed.

```bash
# Clone the repo
git clone https://github.com/shajidhasan/class-routine.git
cd class-routine

# Install dependencies
npm install

# Run the dev server
npm run dev
```

The app will be live at `http://localhost:5173`.

---

Built with **SvelteKit**, **TypeScript**, and **Tailwind CSS**. Released under the **MIT License**.