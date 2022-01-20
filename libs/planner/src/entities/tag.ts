import { Attribute } from "./attribute";

export interface Tag {
  readonly id: string;
  readonly name: string;
  readonly attributes: Attribute[];
}
