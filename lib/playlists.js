import { apiFetch } from "../lib/api";

const SOURCE_PATH = "/api/playlists/current";

export async function getCurrentPlaylist() {
  return apiFetch(SOURCE_PATH);
}