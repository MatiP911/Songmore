export interface track {
    id: number;
    readable?: boolean;
    title: string;
    title_short: string;
    title_version: string;
    link: string;
    duration: number;
    rank: number;
    explicit_lyrics: boolean;
    explicit_content_lyrics: number;
    explicit_content_cover: number;
    preview: string;
    md5_image: string;
    position: number;
    artist: {
        id: number;
        name: string;
        link: string;
        picture: string;
        picture_small: string;
        picture_medium: string;
        picture_big: string;
        picture_xl: string;
        radio: boolean;
        tracklist: string;
        type: string;
    };
    album: {
        id: number;
        title: string;
        cover: string;
        cover_small: string;
        cover_medium: string;
        cover_big: string;
        cover_xl: string;
        md5_image: string;
        tracklist: string;
        type: string;
    };
    type: string;
}

export interface playlist {
    id: number
    title: string
    description: string
    duration: number
    public: boolean
    is_loved_track: boolean
    collaborative: boolean
    nb_tracks: number
    unseen_track_count?: number
    fans: number
    link: string
    share: string
    picture: string
    picture_small: string
    picture_medium: string
    picture_big: string
    picture_xl: string
    checksum: string
    creation_date: string
    add_date: string
    mod_date: string
    md5_image: string
    picture_type: string
    creator: {
        id: number
        name: string
        tracklist: string
        type: string
    }
    type: string
    tracks: {
        data: track[]
        checksum: string
    }
}

export interface genre {
    genre: string;
    playlistID: number;
}