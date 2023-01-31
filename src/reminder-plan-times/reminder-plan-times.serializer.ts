import { Injectable } from "@nestjs/common";

@Injectable()
export class ReminderPlanTimesSerializer {
  async exclude<reminderPlanTime, Key extends keyof reminderPlanTime>(
    _reminderPlanTime: reminderPlanTime,
    keys: Key[],
  ): Promise<Omit<reminderPlanTime, Key>> {
    for (let key of keys) {
      delete _reminderPlanTime[key];
    }
    return _reminderPlanTime;
  }
}
