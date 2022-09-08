export type CatalogsNames = 'owners' | 'persons' | 'statuses' | 'storages' | 'types'

// export type CatalogsResponse<T> = 
//     T extends "owners" ? IOwner :
//     T extends "persons" ? IPerson :
//     T extends "statuses" ? IStatus :
//     T extends "storages" ? IStorage :
//     T extends "types" ? IType :
//     never;

export type IOwner = {
    id: number
    owner_id: number
    owner_name: string
}

export type IStorage = {
    id: number
    storage_id: number
    storage_name: string
}

export type IStatus = {
    id: number
    status_id: number
    status_name: string
}

export type IPerson = {
    id: number
    person_id: number
    person_name: string
}

export type IType = {
    id: number
    type_id: number
    type_name: string
}