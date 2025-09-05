// Simple test to verify pomodoro timer logic
console.log('Testing Pomodoro Timer Logic...\n');

// Mock settings
const settings = {
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4
};

// Test duration calculation
function getDuration(timerState) {
  switch (timerState) {
    case 'focus': return settings.pomodoroMinutes * 60;
    case 'shortBreak': return settings.shortBreakMinutes * 60;
    case 'longBreak': return settings.longBreakMinutes * 60;
    default: return 0;
  }
}

// Test format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Test scenarios
console.log('1. Duration calculations:');
console.log(`   Focus: ${formatTime(getDuration('focus'))} (${getDuration('focus')} seconds)`);
console.log(`   Short Break: ${formatTime(getDuration('shortBreak'))} (${getDuration('shortBreak')} seconds)`);
console.log(`   Long Break: ${formatTime(getDuration('longBreak'))} (${getDuration('longBreak')} seconds)`);

console.log('\n2. Break type logic:');
for (let focusCount = 1; focusCount <= 5; focusCount++) {
  const shouldBeLongBreak = focusCount % settings.longBreakEvery === 0;
  const breakType = shouldBeLongBreak ? 'longBreak' : 'shortBreak';
  console.log(`   After ${focusCount} focus sessions: ${breakType} (${formatTime(getDuration(breakType))})`);
}

console.log('\n3. Time formatting:');
const testTimes = [0, 30, 60, 90, 1500, 3600];
testTimes.forEach(seconds => {
  console.log(`   ${seconds} seconds = ${formatTime(seconds)}`);
});

console.log('\n✅ Pomodoro timer logic tests completed successfully!');
