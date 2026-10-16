import type { IslandPlaceId } from "@/lib/island-places";
import type { TravelImage } from "@/lib/travel-images";

export type SeriesLocation = {
  id: string;
  name?: string;
  description?: string;
  status: "confirmed" | "suggested" | "unconfirmed";
  placeId?: IslandPlaceId;
};

export type SeriesActivity = {
  id: string;
  title: string;
  genre: string;
  description: string;
  image: TravelImage;
  imageAlt: string;
  confirmedFilmingScope: string;
  locations: SeriesLocation[];
  sources: { label: string; url: string }[];
};

export const seriesActivities: SeriesActivity[] = [
  {
    id: "game-rai-game-rak",
    title: "เกมร้ายเกมรัก",
    genre: "โรแมนติก / ดราม่า",
    description:
      "ตามรอยเรื่องราวความรักท่ามกลางบรรยากาศริมทะเลและสถานที่อันเป็นเอกลักษณ์ของเกาะสีชัง",
    image: "gamerai",
    imageAlt: "ภาพชายฝั่งเกาะสีชังประกอบหมวดตามรอยเกมร้ายเกมรัก",
    confirmedFilmingScope:
      "มีรายงานสื่อท่องเที่ยวระบุว่าปารี ฮัท รีสอร์ทเป็นหนึ่งในโลเคชันของเรื่อง แต่ไม่ได้ยืนยันว่าทุกจุดในรายการนี้ปรากฏในฉากถ่ายทำ",
    locations: [
      {
        id: "paree-hut",
        status: "confirmed",
        placeId: "paree-hut-resort",
      },
      
    
      {
        id: "phra-chudadhuj",
        status: "suggested",
        placeId: "phra-chudadhuj",
      },
      {
        id: "atsadang-bridge",
        status: "suggested",
        placeId: "atsadang-bridge",
      },
      
    ],
    sources: [
      {
        label: "MGR Online · ตามรอยละครดัง",
        url: "https://mgronline.com/travel/detail/9550000102401",
      },
    ],
  },
  {
    id: "timeline",
    title: "Timeline จดหมาย ความทรงจำ",
    genre: "โรแมนติก / ความทรงจำ",
    description:
      "สัมผัสเสน่ห์ของสถานที่คลาสสิกและบรรยากาศอบอุ่น เหมาะกับการเดินเล่นและเก็บภาพความทรงจำ",
    image: "timeline",
    imageAlt: "ภาพสะพานริมทะเลเกาะสีชังประกอบหมวดตามรอย Timeline",
    confirmedFilmingScope:
      "มีรายงานว่าภาพยนตร์ถ่ายทำบนเกาะสีชัง แต่แหล่งข้อมูลที่ตรวจพบไม่ได้ยืนยันสถานที่เฉพาะทุกจุดด้านล่าง",
    locations: [
      {
        id: "atsadang-bridge",
        status: "suggested",
        placeId: "atsadang-bridge",
      },
      {
        id: "khao-yai-shrine",
        status: "suggested",
        placeId: "khao-yai-shrine",
      },
      {
        id: "buddha-footprint",
        status: "suggested",
        placeId: "buddha-footprint",
      },
    ],
    sources: [
      {
        label: "Chillpainai · รายงานสถานที่ถ่ายทำ Timeline บนเกาะสีชัง",
        url: "https://chillpainai.com/scoop/8233",
      },
      {
        label: "Sahamongkolfilm · ข้อมูลภาพยนตร์ Timeline",
        url: "https://sahamongkolfilm.com/saha-movie/timeline-movie-2557",
      },
    ],
  },
  {
    id: "the-stranded",
    title: "เคว้ง (The Stranded)",
    genre: "ระทึกขวัญ / เอาชีวิตรอด",
    description: "สำรวจบรรยากาศธรรมชาติที่ชวนให้ค้นหา เหมาะสำหรับผู้ชื่นชอบความลึกลับและการผจญภัย",
    image: "queng",
    imageAlt: "ภาพชายฝั่งเกาะสีชังประกอบหมวดตามรอยเคว้ง",
    confirmedFilmingScope:
      "มีรายงานจากคลิปสถานที่ถ่ายทำของ Netflix ",
    locations: [
      {
        id: "chong-khao-kad",
        status: "suggested",
        placeId: "chong-khao-khat",
      },
      
      {
        id: "tham-phang-beach",
        status: "suggested",
        placeId: "tham-phang-beach",
      },
      
    ],
    sources: [
      {
        label: "Popcornfor2 · รายงานคลิปสถานที่ถ่ายทำจาก Netflix",
        url: "https://www.popcornfor2.com/content/news-113022/",
      },
      {
        label: "Netflix · The Stranded",
        url: "https://www.netflix.com/th/title/80242491",
      },
    ],
  },
  {
    id: "pan-yai-jom-salat",
    title: "ปืนใหญ่จอมสลัด",
    genre: "ภาพยนตร์ / ผจญภัย",
    description:
      "ตามรอยพื้นที่ปารีฮัทและแหลมจักรพงษ์ ซึ่งเอกสารแนบระบุว่าใช้จำลองหมู่บ้านชาวเลและรังโจรสลัด",
    image: "biggun",
    imageAlt: "ชายฝั่งเกาะสีชังประกอบเส้นทางตามรอยปืนใหญ่จอมสลัด",
    confirmedFilmingScope:
      "ข้อมูลมาจากเอกสารผู้ใช้ที่แนบมา ยังไม่มีการยืนยันฉากและสิทธิ์เข้าถึงพื้นที่จากแหล่งถ่ายทำโดยตรง",
    locations: [
      { id: "paree-hut", status: "suggested", placeId: "paree-hut-resort" },
      {
        id: "laem-chakraphong",
        name: "แหลมจักรพงษ์ (ถ้ำทะลุ)",
        description: "เอกสารแนบระบุเป็นส่วนหนึ่งของพื้นที่ถ่ายทำ",
        status: "suggested",
        placeId: "tham-thalu",
      },
      { id: "atsadang-bridge", status: "suggested", placeId: "atsadang-bridge" },
    ],
    sources: [],
  },
  {
    id: "she-is-destined",
    title: "เธอคือพรหมลิขิต",
    genre: "ละคร / โรแมนติก",
    description:
      "ตามรอยบรรยากาศชุมชนท่าวังและวิถีชีวิตรอบเกาะ ซึ่งเอกสารแนบเชื่อมโยงกับเรื่องราวของวนิดา",
    image: "destiny",
    imageAlt: "ชุมชนบนเกาะสีชังประกอบเส้นทางตามรอยเธอคือพรหมลิขิต",
    confirmedFilmingScope:
      "",
    locations: [
      { id: "ko-sichang-lighthouse", status: "suggested", placeId: "ko-sichang-lighthouse" },
    ],
    sources: [],
  },
];
