import { IYoutubeClient } from './YoutubeClient';

type Item = {
  kind: 'youtube#searchResult';
  etag: string;
  id: {
    kind: string;
    videoId: string;
    channelId: string;
    playlistId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<
      'default' | 'medium' | 'high' | 'standard' | 'maxres',
      {
        url: string;
        width: number;
        height: number;
      }
    >;
    channelTitle: string;
    liveBroadcastContent: string;
  };
};

export default class Youtube {
  apiClient: IYoutubeClient;

  constructor(apiClient: IYoutubeClient) {
    this.apiClient = apiClient;
  }
  async search(keyword: string) {
    return keyword ? this.#searchByKeword(keyword) : this.#mostPopular();
  }

  async #searchByKeword(keyword: string) {
    return this.apiClient
      .search({
        params: { part: 'snippet', maxResults: 25, type: 'video', q: keyword },
      })
      .then((res) => res.data.items)
      .then((items) =>
        items.map((item: Item) => ({ ...item, id: item.id.videoId })),
      );
  }

  async #mostPopular() {
    return this.apiClient
      .videos({
        params: { part: 'snippet', maxResults: 25, chart: 'mostPopular' },
      })
      .then((res) => res.data.items);
  }
}
