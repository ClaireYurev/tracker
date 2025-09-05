# Tech Screen Prep Tracker

A comprehensive daily tracker for Meta interview preparation with client-side persistence, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### ��� Core Functionality
- **Daily Task Tracking**: Track progress on SQL, Python, LeetCode, System Design, Behavioral, and Mock Interview tasks
- **Pomodoro Timer**: Built-in focus timer with customizable durations and break intervals
- **Calendar View**: Monthly calendar with progress badges and rest day indicators
- **Weekly Planning**: Set weekly goals and distribute them across weekdays
- **Statistics Dashboard**: Visual progress tracking with charts and KPIs
- **Settings Management**: Customize study plan, timer settings, and appearance

### ��� Progress Tracking
- **Task Completion**: Track done vs target for each task category
- **Focus Blocks**: Log completed pomodoro sessions
- **Streak Tracking**: Monitor consecutive study days (ignoring rest days)
- **Completion Rates**: View daily and weekly completion statistics
- **Category Breakdown**: Detailed progress by interview category

### ���️ Smart Calendar
- **Deterministic Seeding**: Calendar populated from study start to interview date
- **Alternating Rest Weekends**: Automatic rest day scheduling
- **Mock Interview Scheduling**: Tuesdays and Fridays automatically include mock interview tasks
- **Progress Visualization**: Day badges show completed/total tasks
- **Navigation**: Click any day to view/edit that date's tasks

### ⚙️ Customization
- **Flexible Settings**: Adjust interview date, study start date, and rest patterns
- **Pomodoro Configuration**: Customize focus, short break, long break durations
- **Dark Mode**: Toggle between light and dark themes
- **Data Management**: Export/import progress data, reset all data
- **Notifications**: Optional browser notifications for timer phases

### ��� User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Use +/- keys to increment/decrement task progress
- **Accessibility**: Proper labels, focus management, and screen reader support
- **Client-Side Persistence**: All data stored in localStorage with Zustand
- **Onboarding**: First-time setup wizard for new users

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **UI Components**: Radix UI primitives with shadcn/ui
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meta-prep-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Run

On first launch, you'll see an onboarding dialog where you can:
- Set your study start date (defaults to today)
- Set your interview date (defaults to 2025-10-20)
- Choose alternating rest weekends (enabled by default)

After setup, your calendar will be automatically populated with study days and tasks.

## Usage

### Dashboard
- View and track daily tasks
- Use +/- buttons or keyboard shortcuts to update progress
- Add notes to individual tasks or the entire day
- Use the pomodoro timer for focused study sessions
- Mark completed focus blocks (morning/afternoon/evening)

### Calendar
- Navigate between months
- Click any day to jump to that date on the dashboard
- View progress badges (completed/total tasks)
- Rest days are marked with a dot indicator

### Planner
- Select a week (Monday start date)
- Set weekly goals for each category
- Apply goals to distribute targets across weekdays
- Rest days are automatically excluded from goal distribution

### Statistics
- View daily completion rate trends
- See category-wise progress breakdown
- Track key metrics: streak, total pomodoros, completion rates
- Charts update automatically as you log progress

### Settings
- Adjust study plan dates and rest patterns
- Customize pomodoro timer durations
- Toggle dark mode and notifications
- Export/import your data
- Reset all data if needed

## Data Storage

All data is stored client-side in localStorage with the key `mpt-v1`. This includes:
- Daily task progress and notes
- Weekly goals and planning data
- Settings and preferences
- Pomodoro session counts

## Keyboard Shortcuts

- **+**: Increment task progress (when task card is focused)
- **-**: Decrement task progress (when task card is focused)

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Development

### Project Structure
```
meta-prep-tracker/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard (home page)
│   ├── calendar/          # Calendar view
│   ├── plan/              # Weekly planner
│   ├── stats/             # Statistics dashboard
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Main navigation
│   ├── pomodoro-timer.tsx # Pomodoro timer
│   └── onboarding-dialog.tsx # First-time setup
├── lib/                  # Utility functions
│   ├── dates.ts          # Date manipulation helpers
│   └── ui.ts             # UI utility functions
├── store/                # Zustand store
│   └── useTracker.ts     # Main application state
└── types/                # TypeScript type definitions
    └── tracker.ts        # Core data types
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)
- State management with [Zustand](https://zustand-demo.pmnd.rs/)
