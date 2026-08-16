export class TaskCounters {
  todo: number;
  inProgress: number;
  done: number;
}

export class WeeklyActivityItem {
  day: string;
  count: number;
}

export class UserStats {
  completionRate: number;
  counters: TaskCounters;
  weeklyActivity: WeeklyActivityItem[];
}
