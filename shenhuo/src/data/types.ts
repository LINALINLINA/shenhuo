export interface Story {
  id: string;
  title: string;
  summary: string;
  category: string;
  era: string;
  tags: string[];
  content?: string;
  discussion?: string[];
  readingTime: number;
  ageRange: string;
  gradient: string;
  order: number;
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
}

export interface Place {
  name: string;
  realm: "heaven" | "mortal" | "underworld" | "sea";
  pos: { left: string; top: string };
  desc: string;
}
