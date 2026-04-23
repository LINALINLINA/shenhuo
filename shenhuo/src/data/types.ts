export interface Story {
  id: string;
  title: string;
  summary: string;
  category: string;
  era: string;
  tags: string[];
  content?: string;
  relatedCharacters?: string[];
  discussion?: string[];
  readingTime: number;
  ageRange: string;
  gradient: string;
  order: number;
  source?: {
    book: string;
    chapter?: string;
    quote?: string;
  };
  coverArt?: string;
  artifacts?: string[];
}

export interface Character {
  id: string;
  name: string;
  altName: string;
  title: string;
  desc: string;
  fullDesc?: string;
  era: string;
  tags: string[];
  relatedStories: string[];
  color: string;
  brushColor: string;
  avatarBg: string;
  avatarChar: string;
  elementIcon: string;
  tagClass: string;
  artifacts?: {
    name: string;
    desc: string;
  }[];
  quotes?: {
    text: string;
    source?: string;
  }[];
  relations?: {
    targetId: string;
    relation: string;
  }[];
}

export interface Place {
  name: string;
  realm: "heaven" | "mortal" | "underworld" | "sea";
  pos: { left: string; top: string };
  desc: string;
  relatedCharacters?: string[];
  relatedStories?: string[];
}
