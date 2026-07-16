// Priority Engine: Core business logic for daily task prioritization

export interface Objective {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  priority: 'high' | 'medium' | 'low';
  category: string;
  status: 'active' | 'completed' | 'archived';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  objectiveId?: string;
  dueDate: Date;
  timeRequired: number; // in minutes
  priority: 'high' | 'medium' | 'low';
  urgency: 'urgent' | 'important' | 'normal'; // Eisenhower Matrix
  importance: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  scheduledTime?: Date;
  tags: string[];
}

export interface DiaryEntry {
  id: string;
  date: Date;
  tasks: Task[];
  objectives: Objective[];
  notes: string;
  summary: string;
  completionRate: number; // 0-100
}

export interface DailyRoutine {
  id: string;
  date: Date;
  timeBlocks: TimeBlock[];
  totalAvailableTime: number; // in minutes
  tasks: Task[];
  priorities: PrioritizedTask[];
}

export interface TimeBlock {
  id: string;
  startTime: Date;
  endTime: Date;
  taskId?: string;
  type: 'meeting' | 'focus' | 'break' | 'admin' | 'flexible';
  title: string;
}

export interface PrioritizedTask extends Task {
  score: number;
  rank: number;
  rationale: string;
}

// Eisenhower Matrix Quadrants
type EisenhowerQuadrant = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';

export class PriorityEngine {
  private objectives: Map<string, Objective> = new Map();
  private tasks: Map<string, Task> = new Map();
  private diaries: Map<string, DiaryEntry> = new Map();

  // Add or update objective
  addObjective(objective: Objective): void {
    this.objectives.set(objective.id, objective);
  }

  // Add or update task
  addTask(task: Task): void {
    this.tasks.set(task.id, task);
  }

  // Calculate Eisenhower Matrix position
  private getEisenhowerQuadrant(task: Task): EisenhowerQuadrant {
    const isUrgent = task.urgency === 'urgent';
    const isImportant = task.importance === 'high';

    if (isUrgent && isImportant) return 'urgent-important';
    if (!isUrgent && isImportant) return 'not-urgent-important';
    if (isUrgent && !isImportant) return 'urgent-not-important';
    return 'not-urgent-not-important';
  }

  // Calculate priority score using weighted algorithm
  private calculatePriorityScore(task: Task): number {
    const now = new Date();
    const daysUntilDue = (task.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    // Weight factors
    const urgencyWeight = task.urgency === 'urgent' ? 40 : task.urgency === 'important' ? 20 : 5;
    const importanceWeight = task.importance === 'high' ? 30 : task.importance === 'medium' ? 15 : 5;
    const deadlineWeight = daysUntilDue <= 1 ? 25 : daysUntilDue <= 3 ? 15 : 5;
    const priorityWeight = task.priority === 'high' ? 5 : task.priority === 'medium' ? 2 : 0;

    return urgencyWeight + importanceWeight + deadlineWeight + priorityWeight;
  }

  // Generate daily routine with prioritized tasks
  generateDailyRoutine(date: Date, availableMinutes: number = 480): DailyRoutine {
    const dayTasks = Array.from(this.tasks.values()).filter(
      t => t.dueDate.toDateString() === date.toDateString() && t.status !== 'completed'
    );

    const prioritizedTasks: PrioritizedTask[] = dayTasks
      .map((task, idx) => ({
        ...task,
        score: this.calculatePriorityScore(task),
        rank: idx + 1,
        rationale: this.getEisenhowerQuadrant(task),
      }))
      .sort((a, b) => b.score - a.score);

    return {
      id: `routine-${date.toISOString()}`,
      date,
      timeBlocks: this.generateTimeBlocks(prioritizedTasks, date, availableMinutes),
      totalAvailableTime: availableMinutes,
      tasks: prioritizedTasks,
      priorities: prioritizedTasks,
    };
  }

  // Generate time blocks from prioritized tasks
  private generateTimeBlocks(tasks: PrioritizedTask[], date: Date, availableMinutes: number): TimeBlock[] {
    const blocks: TimeBlock[] = [];
    let currentTime = new Date(date);
    currentTime.setHours(9, 0, 0, 0); // Start at 9 AM

    let remainingTime = availableMinutes;

    for (const task of tasks) {
      if (remainingTime <= 0) break;

      const blockDuration = Math.min(task.timeRequired, remainingTime);
      const endTime = new Date(currentTime);
      endTime.setMinutes(endTime.getMinutes() + blockDuration);

      blocks.push({
        id: `block-${task.id}`,
        startTime: new Date(currentTime),
        endTime,
        taskId: task.id,
        type: 'focus',
        title: task.title,
      });

      currentTime = endTime;
      remainingTime -= blockDuration;

      // Add 15-min break after every 90 minutes
      if (remainingTime > 0 && blocks.length % 3 === 0) {
        const breakStart = new Date(currentTime);
        const breakEnd = new Date(currentTime);
        breakEnd.setMinutes(breakEnd.getMinutes() + 15);

        blocks.push({
          id: `break-${blocks.length}`,
          startTime: breakStart,
          endTime: breakEnd,
          type: 'break',
          title: 'Break',
        });

        currentTime = breakEnd;
        remainingTime -= 15;
      }
    }

    return blocks;
  }

  // Get all tasks for a date
  getTasksForDate(date: Date): Task[] {
    return Array.from(this.tasks.values()).filter(
      t => t.dueDate.toDateString() === date.toDateString()
    );
  }

  // Get objectives by category
  getObjectivesByCategory(category: string): Objective[] {
    return Array.from(this.objectives.values()).filter(o => o.category === category && o.status === 'active');
  }

  // Mark task as completed
  completeTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'completed';
    }
  }

  // Create diary entry from daily routine
  createDiaryEntry(routine: DailyRoutine): DiaryEntry {
    const completedTasks = routine.tasks.filter(t => t.status === 'completed').length;
    const completionRate = (completedTasks / routine.tasks.length) * 100;

    return {
      id: `diary-${routine.date.toISOString()}`,
      date: routine.date,
      tasks: routine.tasks,
      objectives: Array.from(this.objectives.values()),
      notes: '',
      summary: `${completedTasks}/${routine.tasks.length} tasks completed`,
      completionRate,
    };
  }

  // Export all data
  exportData() {
    return {
      objectives: Array.from(this.objectives.values()),
      tasks: Array.from(this.tasks.values()),
      diaries: Array.from(this.diaries.values()),
    };
  }
}

// Singleton instance
export const priorityEngine = new PriorityEngine();
