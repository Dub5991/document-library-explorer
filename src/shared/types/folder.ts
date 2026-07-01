// A folder in the document hierarchy. parentId is null at the root.
export type Folder = {
  id: string
  name: string
  parentId: string | null
}
