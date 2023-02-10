export type ICatalogs =
  | 'person'
  | 'status'
  | 'user'
  | 'place'
  | 'device'
  | 'type';

export type ICatalog = {
  name: string;
  id: number;
};

export type IAllCatalogsResponse = {
  persons: ICatalog[];
  statuses: ICatalog[];
  users: ICatalog[];
  places: ICatalog[];
  devices: ICatalog[];
  types: ICatalog[];
};
