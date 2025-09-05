import re

# Read the clean calendar file
with open('app/calendar/page.tsx', 'r') as f:
    content = f.read()

# 1. Update imports to add isToday and Activity
content = re.sub(
    r'import \{ \n  startOfMonth, \n  format, \n  isSameMonth, \n  isSameDay, \n  addMonths, \n  subMonths,\n  formatISO\n\} from "date-fns";',
    'import { \n  startOfMonth, \n  format, \n  isSameMonth, \n  isSameDay, \n  addMonths, \n  subMonths,\n  formatISO,\n  isToday\n} from "date-fns";',
    content
)

content = re.sub(
    r'import \{ Calendar as CalendarIcon, ChevronLeft, ChevronRight, Dot \} from "lucide-react";',
    'import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Dot, Activity } from "lucide-react";',
    content
)

# 2. Update useTracker destructuring
content = re.sub(
    r'  const \{ days \} = useTracker\(\);',
    '  const { days, seedDemoData, hasSeededDemoData } = useTracker();',
    content
)

# 3. Update useEffect to include demo data seeding and jump to current month
content = re.sub(
    r'  useEffect\(\(\) => \{\n    setMounted\(true\);\n  \}, \[\]\);',
    '''  useEffect(() => {
    setMounted(true);
    // Jump to current month on load
    setCurrentMonth(new Date());
    
    // Seed demo data if not already seeded
    if (!hasSeededDemoData) {
      seedDemoData();
    }
  }, [seedDemoData, hasSeededDemoData]);''',
    content
)

# 4. Add helper functions after getDayEntry
helperFunctions = '''
  const hasActivity = (date: Date) => {
    const dayEntry = getDayEntry(date);
    if (!dayEntry) return false;
    
    const hasCompletedTasks = dayEntry.tasks.some(t => 
      t.completed || (t.target && t.done >= t.target)
    );
    const hasPomodoros = (dayEntry.pomodoros || 0) > 0;
    const hasNotes = dayEntry.notes && dayEntry.notes.trim().length > 0;
    
    return hasCompletedTasks || hasPomodoros || hasNotes;
  };

  const jumpToToday = () => {
    setCurrentMonth(new Date());
  };
'''

content = re.sub(
    r'(  const getDayEntry = \(date: Date\) => \{\n    const dateISO = formatISO\(date\);\n    return days\[dateISO\];\n  \};\n)',
    r'\1' + helperFunctions,
    content
)

# 5. Add Today button in header
content = re.sub(
    r'(            <div className="flex items-center gap-2">)',
    r'''            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={jumpToToday}
                className="mr-2"
              >
                Today
              </Button>''',
    content
)

# 6. Update calendar day rendering to include activity indicators
content = re.sub(
    r'(                const dayEntry = getDayEntry\(date\);\n                const isCurrentMonth = isSameMonth\(date, currentMonth\);\n                const isCurrentDay = isToday\(date\);\n                const hasData = !!dayEntry;)',
    r'''                const dayEntry = getDayEntry(date);
                const isCurrentMonth = isSameMonth(date, currentMonth);
                const isCurrentDay = isToday(date);
                const hasData = !!dayEntry;
                const hasActivityToday = hasActivity(date);''',
    content
)

# 7. Update the day cell styling and content
content = re.sub(
    r'(                  <div\n                    key=\{index\}\n                    className=\{`p-2 h-20 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 \${\n                      isCurrentDay \? \'bg-primary/10 border-primary\' : \'border-border\'\n                    \} \${\!hasData \? \'opacity-50\' : \'\'`\}\n                    onClick=\{\(\) => hasData && navigateToDate\(date\)\}\n                  >)',
    r'''                  <div
                    key={index}
                    className={`p-2 h-20 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      isCurrentDay ? 'bg-primary/10 border-primary ring-2 ring-primary/20' : 'border-border'
                    } ${!hasData ? 'opacity-50' : ''}`}
                    onClick={() => hasData && navigateToDate(date)}
                    title={hasData ? `Click to view ${format(date, 'MMM d, yyyy')}` : ''}
                  >''',
    content
)

# 8. Update the day number and indicators
content = re.sub(
    r'(                        <span className=\{`text-sm font-medium \$\{\n                          isCurrentDay \? \'text-primary\' : \'\'\n                        \}`\}>\n                          \{format\(date, \'d\'\)\}\n                        </span>\n                        \{dayEntry\?\.isRestDay && \(\n                          <Dot className="h-3 w-3 text-muted-foreground" />\n                        \)\})',
    r'''                        <span className={`text-sm font-medium ${
                          isCurrentDay ? 'text-primary font-bold' : ''
                        }`}>
                          {format(date, 'd')}
                        </span>
                        <div className="flex items-center gap-1">
                          {dayEntry?.isRestDay && (
                            <Dot className="h-3 w-3 text-muted-foreground" />
                          )}
                          {hasActivityToday && (
                            <Activity className="h-3 w-3 text-green-500" />
                          )}
                        </div>''',
    content
)

# 9. Add pomodoro count display
content = re.sub(
    r'(                          <Badge \n                            variant=\{completedTasks === totalTasks \? "default" : "secondary"\}\n                            className="text-xs w-fit"\n                          >\n                            \{completedTasks\}/\{totalTasks\}\n                          </Badge>)',
    r'''                          <Badge 
                            variant={completedTasks === totalTasks && totalTasks > 0 ? "default" : "secondary"}
                            className="text-xs w-fit"
                          >
                            {completedTasks}/{totalTasks}
                          </Badge>
                          {dayEntry.pomodoros > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              í½… {dayEntry.pomodoros}
                            </div>
                          )}''',
    content
)

# 10. Update legend to include new indicators
content = re.sub(
    r'(          <div className="flex items-center gap-2">\n            <Dot className="h-3 w-3" />\n            <span>Rest day</span>\n          </div>\n        </div>)',
    r'''          <div className="flex items-center gap-2">
            <Dot className="h-3 w-3" />
            <span>Rest day</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-green-500" />
            <span>Activity logged</span>
          </div>
          <div className="flex items-center gap-2">
            <span>í½…</span>
            <span>Pomodoros completed</span>
          </div>
        </div>''',
    content
)

# Write back
with open('app/calendar/page.tsx', 'w') as f:
    f.write(content)

print('Successfully updated calendar page with UX improvements')
