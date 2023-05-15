export interface UpdateStatus {
  action: 'reserve'| 'employ' | 'disinterest';
  studentId: string;
  hrId: string | null;
}
