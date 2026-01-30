import { api } from "./middlewares/axios";

export interface MasterSchedule {
  id: number;
  master_id: number;
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface CreateMasterSchedulePayload {
  weekday: number;
  start_time: string;
  end_time: string;
}

/* GET расписание мастера */
export function fetchMasterSchedules(masterId: number) {
  return api
    .get<MasterSchedule[]>(`/api/masters/${masterId}/schedules`)
    .then((res) => res.data);
}

/* CREATE интервал */
export function createMasterSchedule(masterId: number, payload: CreateMasterSchedulePayload) {
  return api
    .post<MasterSchedule>(`/api/masters/${masterId}/schedules`, payload)
    .then((res) => res.data);
}

/* DELETE интервал */
export function deleteMasterSchedule(masterId: number, scheduleId: number) {
  return api.delete(`/api/masters/${masterId}/schedules/${scheduleId}`);
}
