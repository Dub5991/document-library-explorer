// Document lifecycle status — shared by Badge and the data contract.
export type Status = 'draft' | 'review' | 'approved' | 'archived'

export const STATUS_LABEL: Record<Status, string> = {
  draft: 'Draft',
  review: 'In Review',
  approved: 'Approved',
  archived: 'Archived',
}
