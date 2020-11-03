export class VideoModel {
  id?: number;
  catIds: number[];
  authorName?: string;
  authorId?: number;
  name: string;
  formats: FormatModel;
  releaseDate?: string;
}

export class FormatModel {
  [item: string]: {
    res: string;
    size: number;
  }
}
