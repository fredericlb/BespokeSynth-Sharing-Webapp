
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum Status {
    WAITING_FOR_VALIDATION = "WAITING_FOR_VALIDATION",
    APPROVED = "APPROVED",
    HIDDEN = "HIDDEN"
}

export class UploadPatchInput {
    title: string;
    author: string;
    mail: string;
    tags: string[];
    summary: string;
    description?: Nullable<string>;
}

export class File {
    name: string;
    url: string;
    type: string;
}

export class Patch {
    uuid: string;
    title: string;
    author: string;
    mail: string;
    tags: string[];
    files: string[];
    summary: string;
    description?: Nullable<string>;
    status: number;
    revision: number;
    publish: Date;
    modules?: Nullable<string>;
    _token?: Nullable<string>;
}

export abstract class IQuery {
    abstract patch(uuid: string): Nullable<Patch> | Promise<Nullable<Patch>>;
}

export abstract class IMutation {
    abstract uploadPatch(patch?: Nullable<UploadPatchInput>): Nullable<Patch> | Promise<Nullable<Patch>>;
}

export type Upload = any;
type Nullable<T> = T | null;
