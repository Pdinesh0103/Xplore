# Dream Job Roadmap - Implementation Plan

## 1. Project Initialization
- [x] Initialize Next.js project named `dream-job-roadmap`.
  - Command: `npx create-next-app@latest dream-job-roadmap --typescript --tailwind --eslint --no-app --src-dir` (Using --no-app might be wrong if we want App Router, actually `create-next-app` defaults to App Router now. I'll stick to the user's command `npx create-next-app@latest .` inside a new folder or let it create the folder).
  - *Correction*: The user said "Initialize the project using npx create-next-app@latest .". This implies the current directory `Xplore` might be the project root, or I should create a folder. Given `Xplore` sounds like a workspace for multiple projects, I should probably create a `dream-job-roadmap` directory first or ask. However, standard practice in a workspace `.../web/Xplore` is to create the project folder inside it. I will create `dream-job-roadmap`.
- [x] Install dependencies:
  - `firebase`
  - `lucide-react`

## 2. Configuration
- [x] Create `firebase.js` in `src/lib/firebase.js`.
  - Exports: `initializeApp`, `getFirestore` (even if unused initially, good for structure).
  - Content: Standard Firebase setup with placeholder keys.
- [x] Configure Tailwind (`tailwind.config.ts`)
  - Add custom colors for "Notion-style" look (off-white bg, slate text, specific blue for accents).

## 3. Core Feature: RoadmapGenerator
- [x] Create `src/components/RoadmapGenerator.tsx`.
- [x] State: `jobRole` (string), `skillLevel` (string), `roadmap` (array), `loading` (boolean).
- [x] Mock API Simulation function:
  - Takes inputs.
  - Returns a promise that resolves after 2 seconds.
  - Returns JSON structure:
    ```json
    [
      { "id": 1, "title": "Foundation", "description": "...", "duration": "1 month" },
      { "id": 2, "title": "Core Skills", "description": "...", "duration": "2 months" },
      ...
    ]
    ```
- [x] Render:
  - Input form (clean, minimalist).
  - Timeline display of the roadmap steps.

## 4. UI/UX
- [x] "Notion-style" aesthetics:
  - Font: Inter or Sans-serif.
  - Colors: `bg-white` or `bg-gray-50`, `text-gray-900`, borders `gray-200`.
  - Spacing: Generous padding.
  - Icons: Lucide React icons for visual cues.

## 5. Verification
- [x] Build project.
- [x] Browser test the landing page and interactions.
