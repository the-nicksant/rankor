import type { ReactNode } from 'react';
import type { ActionGroup, ActionItem } from '../domain/scoring';
import { HandFist, HandGrab, Target, Zap } from 'lucide-react';

interface GroupingRule {
  label: string;
  icon: ReactNode;
  color: string;
  keywords: string[];
}

const GROUPING_RULES: Record<string, GroupingRule> = {
  strikes: {
    label: 'Strikes',
    icon: <HandFist />,
    color: 'bg-red-500',
    keywords: ['punch', 'jab', 'kick', 'elbow', 'knee', 'strike', 'hit', 'cross', 'hook', 'uppercut'],
  },
  grappling: {
    label: 'Grappling',
    icon: <HandGrab />,
    color: 'bg-blue-500',
    keywords: ['takedown', 'throw', 'guard', 'mount', 'sweep', 'pass', 'back', 'submission', 'choke', 'armbar'],
  },
  control: {
    label: 'Control',
    icon: <Target />,
    color: 'bg-purple-500',
    keywords: ['control', 'clinch', 'cage', 'position', 'dominant', 'ground'],
  },
  significant: {
    label: 'Significant',
    icon: <Zap />,
    color: 'bg-orange-500',
    keywords: ['knockdown', 'submission_attempt', 'finish', 'slam', 'reversal', 'escape'],
  },
};

const MAX_ACTIONS_PER_GROUP = 8;

/**
 * Groups scoring actions into categories for the joystick UI
 * Actions are auto-grouped based on keyword matching
 */
export function groupScoringActions(
  scoringMethods: Record<string, number>
): ActionGroup[] {
  const groups: ActionGroup[] = [];
  const groupedKeys = new Set<string>();

  // Group actions by matching keywords
  for (const [groupId, rule] of Object.entries(GROUPING_RULES)) {
    const actions: ActionItem[] = [];
    let position = 0;

    for (const [key, points] of Object.entries(scoringMethods)) {
    
      if (groupedKeys.has(key)) continue;

      const matchesGroup = rule.keywords.some((keyword) =>
        key.toLowerCase().includes(keyword)
      );

      if (matchesGroup) {
      
        if (position < MAX_ACTIONS_PER_GROUP) {
          actions.push({
            key,
            label: formatActionLabel(key),
            points,
            position: position % 8,
          });
          groupedKeys.add(key);
          position++;
        }
      }
    }

    // Only add group if it has actions
    if (actions.length > 0) {
      groups.push({
        id: groupId,
        label: rule.label,
        icon: rule.icon,
        color: rule.color,
        actions,
      });
    }
  }

  // Handle ungrouped actions (fallback "Other" group)
  const ungroupedActions: ActionItem[] = [];
  let position = 0;

  for (const [key, points] of Object.entries(scoringMethods)) {
    if (!groupedKeys.has(key) && position < MAX_ACTIONS_PER_GROUP) {
      ungroupedActions.push({
        key,
        label: formatActionLabel(key),
        points,
        position: position % 8,
      });
      position++;
    }
  }

  if (ungroupedActions.length > 0) {
    groups.push({
      id: 'other',
      label: 'Other',
      icon: '📋',
      color: 'bg-gray-500',
      actions: ungroupedActions,
    });
  }

  return groups;
}

/**
 * Converts snake_case action keys to human-readable labels
 * Example: "head_punch" → "Head Punch"
 */
export function formatActionLabel(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate angle from center point to target point (in degrees)
 * 0° is top, 90° is right, 180° is bottom, 270° is left
 */
export function calculateAngle(
  center: { x: number; y: number },
  target: { x: number; y: number }
): number {
  const dx = target.x - center.x;
  const dy = target.y - center.y;
  const radians = Math.atan2(dy, dx);
  let degrees = (radians * 180) / Math.PI + 90; // Adjust so 0° is top
  if (degrees < 0) degrees += 360;
  return degrees;
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Find which action matches a given angle in the radial menu
 * Positions are mapped: 0=top, 1=right, 2=bottom, 3=left, 4-7=diagonals
 */
export function findActionByAngle(
  angle: number,
  actions: ActionItem[]
): ActionItem | null {
  // Position angle ranges (with tolerance)
  const POSITION_RANGES: Record<number, [number, number]> = {
    0: [315, 45],   // Top
    1: [45, 135],   // Right
    2: [135, 225],  // Bottom
    3: [225, 315],  // Left
    4: [22.5, 67.5],   // Top-Right (overlap)
    5: [112.5, 157.5], // Bottom-Right (overlap)
    6: [202.5, 247.5], // Bottom-Left (overlap)
    7: [292.5, 337.5], // Top-Left (overlap)
  };

  // Find matching position
  for (const action of actions) {
    const [start, end] = POSITION_RANGES[action.position] || [0, 0];

    // Handle wraparound for top position
    if (start > end) {
      if (angle >= start || angle <= end) {
        return action;
      }
    } else if (angle >= start && angle <= end) {
      return action;
    }
  }

  return null;
}

/**
 * Calculate position for radial menu item
 * Returns { x, y } offset from center
 * Positions: 0=top, 1=right, 2=bottom, 3=left, then diagonals
 */
export function calculateRadialPosition(
  position: number,
  radius: number
): { x: number; y: number } {
  // Priority order: cardinal directions first, then diagonals
  const POSITION_ANGLES: Record<number, number> = {
    0: 0,    // Top
    1: 90,   // Right
    2: 180,  // Bottom
    3: 270,  // Left
    4: 45,   // Top-Right
    5: 135,  // Bottom-Right
    6: 225,  // Bottom-Left
    7: 315,  // Top-Left
  };

  const angle = POSITION_ANGLES[position] || 0;
  const radians = ((angle - 90) * Math.PI) / 180; // -90 to start from top
  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius,
  };
}

/**
 * Get score summary text based on judging system
 */
export function getScoreSummary(
  points: number,
  roundsWon: number,
  eventCount: number,
  judgingSystem: 'cumulative' | 'dominance'
): string {
  if (judgingSystem === 'cumulative') {
    return `${points} pts`;
  } else {
    return `${roundsWon} rounds won`;
  }
}
