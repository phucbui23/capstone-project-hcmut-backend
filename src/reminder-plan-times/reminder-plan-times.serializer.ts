export function exclude<reminderPlanTime, Key extends keyof reminderPlanTime>(
  _reminderPlanTime: reminderPlanTime,
  keys: Key[],
): Omit<reminderPlanTime, Key> {
  for (let key of keys) {
    delete _reminderPlanTime[key];
  }
  return _reminderPlanTime;
}
