import { activeClientConfig } from "./activeClient";

export interface CollectionItem {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string;
  features: string[];
}

export const collectionsConfig = activeClientConfig.collections;
