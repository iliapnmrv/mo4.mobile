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
  person: ICatalog[];
  status: ICatalog[];
  user: ICatalog[];
  place: ICatalog[];
  device: ICatalog[];
  type: ICatalog[];
};
