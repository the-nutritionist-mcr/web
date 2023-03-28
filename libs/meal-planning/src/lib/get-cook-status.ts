import { StandardPlan } from '@tnmw/types';

interface InTrialStatus {
  status: 'in_trial';
}

interface CancelledStatus {
  status: 'cancelled';
}

interface FutureStatus {
  status: 'future';
  startsOn?: Date;
}

interface PausedStatus {
  status: 'paused';
  pausedUntil?: Date;
  pausedFrom?: Date;
}

interface ActiveStatus {
  status: 'active';
  pausingOn?: Date;
  cancellingOn?: Date;
}

type Status =
  | ActiveStatus
  | CancelledStatus
  | PausedStatus
  | FutureStatus
  | InTrialStatus;

export const getCookStatus = (cookDate: Date, plan: StandardPlan): Status => {
  switch (plan.subscriptionStatus) {
    case 'in_trial':
      return { status: 'in_trial' };

    case 'non_renewing':
      // eslint-disable-next-line no-case-declarations
      const termEnd = new Date(plan.termEnd ?? '');
      return termEnd > cookDate
        ? {
            status: 'active',
            cancellingOn: termEnd,
          }
        : {
            status: 'cancelled',
          };

    case 'future':
      // eslint-disable-next-line no-case-declarations
      const startDate = plan.startDate && new Date(plan.startDate);

      if (!startDate) {
        return {
          status: 'future',
        };
      }

      return startDate < cookDate
        ? {
            status: 'active',
          }
        : {
            status: 'future',
            startsOn: startDate,
          };

    case 'paused':
    case 'active':
      {
        const pauseEnd = plan.pauseEnd && new Date(plan.pauseEnd);
        const pauseStart = plan.pauseStart && new Date(plan.pauseStart);

        if (!pauseStart && !pauseEnd) {
          return { status: plan.subscriptionStatus };
        }

        if (pauseEnd && cookDate > pauseEnd) {
          return { status: 'active' };
        }

        if (pauseStart && cookDate < pauseStart) {
          return { status: 'active', pausingOn: pauseStart };
        }

        if (
          pauseStart &&
          cookDate > pauseStart &&
          pauseEnd &&
          cookDate < pauseEnd
        ) {
          return {
            status: 'paused',
            pausedFrom: pauseStart,
            pausedUntil: pauseEnd,
          };
        }

        if (!pauseStart && pauseEnd && cookDate < pauseEnd) {
          return {
            status: 'paused',
            pausedUntil: pauseEnd,
          };
        }

        if (pauseStart && cookDate > pauseStart && !pauseEnd) {
          return {
            status: 'paused',
            pausedFrom: pauseStart,
          };
        }
      }
      break;
  }

  return {
    status: 'cancelled',
  };
};
