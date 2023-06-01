export interface StudentProps {
  id: string;
  name: string;
  open: boolean;
  githubUsername?: string;
  reservationExpiresOn?: string | null;
  fragmentsValues: {
    header: string;
    value: string;
  }[];
}