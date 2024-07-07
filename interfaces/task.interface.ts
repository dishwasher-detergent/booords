import { Models } from "appwrite";

export interface Task extends Models.Document {
  ordinal: number;
  title: string;
  container: string;
}
