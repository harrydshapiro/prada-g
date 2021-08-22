export type SanitizedMedia = SanitizedPlaylist | SpotifyApi.AlbumObjectFull
export type SanitizedPlaylist = SpotifyApi.PlaylistObjectSimplified & { artists: { name: string }[] }
