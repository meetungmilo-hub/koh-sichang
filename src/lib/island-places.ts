import type { TravelImage } from "@/lib/travel-images";

/** Shared place records. A map pin is only rendered when verified coordinates exist. */
export type IslandPlace = {
  id: string;
  mapNumber?: number;
  referenceName?: string;
  name: string;
  nameEn?: string;
  shortName: string;
  area: string;
  description: string;
  /** Highlight wording drawn from the user's island guide document. */
  highlight?: string;
  category: "ธรรมชาติ" | "ศาสนสถาน" | "ประวัติศาสตร์" | "คาเฟ่" | "ชุมชน" | "ท่าเรือ" | "ที่พัก";
  image?: TravelImage;
  imageAlt?: string;
  coordinates?: { latitude: number; longitude: number; sourceUrl: string };
  sourceUrl?: string;
};

const tatIslandPage =
  "https://thai.tourismthailand.org/Attraction/%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B8%8A%E0%B8%B1%E0%B8%87";
const tatIslandItinerary =
  "https://thai.tourismthailand.org/Articles/2%E0%B8%A7%E0%B8%B1%E0%B8%991%E0%B8%84%E0%B8%B7%E0%B8%99%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B8%8A%E0%B8%B1%E0%B8%87%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%95%E0%B9%8A%E0%B8%B2%E0%B8%8A";

const rawIslandPlaces = [
  {
    id: "ko-sichang-lighthouse",
    mapNumber: 1,
    name: "ประภาคารเกาะสีชัง",
    shortName: "ประภาคาร",
    area: "บริเวณวัดอัษฎางคนิมิตร",
    description:
      "แหล่งท่องเที่ยวของเกาะที่แหล่งข้อมูล",
    highlight:
      "เป็นแลนด์มาร์คสำคัญและจุดถ่ายรูปยอดนิยมใกล้ท่าเรือเทววงษ์ (ท่าล่าง) ซึ่งช่วงเย็นหรือกลางคืนจะมีการเปิดไฟสวยงาม",
    category: "ประวัติศาสตร์",
    image: "prapakarnday",
    sourceUrl: tatIslandPage,
  },
  {
    id: "guanyin-shrine",
    mapNumber: 2,
    name: "ศาลเจ้าแม่กวนอิม",
    nameEn: "Guanyin Shrine",
    shortName: "ศาลเจ้าแม่กวนอิม",
    area: "บริเวณทางขึ้นศาลเจ้าพ่อเขาใหญ่ · ตำแหน่งย่อยรอตรวจสอบ",
    description: "สถานที่สักการะที่แหล่งข้อมูลท่องเที่ยวระบุว่าอยู่ก่อนถึงศาลเจ้าพ่อเขาใหญ่",
    highlight: "สถานที่สักการะและขอพร ตามเอกสารแนะนำสถานที่",
    category: "ศาสนสถาน",
    image: "sanjaoguanim",
    sourceUrl: tatIslandItinerary,
  },
  {
    id: "khao-yai-shrine",
    mapNumber: 3,
    name: "ศาลเจ้าพ่อเขาใหญ่",
    nameEn: "Chao Pho Khao Yai Shrine",
    shortName: "ศาลเจ้าพ่อเขาใหญ่",
    area: "ตอนเหนือของเกาะ · ตำแหน่ง GPS รอตรวจสอบ",
    description: "ศาลเจ้าบนเขาที่แหล่งข้อมูล ททท. ระบุว่าเป็นสถานที่สำคัญของเกาะสีชัง",
    highlight: "แลนด์มาร์กสายสักการะบนภูเขา การขอพรด้านการค้าและโชคลาภ",
    category: "ศาสนสถาน",
    image: "sanjaoporky",
    sourceUrl: tatIslandPage,
  },
  {
    id: "buddha-footprint",
    mapNumber: 4,
    name: "มณฑปรอยพระพุทธบาท",
    shortName: "มณฑปรอยพระพุทธบาท",
    area: "พื้นที่สูงเหนือศาลเจ้าพ่อเขาใหญ่ ",
    description: "มณฑปประดิษฐานรอยพระพุทธบาทบนพื้นที่สูงเหนือศาลเจ้าพ่อเขาใหญ่",
    highlight: "สักการะรอยพระพุทธบาทและชมวิวทะเลสองฝั่งของเกาะ",
    category: "ศาสนสถาน",
    image: "montop",
    sourceUrl: tatIslandPage,
  },
  {
    id: "chong-khao-khat",
    mapNumber: 5,
    name: "ช่องเขาขาด (ช่องอิศริยาภรณ์)",
    shortName: "ช่องเขาขาด",
    area: "ด้านหลังของเกาะ · ตำแหน่ง GPS รอตรวจสอบ",
    description:
      "ช่องเขาบริเวณชายฝั่งด้านหลังเกาะ มีสะพานวชิราวุธและจุดชมวิวใกล้เคียงตามข้อมูล ททท.",
    highlight: "จุดชมวิวหน้าผาและพระอาทิตย์ตก",
    category: "ธรรมชาติ",
    image: "chongkaokard",
    sourceUrl: tatIslandPage,
  },
  {
    id: "tham-phang-beach",
    mapNumber: 7,
    referenceName: "แหลมถ้ำพัง",
    name: "หาดถ้ำพัง (อ่าวอัษฎางค์)",
    nameEn: "Tham Phang Beach (Ao Atsadang)",
    shortName: "หาดถ้ำพัง",
    area: "ชายฝั่งตะวันตกของเกาะ",
    description:
      "เทศบาลเกาะสีชังเรียกบริเวณนี้ว่าอ่าวอัษฎางค์และหาดถ้ำพัง",
    highlight:
      "หาดทรายละเอียดสำหรับเล่นน้ำ และเป็นจุดพายคายัคชมวิวอ่าว",
    category: "ธรรมชาติ",
    image: "aoussadang",
    sourceUrl: "https://www.kohsichang.go.th/travel/detail/163",
  },
  {
    id: "atsadang-bridge",
    mapNumber: 8,
    name: "สะพานอัษฎางค์",
    nameEn: "Atsadang Bridge",
    shortName: "สะพานอัษฎางค์",
    area: "ด้านตะวันออกของพระจุฑาธุชราชฐาน",
    description: "สะพานริมทะเลภายในบริเวณพระจุฑาธุชราชฐาน",
    highlight:
      "สะพานไม้สีขาวทอดออกไปในทะเล เป็นจุดถ่ายรูปยอดนิยมและเหมาะกับการรับแสงเช้า",
    category: "ประวัติศาสตร์",
    image: "coast",
    imageAlt: "สะพานอัษฎางค์ เกาะสีชัง",
    sourceUrl: tatIslandPage,
  },
  {
    id: "phra-chudadhuj",
    mapNumber: 9,
    name: "พระจุฑาธุชราชฐาน",
    nameEn: "Phra Chuthathut Palace",
    shortName: "พระจุฑาธุชราชฐาน",
    area: "ชายฝั่งตอนกลางของเกาะ",
    description: "พระราชฐานสมัยรัชกาลที่ 5 ปัจจุบันเป็นพิพิธภัณฑ์และพื้นที่ประวัติศาสตร์ของเกาะ",
    highlight: "พระราชวังฤดูร้อนบนเกาะสีชังที่มีสถาปัตยกรรมโดดเด่น",
    category: "ประวัติศาสตร์",
    image: "prajuthatu",
    sourceUrl: tatIslandPage,
  },
  
  {
    id: "islandish-cafe",
    mapNumber: 10,
    name: "Islandish Café",
    shortName: "Islandish Café",
    area: "เกาะสีชัง · ที่อยู่และพิกัด GPS รอตรวจสอบ",
    description: "ชื่อสถานที่ตามรายการอ้างอิง; โปรดยืนยันที่อยู่และสถานะร้านก่อนเดินทาง",
    highlight:
      "คาเฟ่ตกแต่งสวยงามเหมาะแก่การนั่งชิลและถ่ายรูป",
    category: "คาเฟ่",
    image: "islandish",
    sourceUrl: "https://salehere.co.th/articles/coordinates-koh-sichang-restaurant",
  },
  {
    id: "tham-thalu",
    name: "ถ้ำทะลุ",
    shortName: "ถ้ำทะลุ",
    area: "บริเวณแหลมจักรพงษ์ · พิกัด GPS รอตรวจสอบ",
    description:
      "สถานที่เดิมในข้อมูลเส้นทาง; คงแยกจากช่องเขาขาดจนกว่าจะยืนยันว่าเป็นชื่อหรือจุดเดียวกัน",
    highlight: "จุดชมธรรมชาติบริเวณแหลมจักรพงษ์และถ้ำทะลุ",
    category: "ธรรมชาติ",
    image: "talucave2",
    sourceUrl: tatIslandPage,
  },
  {
    id: "laem-Ngoo-Harbour",
    name: "สะพานท่าเทียบเรือแหลมงู",
    shortName: "สะพานท่าเทียบเรือแหลมงู",
    area: " ",
    description:
      " ",
    highlight: "สะพานริมทะเลและจุดชมวิวทางตอนใต้",
    category: "ธรรมชาติ",
    image: "greenbridge",
    sourceUrl: tatIslandPage,
  },
  
  {
    id: "crab-bank-learning-center",
    name: "ศูนย์เรียนรู้ธนาคารปูม้าบนบก เกาะสีชัง",
    shortName: "ศูนย์เรียนรู้ธนาคารปูม้า",
    area: "อำเภอเกาะสีชัง จังหวัดชลบุรี · จุดย่อยรอตรวจสอบ",
    description:
      "แหล่งเรียนรู้ฟื้นฟูทรัพยากรปูม้าและการมีส่วนร่วมของชุมชน; รายละเอียดเข้าชมควรติดต่อผู้ดูแล",
    highlight:
      "เรียนรู้วงจรชีวิตปูม้าและการอนุรักษ์ทรัพยากรทะเล",
    category: "ชุมชน",
    image: "pumabank",
    sourceUrl: "https://sustainability.chula.ac.th/th/report/3033/",
  },
  {
    id: "community-batik-workshop",
    name: "ชมรมส่งเสริมการท่องเที่ยวโดยชุมชนเกาะสีชัง",
    shortName: "Workshop ผ้าบาติกชุมชน",
    area: "ตำบลท่าเทววงษ์",
    description: "ผู้จัดกิจกรรมเรียนรู้ผ้าบาติกจากข้อมูล CBT Thailand; ไม่มีพิกัด GPS ที่ยืนยัน",
    highlight:
      "กิจกรรมเพ้นท์ผ้าบาติกและนำผลงานกลับได้",
    category: "ชุมชน",
    image: "workshop",
    sourceUrl: "https://cbtthailand.dasta.or.th/webapp/attraction/content/43/",
  },
  {
    id: "paree-hut-resort",
    name: "ปารี ฮัท รีสอร์ท (Paree Hut Resort)",
    shortName: "ปารี ฮัท",
    area: "เกาะสีชัง จังหวัดชลบุรี · พิกัด GPS รอตรวจสอบ",
    description:
      "มีรายงานว่าเป็นหนึ่งในสถานที่ถ่ายทำละครเกมร้ายเกมรัก; ตำแหน่งและเงื่อนไขการเข้าชมยังไม่มีข้อมูลยืนยัน",
    category: "ที่พัก",
    image: "pareehut",
    sourceUrl: "https://mgronline.com/travel/detail/9550000102401",
  },
  
  {
    id: "sea-split-viewpoint",
    name: "หาดยายทิม",
    shortName: "หาดยายทิม",
    area: "เกาะสีชัง · ตำแหน่งย่อยและพิกัดยังไม่มีข้อมูลยืนยัน",
    description: "จุดชมธรรมชาติที่ระบุในเอกสารรวมสถานที่ท่องเที่ยวเกาะสีชัง",
    highlight: "ชมหาดและปรากฏการณ์ทะเลแหวก",
    category: "ธรรมชาติ",
    image: "hardyaitim",
  },
  {
    id: "koh-kham-yai",
    name: "เกาะขามใหญ่",
    shortName: "เกาะขามใหญ่",
    area: "นอกชายฝั่งเกาะสีชัง · การเดินทางและพิกัดยังไม่มีข้อมูลยืนยัน",
    description: "เกาะใกล้เคียงที่เอกสารแนบระบุเป็นบริเวณดำน้ำ",
    highlight:
      "ดำน้ำตื้นดูปลาและปะการัง",
    category: "ธรรมชาติ",
    image: "khamyai",
  },
  
  {
    id: "ko-sichang-fresh-market",
    name: "ถนนคนเดิน",
    shortName: "ตลาดสดเกาะสีชัง",
    area: "เกาะสีชัง · ตำแหน่งย่อยและเวลาเปิดยังไม่มีข้อมูลยืนยัน",
    description: "ตลาดที่ระบุในเอกสารรวมสถานที่ท่องเที่ยวเกาะสีชัง",
    highlight:
      "แวะเลือกซื้ออาหารและทำความรู้จักชุมชนท้องถิ่น",
    category: "ชุมชน",
    image: "market",
  },
  {
    id: "chao-ban-chao-le-restaurant",
    name: "ร้านอาหารชาวบ้านชาวเล",
    shortName: "ร้านอาหารชาวบ้านชาวเล",
    area: "เกาะสีชัง · ที่อยู่และพิกัดยังไม่มีข้อมูลยืนยัน",
    description:
      "สถานที่ที่ระบุให้เชื่อมกับกิจกรรมดินเนอร์; เวลาเปิด เมนู และบริการยังไม่มีข้อมูลยืนยัน",
    highlight: "ข้อมูลร้านและช่วงเวลาให้บริการควรตรวจสอบก่อนเดินทาง",
    category: "ชุมชน",
    image: "dinner",
  },
] as const satisfies readonly IslandPlace[];

export type IslandPlaceId = (typeof rawIslandPlaces)[number]["id"];
export const islandPlaces = rawIslandPlaces as readonly (IslandPlace & { id: IslandPlaceId })[];

export function isIslandPlaceId(value: string): value is IslandPlaceId {
  return islandPlaces.some((place) => place.id === value);
}

export function parseIslandPlaceIds(value: string | undefined): IslandPlaceId[] {
  if (!value) return [];
  return [...new Set(value.split(",").filter(isIslandPlaceId))];
}

export function mergeIslandPlaceIds(
  currentIds: readonly IslandPlaceId[],
  addedIds: readonly IslandPlaceId[],
): IslandPlaceId[] {
  return [...new Set([...currentIds, ...addedIds])];
}
