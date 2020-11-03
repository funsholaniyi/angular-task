import { VideoModel } from './video.model';

export class AuthorModel {
  id?: number;
  name: string;
  videos: VideoModel[];
}

