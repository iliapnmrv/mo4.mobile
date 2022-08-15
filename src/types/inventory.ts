export type IInventory = {
  id: number;
  vedpos: number;
  name: string;
  place: string;
  kolvo: number;
  placepriority: number;
};

export type IScanned = {
  id: number;
  inventoryNum: number;
  name: string;
  status: 1 | 2 | 3 | 4;
  model: string;
  serialNum: string;
  position: number;
  place: string;
  trace?: string;
};
