export class VideoModel {
  id: number;
  catIds: number[];
  name: string;
  formats: FormatModel;
  releaseDate: string;
}

export class FormatModel {
  [item: string]: {
    res: string;
    size: number;
  }
}
