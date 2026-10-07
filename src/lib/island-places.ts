export const islandPlaces = [
  {
    id: 'khao-yai-shrine',
    name: 'ศาลเจ้าพ่อเขาใหญ่',
    shortName: 'ศาลเจ้าพ่อเขาใหญ่',
    area: 'ตอนเหนือของเกาะ',
    description: 'ศาสนสถานบนเขาที่ผสมผสานสถาปัตยกรรมไทย–จีน และเป็นจุดชมวิวของเกาะ',
    position: { top: '25%', left: '59%' },
  },
  {
    id: 'buddha-footprint',
    name: 'รอยพระพุทธบาท',
    shortName: 'รอยพระพุทธบาท',
    area: 'พื้นที่สูงทางเหนือของเกาะ',
    description: 'มณฑปประดิษฐานรอยพระพุทธบาท อยู่สูงขึ้นไปจากบริเวณศาลเจ้าพ่อเขาใหญ่',
    position: { top: '13%', left: '48%' },
  },
  {
    id: 'atsadang-bridge',
    name: 'สะพานอัษฎางค์',
    shortName: 'สะพานอัษฎางค์',
    area: 'ทิศตะวันออกของพระราชวังพระจุฑาธุชราชฐาน',
    description: 'สะพานไม้สีขาวสุดคลาสสิกที่ทอดยาวเข้าไปยังกลางทะเล',
    position: { top: '60%', left: '68%' },
  },
  {
    id: 'phra-chudadhuj',
    name: 'พระจุฑาธุชราชฐาน',
    shortName: 'พระจุฑาธุชราชฐาน',
    area: 'ริมชายฝั่งตอนกลางของเกาะ',
    description: 'พระราชฐานริมทะเลที่มีความสำคัญทางประวัติศาสตร์ของเกาะสีชัง',
    position: { top: '70%', left: '65%' },
  },
  {
    id: 'tham-thalu',
    name: 'ถ้ำทะลุ',
    shortName: 'ถ้ำทะลุ',
    area: 'บริเวณแหลมจักรพงษ์',
    description: 'จุดชมภูมิทัศน์ธรรมชาติบริเวณชายฝั่งด้านตะวันตกของเกาะ',
    position: { top: '45%', left: '40%' },
  },
  {
    id: 'tham-phang-beach',
    name: 'หาดถ้ำพัง',
    shortName: 'หาดถ้ำพัง',
    area: 'ชายฝั่งตะวันตกของเกาะ',
    description: 'ชายหาดสวยงาม เหมาะกับการพักผ่อนและชมบรรยากาศทะเล',
    position: { top: '63%', left: '36%' },
  },
  {
    id: 'tha-yai-tim',
    name: 'ท่ายายทิม',
    shortName: 'ท่ายายทิม',
    area: 'ตอนใต้ของเกาะ',
    description: 'หาดทรายขาวและน้ำทะเลใส ในช่วงเวลาที่น้ำลงสามารถเมองเห็นทะเลแหวกได้',
    position: { top: '95%', left: '48%' },
  },
  {
    id: 'Laem-Ngoo-Harbour',
    name: 'สะพานท่าเทียบเรือแหลมงู',
    shortName: 'สะพานเขียว',
    area: 'ตอนใต้ของเกาะ',
    description: 'เป็นที่รู้จักในหมู่นักตกปลาว่าเป็น "หมาย" ที่ดีในการตกหมึกกระดอง',
    position: { top: '86%', left: '60%' },
  },
] as const;

export type IslandPlaceId = (typeof islandPlaces)[number]['id'];

export function isIslandPlaceId(value: string): value is IslandPlaceId {
  return islandPlaces.some((place) => place.id === value);
}

export function parseIslandPlaceIds(value: string | undefined): IslandPlaceId[] {
  if (!value) return [];
  return [...new Set(value.split(',').filter(isIslandPlaceId))];
}
