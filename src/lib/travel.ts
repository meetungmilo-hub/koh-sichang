export const packages = [
  { id: 'short', name: 'เที่ยวรอบสั้น', subtitle: 'แวะชมเกาะ แล้วค่อย ๆ รู้จักสีชัง', duration: 'ทริปภายในวัน', image: 'coast', highlights: ['ชมบรรยากาศริมทะเล', 'แวะเส้นทางชุมชน', 'เดินทางกับคนขับ Skylab'], includes: ['รถ Skylab ตามเส้นทางที่ตกลง', 'คนขับในชุมชน'], note: 'ระยะเวลาและสถานที่แวะ รอยืนยันกับคนขับ' },
  { id: 'overnight', name: 'พัก 2 วัน 1 คืน', subtitle: 'มีเวลาให้ทะเล และเรื่องราวระหว่างทาง', duration: '2 วัน 1 คืน', image: 'hero', highlights: ['พักผ่อนบนเกาะหนึ่งคืน', 'มื้ออาหารจากร้านในชุมชน', 'สัมผัสเกาะในจังหวะที่ช้าลง'], includes: ['ทริป Skylab ตามที่ตกลง', 'ที่พักและอาหาร รอยืนยันรายละเอียด'], note: 'ที่พัก อาหาร และกิจกรรมเป็นแนวทางตัวอย่าง ยังไม่ยืนยันผู้ให้บริการ' },
] as const;
export const sampleStops = [
 { name: 'จุดชมวิวริมทะเล', text: 'หยุดพัก รับลม และชมบรรยากาศของเกาะ', story: 'พื้นที่สำหรับเพิ่มเรื่องราวของจุดชมวิว หลังตรวจสอบข้อมูลกับชุมชน' },
 { name: 'ย่านชุมชนบนเกาะ', text: 'แวะรู้จักร้านเล็ก ๆ และผู้คนระหว่างทาง', story: 'พื้นที่สำหรับเพิ่มเรื่องเล่าวิถีชีวิตจากคนในชุมชน โดยได้รับความยินยอม' },
 { name: 'ร้านอาหารท้องถิ่น', text: 'เผื่อเวลาให้มื้ออาหาร และการพักผ่อน', story: 'ชื่อร้าน เมนู และเวลาบริการ รอยืนยันจากผู้ประกอบการ' },
];
export function pageHead(title: string, description: string) { return { meta: [{ title: `${title} — เที่ยวสีชัง` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — เที่ยวสีชัง` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }
export type BookingSearch = { package?: string | undefined; date?: string | undefined; time?: string | undefined; travelers?: number | undefined; pickup?: string | undefined; places?: string | undefined };
export function bookingSearch(search: Record<string, unknown>): BookingSearch { return { package: typeof search['package'] === 'string' ? search['package'] : undefined, date: typeof search['date'] === 'string' ? search['date'] : undefined, time: typeof search['time'] === 'string' ? search['time'] : undefined, travelers: Number(search['travelers']) > 0 ? Number(search['travelers']) : undefined, pickup: typeof search['pickup'] === 'string' ? search['pickup'] : undefined, places: typeof search['places'] === 'string' ? search['places'] : undefined }; }
