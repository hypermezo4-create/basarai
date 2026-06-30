import type { PlatformPreset } from '@/types'

export interface PresetInfo {
  width: number
  height: number
  label: string
}

export const PLATFORM_PRESETS: Record<PlatformPreset, PresetInfo> = {
  instagram_post:       { width: 1080, height: 1080, label: 'Instagram Post' },
  instagram_story:      { width: 1080, height: 1920, label: 'Instagram Story' },
  instagram_reel_cover: { width: 1080, height: 1920, label: 'Instagram Reel Cover' },
  facebook_post:        { width: 1200, height:  630, label: 'Facebook Post' },
  facebook_cover:       { width:  820, height:  312, label: 'Facebook Cover' },
  facebook_story:       { width: 1080, height: 1920, label: 'Facebook Story' },
  twitter_post:         { width: 1200, height:  675, label: 'Twitter Post' },
  twitter_header:       { width: 1500, height:  500, label: 'Twitter Header' },
  linkedin_post:        { width: 1200, height:  627, label: 'LinkedIn Post' },
  linkedin_banner:      { width: 1584, height:  396, label: 'LinkedIn Banner' },
  tiktok_video_cover:   { width: 1080, height: 1920, label: 'TikTok Video Cover' },
  youtube_thumbnail:    { width: 1280, height:  720, label: 'YouTube Thumbnail' },
  youtube_banner:       { width: 2560, height: 1440, label: 'YouTube Banner' },
}

export const PRESETS_BY_PLATFORM: Record<string, PlatformPreset[]> = {
  Instagram: ['instagram_post', 'instagram_story', 'instagram_reel_cover'],
  Facebook:  ['facebook_post', 'facebook_cover', 'facebook_story'],
  'Twitter/X': ['twitter_post', 'twitter_header'],
  LinkedIn:  ['linkedin_post', 'linkedin_banner'],
  TikTok:    ['tiktok_video_cover'],
  YouTube:   ['youtube_thumbnail', 'youtube_banner'],
}
