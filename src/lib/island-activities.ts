import type { IslandPlaceId } from "@/lib/island-places";
import type { TravelImage } from "@/lib/travel-images";

/** Editable prototype content. Unverified access, duration, cost and operators are labelled in the UI. */
export type IslandActivity = {
  id: string;
  category: "ชมวิว" | "วัฒนธรรม" | "ธรรมชาติ" | "ของอร่อย" | "กิจกรรมกลางแจ้ง";
  title: string;
  description: string;
  audience: string[];
  highlight: string;
  duration: string;
  bestTime: string;
  cost: string;
  preparation: string;
  image: TravelImage;
  imageAlt: string;
  placeIds: IslandPlaceId[];
  placeRelationNote?: string;
  workshop?: boolean;
  provider?: string;
  sources?: { label: string; url: string }[];
};

export const activityCategories = [
  "ทั้งหมด",
  "ชมวิว",
  "ธรรมชาติ",
  "วัฒนธรรม",
  "ของอร่อย",
  "กิจกรรมกลางแจ้ง",
] as const;
export type ActivityFilter = (typeof activityCategories)[number];

export const islandActivities: IslandActivity[] = [
  {
    id: "sunrise",
    category: "ชมวิว",
    title: "ตื่นมารับแสงเช้า",
    description: "เริ่มวันด้วยแสงแรกและลมทะเลในบรรยากาศเงียบสงบของเกาะ",
    audience: ["คนที่อยากเริ่มวันอย่างสงบ", "คนที่สนใจชมแสงแรก"],
    highlight: "จุดและเวลาชมพระอาทิตย์ขึ้นยังไม่ยืนยัน",
    duration: "ยังไม่มีข้อมูลยืนยัน",
    bestTime: "ช่วงเช้า · เวลาที่แน่นอนรอยืนยัน",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    preparation: "ตรวจพยากรณ์อากาศและสอบถามคนในพื้นที่เรื่องจุดชมก่อนออกเดินทาง",
    image: "sunrise",
    imageAlt: "ภาพชายฝั่งเกาะสีชัง ใช้ประกอบกิจกรรมชมแสงเช้า",
    placeIds: ["atsadang-bridge", "ko-sichang-lighthouse"],
    placeRelationNote:
      "จุดชมวิวนี้เป็นจุดที่มีอยู่ในข้อมูลเส้นทาง แต่ยังไม่มีข้อมูลยืนยันว่าเหมาะกับการชมพระอาทิตย์ขึ้น",
  },
  {
    id: "viewpoints",
    category: "ชมวิว",
    title: "ชมวิวรอบเกาะ",
    description: "แวะมองแนวชายฝั่งและทะเลจากจุดชมวิวที่มีอยู่ในเส้นทางบนเกาะ",
    audience: ["คนที่อยากชมวิวชายฝั่ง", "คนที่ชอบแวะชมธรรมชาติระหว่างทาง"],
    highlight: "เชื่อมกับจุดชมวิวถ้ำทะลุและหาดถ้ำพัง",
    duration: "ยังไม่มีข้อมูลยืนยัน",
    bestTime: "ช่วงกลางวัน · ตรวจสอบสภาพอากาศ",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    preparation: "รองเท้าที่เดินสะดวก น้ำดื่ม และระมัดระวังบริเวณหน้าผา",
    image: "hero",
    imageAlt: "ชายฝั่งและสะพานริมทะเลเกาะสีชัง",
    placeIds: ["phra-chudadhuj", "sea-split-viewpoint", "tham-thalu"],
  },
  {
    id: "sunset",
    category: "ชมวิว",
    title: "ชมพระอาทิตย์ตก",
    description: "ปิดท้ายวันด้วยสีของท้องฟ้าและช่วงเวลาสบาย ๆ ริมทะเล",
    audience: ["คนที่อยากปิดท้ายวันริมทะเล", "คนที่ชอบบรรยากาศช่วงเย็น"],
    highlight: "ข้อมูลหน่วยงานท่องเที่ยวระบุจุดชมพระอาทิตย์ตกบริเวณแหลมจักรพงษ์และหาดถ้ำพัง",
    duration: "ยังไม่มีข้อมูลยืนยัน",
    bestTime: "ช่วงเย็น · เวลาที่แน่นอนรอยืนยัน",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    preparation: "สอบถามคนในพื้นที่เรื่องจุดชมและทางกลับก่อนค่ำ",
    image: "chongkaokard",
    imageAlt: "ภาพชายฝั่งเกาะสีชัง ใช้ประกอบกิจกรรมชมพระอาทิตย์ตก",
    placeIds: ["chong-khao-khat", "tham-thalu"],
    sources: [
      {
        label: "สำนักงานการท่องเที่ยวและกีฬาจังหวัดชลบุรี (เผยแพร่ปี 2562)",
        url: "https://chonburi.mots.go.th/news/419",
      },
    ],
  },
  {
    id: "worship",
    category: "วัฒนธรรม",
    title: "ไหว้พระและขอพร",
    description: "ทำความรู้จักสถานที่ศักดิ์สิทธิ์และเรื่องราวความเชื่อบนเกาะอย่างเคารพ",
    audience: ["คนที่สนใจสถานที่ศักดิ์สิทธิ์และเรื่องราวความเชื่อ", "ผู้ที่พร้อมแต่งกายสุภาพ"],
    highlight: "ศาลเจ้าพ่อเขาใหญ่ · รอยพระพุทธบาท",
    duration: "ยังไม่มีข้อมูลยืนยัน",
    bestTime: "ยังไม่มีข้อมูลยืนยัน",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    preparation: "แต่งกายสุภาพและปฏิบัติตามข้อแนะนำของสถานที่",
    image: "sanjaoporky",
    imageAlt: "ภาพบรรยากาศเกาะสีชังประกอบกิจกรรมวัฒนธรรม",
    placeIds: [
      "khao-yai-shrine",
      "guanyin-shrine",
      "buddha-footprint",
    ],
  },
  {
    id: "beach-kayak",
    category: "กิจกรรมกลางแจ้ง",
    title: "เล่นน้ำและพายคายัค",
    description: "พักผ่อนริมทะเลหรือออกพายชมชายฝั่ง หากมีบริการและสภาพทะเลเอื้ออำนวย",
    audience: ["คนที่อยากพักผ่อนริมทะเล", "คนที่อยากพายคายัคเมื่อสภาพทะเลเอื้ออำนวย"],
    highlight: "หาดถ้ำพังเป็นหาดเล่นน้ำ และมีการระบุบริการคายัคในข้อมูลภาครัฐที่เผยแพร่ปี 2562",
    duration: "ยังไม่มีข้อมูลยืนยัน",
    bestTime: "ขึ้นกับคลื่น ลม และประกาศความปลอดภัย",
    cost: "การเข้าชม: แหล่งข้อมูลปี 2562 ระบุว่าไม่เสียค่าเข้า · สถานะปัจจุบันรอยืนยัน",
    preparation: "สอบถามบริการคายัค เสื้อชูชีพ ธงเตือน และสภาพทะเลก่อนลงน้ำ",
    image: "aoussadang",
    imageAlt: "ชายฝั่งเกาะสีชังประกอบกิจกรรมทะเล",
    placeIds: ["tham-phang-beach"],
    placeRelationNote:
      "แหล่งข้อมูลกระทรวงฯ ปี 2562 ระบุบริการคายัคที่หาดถ้ำพัง แต่ยังไม่ยืนยันว่ามีผู้ให้บริการปัจจุบัน",
    sources: [
      {
        label: "สำนักงานการท่องเที่ยวและกีฬาจังหวัดชลบุรี (เผยแพร่ปี 2562)",
        url: "https://chonburi.mots.go.th/news/419",
      },
    ],
  },
  {
    id: "food-cafes",
    category: "ของอร่อย",
    title: "ตะลุยกินและคาเฟ่",
    description: "แวะเติมพลังและสนับสนุนร้านท้องถิ่นระหว่างทำความรู้จักชุมชน",
    audience: ["คนที่อยากทำความรู้จักร้านท้องถิ่น", "คนที่ชอบแวะพักระหว่างเที่ยว"],
    highlight: "ชื่อร้าน เมนู และคาเฟ่ยังรอยืนยันจากผู้ประกอบการ",
    duration: "ตามแผนและเวลาของร้าน",
    bestTime: "ตรวจสอบวันและเวลาบริการกับร้านโดยตรง",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    preparation: "สอบถามข้อมูลร้านและการเดินทางก่อนแวะ",
    image: "islandish",
    imageAlt: "บรรยากาศเกาะสีชังประกอบกิจกรรมชิมอาหาร",
    placeIds: ["islandish-cafe","phra-chudadhuj", "ko-sichang-fresh-market"],
  },
  {
    id: "snorkeling",
    category: "ธรรมชาติ",
    title: "ดำน้ำชมโลกใต้น้ำ",
    description: "สำรวจทะเลอย่างรับผิดชอบ โดยเลือกพื้นที่และผู้ดูแลที่เหมาะสมกับสภาพจริง",
    audience: ["คนที่สนใจโลกใต้น้ำ", "ผู้ที่พร้อมตรวจสภาพทะเลและผู้ดูแลก่อนลงน้ำ"],
    highlight: "",
    duration: "ยังไม่มีข้อมูลยืนยัน",
    bestTime: "ขึ้นกับฤดูกาล คลื่นลม และการอนุญาต",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    preparation: "ตรวจสอบมาตรฐานอุปกรณ์ ผู้ดูแล สภาพอากาศ และข้อกำหนดพื้นที่ก่อนลงน้ำ",
    image: "swim",
    imageAlt: "ทะเลเกาะสีชังประกอบกิจกรรมดำน้ำ",
    placeIds: ["tham-phang-beach", "koh-kham-yai"],
    placeRelationNote:
      "หาดถ้ำพังถูกระบุในแหล่งข้อมูลภาครัฐว่ามีบริการดำน้ำดูปะการังเมื่อปี 2562 แต่ยังไม่ยืนยันผู้ให้บริการปัจจุบัน",
    sources: [
      {
        label: "สำนักงานการท่องเที่ยวและกีฬาจังหวัดชลบุรี (เผยแพร่ปี 2562)",
        url: "https://chonburi.mots.go.th/news/419",
      },
    ],
  },
  {
    id: "batik-workshop",
    category: "วัฒนธรรม",
    title: "Workshop",
    description:
      "เวิร์กช็อปลงมือทำผ้าบาติกเย็บมือกับชมรมส่งเสริมการท่องเที่ยวโดยชุมชนเกาะสีชัง ออกแบบลายและเรียนรู้กระบวนการทำงานฝีมือ",
    audience: ["คนที่อยากลงมือทำงานผ้าบาติก", "คนที่สนใจงานฝีมือและกิจกรรมชุมชน"],
    highlight: "Workshop ผ้าบาติกเย็บมือ",
    duration: "60 นาที ",
    bestTime: "จันทร์–ศุกร์ 09:00–18:00 น. ตามรายการ CBT Thailand · กรุณาติดต่อยืนยันรอบ",
    cost: "300 บาท/คน ตามรายการ CBT Thailand · กรุณายืนยันราคาและวัสดุที่รวม",
    preparation: "สอบถามรอบ จำนวนผู้เข้าร่วม และชิ้นงานที่จะได้รับจากผู้จัดก่อนเดินทาง",
    image: "workshop",
    imageAlt: "บรรยากาศเกาะสีชังประกอบแนวคิด Workshop ผ้าบาติก",
    placeIds: ["community-batik-workshop"],
    placeRelationNote:
      "อพท. ระบุที่อยู่ระดับตำบลท่าเทววงษ์",
    provider: "ชมรมส่งเสริมการท่องเที่ยวโดยชุมชนเกาะสีชัง",
    sources: [
      {
        label: "CBT Thailand โดย อพท.: กิจกรรมเรียนรู้การทำผ้าบาติกเย็บมือ",
        url: "https://cbtthailand.dasta.or.th/webapp/attraction/content/43/",
      },
    ],
    workshop: true,
  },
  {
    id: "crab-bank",
    category: "ธรรมชาติ",
    title: "รู้จักธนาคารปู",
    description: "เรียนรู้แนวคิดการอนุบาลแม่ปูไข่นอกกระดองและบทบาทของชุมชนในการดูแลทรัพยากรทะเล",
    audience: ["คนที่สนใจการอนุรักษ์ทรัพยากรทะเล", "คนที่อยากเรียนรู้บทบาทของชุมชน"],
    highlight: "จุฬาฯ ยืนยันการมีศูนย์เรียนรู้ธนาคารปูม้าบนบกที่อำเภอเกาะสีชัง",
    duration: "ยังไม่มีข้อมูลยืนยัน",
    bestTime: "ขึ้นกับชุมชนและรอบนัดหมาย",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    preparation: "ติดต่อชุมชนผู้ดูแลก่อนเยี่ยมชม เคารพพื้นที่และลดขยะ",
    image: "pumabank",
    imageAlt: "ทะเลเกาะสีชังประกอบเนื้อหาเรียนรู้ธนาคารปู",
    placeIds: ["crab-bank-learning-center"],
    placeRelationNote:
      "ยังไม่มีพิกัด GPS เวลาเปิด หรือข้อมูลยืนยันการเข้าชม จึงต้องสอบถามผู้ดูแลก่อนเพิ่มเป็นจุดแวะ",
    sources: [
      {
        label: "จุฬาลงกรณ์มหาวิทยาลัย: ธนาคารปูม้าเกาะสีชัง",
        url: "https://sustainability.chula.ac.th/th/report/3033/",
      },
    ],
  },
];

export type NightActivity = {
  id: string;
  title: string;
  description: string;
  highlight: string;
  duration: string;
  cost: string;
  service: string;
  image: TravelImage;
  imageAlt: string;
  placeIds: IslandPlaceId[];
  placeRelationNote?: string;
};

export const nightActivities: NightActivity[] = [
  {
    id: "night-squid",
    title: "ออกเรือตกหมึกยามค่ำคืน",
    description: "กิจกรรมที่ชาวบ้านบนเกาะแนะนำเป็นพิเศษ สัมผัสบรรยากาศทะเลยามค่ำอย่างรับผิดชอบ",
    highlight: "ตรวจสอบรอบเรือ สภาพอากาศ และเงื่อนไขผู้ให้บริการก่อนนัดหมาย",
    duration: "ยังไม่มีข้อมูลยืนยัน",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    service: "รอบและวันให้บริการยังไม่มีข้อมูลยืนยัน",
    image: "squid",
    imageAlt: "ทะเลเกาะสีชังประกอบกิจกรรมตกหมึกยามค่ำ",
    placeIds: ["laem-Ngoo-Harbour"],
  },
  {
    id: "night-coast",
    title: "ชมแสงไฟและบรรยากาศริมทะเล",
    description:
      "เดินเล่นรับลมและชมบรรยากาศยามเย็น โดยเลือกพื้นที่ที่เปิดให้เข้าถึงได้อย่างเหมาะสม",
    highlight: "จุดชมและการเข้าถึงช่วงค่ำยังรอยืนยัน",
    duration: "ยังไม่มีข้อมูลยืนยัน",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    service: "วันและช่วงเวลาให้บริการยังไม่มีข้อมูลยืนยัน",
    image: "prapakarnnight",
    imageAlt: "ภาพชายฝั่งเกาะสีชังประกอบบรรยากาศยามค่ำ",
    placeIds: ["ko-sichang-lighthouse", "tham-phang-beach"],
    placeRelationNote:
      "จุดที่เอกสารแนบกล่าวถึงสำหรับชมแสงไฟยามค่ำ · การเข้าถึงและเวลาใช้งานช่วงค่ำควรตรวจสอบก่อน",
  },
  {
    id: "night-dinner",
    title: "ดินเนอร์อาหารทะเลริมทะเล",
    description: "มื้อเย็นสบาย ๆ กับอาหารทะเลและบรรยากาศริมฝั่ง เมื่อยืนยันร้านและเวลาเปิดแล้ว",
    highlight: "ชื่อร้านและเมนูยังไม่มีข้อมูลยืนยัน",
    duration: "ตามเวลาของร้าน",
    cost: "ยังไม่มีข้อมูลยืนยัน",
    service: "วันและเวลาเปิดบริการยังไม่มีข้อมูลยืนยัน",
    image: "dinner",
    imageAlt: "บรรยากาศเกาะสีชังประกอบไอเดียดินเนอร์ริมทะเล",
    placeIds: ["chao-ban-chao-le-restaurant"],
  },
];
