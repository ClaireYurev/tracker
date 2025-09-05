import re

# Read the clean useTracker file
with open('store/useTracker.ts', 'r') as f:
    content = f.read()

# 1. Update imports to add subDays and format
content = re.sub(
    r"import \{ addDays, isTuesday, isFriday, parseISO \} from 'date-fns';",
    "import { addDays, isTuesday, isFriday, parseISO, subDays, format } from 'date-fns';",
    content
)

# 2. Add hasSeededDemoData to State type
content = re.sub(
    r'  currentUserId: number \| null;',
    '  currentUserId: number | null;\n  hasSeededDemoData: boolean;',
    content
)

# 3. Add seedDemoData to Actions type
content = re.sub(
    r'  applyWeekGoals: \(weekStartISO: string\) => void;',
    '  applyWeekGoals: (weekStartISO: string) => void;\n  seedDemoData: () => void;',
    content
)

# 4. Add hasSeededDemoData to initial state
content = re.sub(
    r'      currentUserId: null,',
    '      currentUserId: null,\n      hasSeededDemoData: false,',
    content
)

# 5. Add hasSeededDemoData to clearUserData
content = re.sub(
    r'          settings: defaultSettings\(\),',
    '          settings: defaultSettings(),\n          hasSeededDemoData: false,',
    content
)

# 6. Add seedDemoData function after clearUserData
seedDemoDataFunction = '''
      seedDemoData: () => {
        const { hasSeededDemoData, days } = get();
        if (hasSeededDemoData) return;

        const today = new Date();
        const newDays = { ...days };

        for (let i = 6; i >= 0; i--) {
          const dateISO = format(subDays(today, i), 'yyyy-MM-dd');
          const dateObj = parseISO(dateISO);
          const isRest = isRestWeekend(dateObj, 0, startOfWeekISO(today));
          
          if (!newDays[dateISO]) {
            const tasks = defaultTasksForDay(dateISO, isRest);
            
            const tasksWithProgress = tasks.map(task => {
              if (isRest) {
                return { ...task, done: Math.floor(Math.random() * (task.target || 0)) };
              }
              
              let progress = 0;
              switch (task.category) {
                case 'SQL':
                  progress = Math.floor(Math.random() * 6) + 2;
                  break;
                case 'Python':
                  progress = Math.random() > 0.3 ? 1 : 0;
                  break;
                case 'LeetCode':
                  progress = Math.floor(Math.random() * 3) + 1;
                  break;
                case 'SystemDesign':
                  progress = Math.floor(Math.random() * 60) + 20;
                  break;
                case 'Behavioral':
                  progress = Math.floor(Math.random() * 30) + 10;
                  break;
                case 'MockInterview':
                  progress = Math.random() > 0.5 ? 1 : 0;
                  break;
              }
              
              return { 
                ...task, 
                done: Math.min(progress, task.target || 0),
                completed: progress >= (task.target || 0)
              };
            });

            newDays[dateISO] = {
              dateISO,
              isRestDay: isRest,
              tasks: tasksWithProgress,
              notes: i === 0 ? 'Great progress today!' : '',
              pomodoros: Math.floor(Math.random() * 8) + 2,
              blocksCompleted: Math.floor(Math.random() * 6) + 1,
            };
          }
        }

        set({ 
          days: newDays, 
          hasSeededDemoData: true 
        });
      },'''

# Insert after clearUserData function
content = re.sub(
    r'(clearUserData: \(\) => \{[\s\S]*?\},)',
    r'\1' + seedDemoDataFunction,
    content
)

# Write back
with open('store/useTracker.ts', 'w') as f:
    f.write(content)

print('Successfully updated useTracker.ts with demo data seeding')
