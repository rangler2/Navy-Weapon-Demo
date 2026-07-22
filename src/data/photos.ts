export interface RefPhoto {
  id: string
  src: string
  title: string
  caption: string
  credit: string
  licence: string
  licenceUrl: string
}

/** Rights-cleared photorealistic L403A1 / KS-1 references (OGL / public domain). */
export const REF_PHOTOS: RefPhoto[] = [
  {
    id: 'ranger',
    src: '/assets/photos/l403a1-ranger.jpg',
    title: 'Ranger Regiment — AIW system',
    caption:
      'Issued L403A1 configuration: FDE finish, QDC/MCQ-PRT suppressor, 1–10× LPVO with offset mini red-dot, Magpul-pattern magazine.',
    credit: 'Photo: Corporal Rebecca Brown / UK Ministry of Defence 2023',
    licence: 'OGL v3.0',
    licenceUrl: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  },
  {
    id: 'range-side',
    src: '/assets/photos/l403a1-range-side.jpg',
    title: 'Range side profile',
    caption:
      'Clear side aspect of the KS-1 / L403A1 suite on the line — suppressor, URX-6 length, LPVO + top red-dot, CTR-style stock.',
    credit: 'U.S. Marine Corps photo by Cpl. Memphis Pitts',
    licence: 'Public domain',
    licenceUrl: 'https://commons.wikimedia.org/wiki/File:MCST_Shoots_With_Royal_Marines_(9228519).jpg',
  },
  {
    id: 'norway',
    src: '/assets/photos/l403a1-norway.jpg',
    title: 'Royal Marines — Arctic demo',
    caption:
      'Commando Force demonstrating the new KS-1 rifle during cold-weather training in Norway.',
    credit: 'Photo: UK Ministry of Defence (FLEET-20250129-XC0130-141)',
    licence: 'OGL v3.0',
    licenceUrl: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  },
  {
    id: 'portrait',
    src: '/assets/photos/l403a1-ranger-portrait.jpg',
    title: 'AIW close presentation',
    caption: 'Portrait framing of the Alternative Individual Weapon at Lulworth training area.',
    credit: 'Photo: Corporal Rebecca Brown / UK Ministry of Defence 2023',
    licence: 'OGL v3.0',
    licenceUrl: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  },
]
