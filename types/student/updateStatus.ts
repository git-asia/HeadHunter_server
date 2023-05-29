export enum UpdateAction{
  disinterest=1,
  reserve,
  employ,
}

export interface UpdateStatus {
  action: UpdateAction;
  studentId: string;
  hrId: string | null;
}
