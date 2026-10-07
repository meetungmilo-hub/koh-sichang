import { createFileRoute, Link } from '@tanstack/react-router';
import { Check, ArrowRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead, bookingSearch, packages } from '@/lib/travel';
import { islandPlaces, parseIslandPlaceIds } from '@/lib/island-places';

export const Route = createFileRoute('/booking-summary')({
  validateSearch: bookingSearch,
  head: () => pageHead('สรุปคำขอจองตัวอย่าง', 'ตรวจสอบรายละเอียดคำขอทริป Skylab ตัวอย่าง ไม่มีการจองหรือชำระเงินจริง'),
  component: SummaryPage,
});

function SummaryPage() {
  const search = Route.useSearch();
  const pkg = packages.find((item) => item.id === search.package);
  const valid = !!pkg && !!search.date && !!search.time && !!search.travelers && !!search.pickup;
  const selectedPlaces = parseIslandPlaceIds(search.places).map((id) => islandPlaces.find((place) => place.id === id)?.name).filter(Boolean);
  const summaryRows = [
    ['แพ็กเกจ', pkg?.name ?? '—'],
    ['วันที่เดินทาง', search.date ? new Date(`${search.date}T12:00:00`).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
    ['รอบนัดหมาย (ตัวอย่าง)', `${search.time} น.`],
    ['จำนวนผู้เดินทาง', `${search.travelers} คน`],
    ['จุดรับ (ตัวอย่าง)', search.pickup],
    ['จุดแวะที่เลือก', selectedPlaces.length ? selectedPlaces.join('、') : 'ยังไม่ได้เลือก'],
    ['ราคาที่ตกลงกับคนขับ', 'สอบถามราคา · ยังไม่ตกลง'],
  ];

  return (
    <main className="container-site max-w-2xl py-16">
      <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-secondary text-primary"><Check className="size-7" /></div>
      <p className="eyebrow text-muted-foreground">YOUR NEXT SLOW DAY</p>
      <h1 className="section-title mt-3">{valid ? 'สรุปคำขอจองตัวอย่าง' : 'ยังไม่มีรายละเอียดคำขอ'}</h1>
      <p role="status" className="mt-3 text-muted-foreground">{valid ? 'จัดทำคำขอตัวอย่างแล้ว ยังไม่ใช่การยืนยันจองจริง' : 'เลือกแพ็กเกจและวันเดินทางก่อนดูสรุปคำขอ'}</p>
      {valid && (
        <dl className="my-8 border-y border-border py-4">
          {summaryRows.map(([key, value]) => (
            <div className="flex flex-wrap justify-between gap-3 py-3" key={key}>
              <dt className="text-sm text-muted-foreground">{key}</dt>
              <dd className="max-w-[70%] text-right text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="bg-secondary p-5 text-sm">
        <p>บันทึกคำขอตัวอย่างไว้ในเบราว์เซอร์นี้แล้ว แต่ยังไม่ถูกส่งให้คนขับจริง และไม่มีการชำระเงิน</p>
        <p className="mt-2 text-muted-foreground">ทดลองดูคำขอในมุมคนขับได้จากเมนู “สำหรับคนขับ” บนอุปกรณ์และเบราว์เซอร์เดียวกัน รอบเวลาและจุดรับเป็นตัวอย่าง เวลารับเป็นเวลานัดหมาย ต้องตกลงราคา เส้นทาง และรายละเอียดกับผู้ให้บริการก่อนจองจริง</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="h-12"><Link to="/booking" search={search}><Pencil /> {valid ? 'แก้ไขคำขอ' : 'เลือกทริป'}</Link></Button>
        <Button variant="outline" asChild className="h-12"><Link to="/driver">ดูฝั่งคนขับ (ต้นแบบ)</Link></Button>
        <Button variant="outline" asChild className="h-12"><Link to="/">กลับหน้าแรก <ArrowRight /></Link></Button>
      </div>
    </main>
  );
}
