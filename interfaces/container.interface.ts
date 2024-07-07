import { Models } from "appwrite";

export interface Container extends Models.Document {
  ordinal: number;
  title: string;
  enabled: boolean;
}
