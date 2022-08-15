export type IDoc = {
  id: number;
  inventorynumber: number;
  name: string;
  model: string;
  sernum: string;
  sredstvo: number;
  person: number;
  owner: number;
  type: number;
  status: number;
};

export type IDocType = {
  id: number;
  type_id: number;
  type_name: string;
};

export type IDocPerson = {
  id: number;
  person_id: number;
  person_name: string;
};

export type IDocStatus = {
  id: number;
  status_id: number;
  status_name: string;
};

export type IDocOwner = {
  id: number;
  owner_id: number;
  owner_name: string;
};
