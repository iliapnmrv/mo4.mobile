import {ICatalog} from './catalogs';

export type IItem = {
  id: number;
  qr: number;
  name: string;
  month: number;
  year: number;
  serial_number: string;
  model: string;
  description: string | null;
  additional_information: string | null;
  instruction_id: number | null;
  status?: ICatalog;
  user?: ICatalog;
  person?: ICatalog;
  place?: ICatalog;
  device?: ICatalog;
  type?: ICatalog;
  status_id?: number;
  user_id?: number;
  person_id?: number;
  place_id?: number;
  device_id?: number;
  type_id?: number;
  updatedAt?: Date;
  createdAt?: Date;
  logs?: ILog[];
  files?: IFile[];
  instruction?: IFile;
};

export type ILog = {
  id: number;
  description: string;
  item_id: number;
  created_at: Date;
  author: string;
};

export type IFile = {
  created_at: Date;
  id: number;
  item_id: number;
  name: string;
  path: string;
};
