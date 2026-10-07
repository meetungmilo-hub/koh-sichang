import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, type FormEvent } from 'react';
import { ArrowRight, Check, Info, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IslandMapSelector } from '@/components/travel/island-map-selector';
import { islandPlaces, parseIslandPlaceIds, type IslandPlaceId } from '@/lib/island-places';
import { packages, pageHead, bookingSearch } from '@/lib/travel';
import { travelImages } from '@/lib/travel-images';
import { saveDriverBooking } from '@/lib/driver-demo';

export const Route = createFileRoute('/booking')({
  validateSearch: bookingSearch,
  head: () => ({ meta: [...pageHead('จอง Skylab', 'เลือกแพ็กเกจ จุดแวะ วันที่ และรอบนัดหมาย สำหรับคำขอจอง Skylab ตัวอย่าง').meta] }),
  component: BookingPage,
});

function BookingPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(search.package === 'overnight' ? 'overnight' : 'short');
  const [selectedPlaces, setSelectedPlaces] = useState<IslandPlaceId[]>(() => parseIslandPlaceIds(search.places));
  const [date, setDate] = useState(search.date || '');
  const [time, setTime] = useState(search.time || '');
  const [travelers, setTravelers] = useState(search.travelers || 2);
  const [pickup, setPickup] = useState(search.pickup || '');
  const [minDate, setMinDate] = useState('');
  const pkg = packages.find((item) => item.id === selected) || packages[0];

  useEffect(() => {
    const today = new Date();
    setMinDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  }, []);

  function togglePlace(placeId: IslandPlaceId) {
    setSelectedPlaces((current) => current.includes(placeId)
      ? current.filter((id) => id !== placeId)
      : [...current, placeId]);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveDriverBooking({ packageId: selected, date, time, travelers, pickup, places: selectedPlaces });
    navigate({
      to: '/booking-summary',
      search: { package: selected, date, time, travelers, pickup, places: selectedPlaces.join(',') || undefined },
    });
  }

  return (
    <main className="container-site pb-20">
      <div className="page-intro">
        <p className="eyebrow text-muted-foreground">LET THE ISLAND COME TO YOU</p>
        <h1 className="section-title mt-3">จอง Skylab</h1>
        <p className="mt-3 text-muted-foreground">เลือกแพ็กเกจ จุดแวะ และเวลานัดหมายของคุณ</p>
      </div>

      <div className="mb-8 flex items-center gap-3 text-sm">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">1</span>
        <span>เลือกทริป</span><span className="h-px w-10 bg-border" />
        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground">2</span>
        <span className="text-muted-foreground">สรุปคำขอ</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={submit}>
          <fieldset>
            <legend className="mb-4 font-medium">แพ็กเกจที่ต้องการ</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {packages.map((item) => (
                <label key={item.id} className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 ${selected === item.id ? 'border-primary bg-secondary' : 'border-border bg-background'}`}>
                  <input type="radio" name="package" className="size-4 accent-primary" value={item.id} checked={selected === item.id} onChange={() => setSelected(item.id)} />
                  <span className="text-sm">{item.name}</span>
                  {selected === item.id && <Check className="ml-auto size-4 text-primary" />}
                </label>
              ))}
            </div>
            <p role="status" className="mt-3 text-xs text-primary">เลือกแล้ว: {pkg.name}</p>
          </fieldset>

          <div className="my-7">
            <IslandMapSelector selectedIds={selectedPlaces} onToggle={togglePlace} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm">วันที่เดินทาง
              <input required aria-label="วันที่เดินทาง" type="date" className="field mt-2" min={minDate} value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <label className="text-sm">รอบเวลา <span className="text-xs text-muted-foreground">(ตัวอย่าง)</span>
              <select required className="field mt-2" aria-label="รอบเวลา" value={time} onChange={(event) => setTime(event.target.value)}>
                <option value="">เลือกรอบนัดหมาย</option><option value="09:00">09:00 น. — ตัวอย่าง</option><option value="13:00">13:00 น. — ตัวอย่าง</option><option value="16:00">16:00 น. — ตัวอย่าง</option>
              </select>
            </label>
            <label className="text-sm">จำนวนผู้เดินทาง
              <input type="number" aria-label="จำนวนผู้เดินทาง" required min="1" max="20" className="field mt-2" value={travelers} onChange={(event) => setTravelers(Number(event.target.value))} />
              <span className="mt-1 block text-xs text-muted-foreground">จำนวนรถจะตกลงกับคนขับ</span>
            </label>
            <label className="text-sm">จุดรับ <span className="text-xs text-muted-foreground">(ตัวอย่าง)</span>
              <select required aria-label="จุดรับ" className="field mt-2" value={pickup} onChange={(event) => setPickup(event.target.value)}>
                <option value="">เลือกจุดรับ</option><option value="ท่าเรือบนเกาะ">ท่าเรือบนเกาะ — ตัวอย่าง</option><option value="ที่พักบนเกาะ">ที่พักบนเกาะ — ตัวอย่าง</option><option value="จุดนัดหมายในชุมชน">จุดนัดหมายในชุมชน — ตัวอย่าง</option>
              </select>
            </label>
          </div>

          <p className="mt-6 flex gap-2 text-sm text-muted-foreground"><Info className="mt-1 size-4 shrink-0" />เวลารับเป็นเวลานัดหมาย ต้องยืนยันกับคนขับอีกครั้ง</p>
          <div className="mt-8 border-t border-border pt-6">
            <Button type="submit" className="h-12 w-full sm:w-auto">ยืนยันคำขอจอง <ArrowRight /></Button>
            <p className="mt-3 text-xs text-muted-foreground">บันทึกคำขอไว้ในเบราว์เซอร์นี้เพื่อทดลองฝั่งคนขับ · ยังไม่ส่งให้คนขับจริง · ไม่มีการชำระเงิน</p>
          </div>
        </form>

        <aside className="self-start overflow-hidden rounded-lg border border-border">
          <img src={travelImages.skylab} className="aspect-[16/10] w-full object-cover" alt="รถ Skylab สามล้อบนเกาะสีชัง" />
          <div className="p-6">
            <p className="eyebrow text-muted-foreground">YOUR ISLAND TRIP</p>
            <h2 className="mt-3 text-xl font-medium">{pkg.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4" />{pkg.duration}</p>
            <div className="mt-5 border-t border-border pt-5">
              <p className="text-sm text-muted-foreground">จุดแวะที่เลือก</p>
              {selectedPlaces.length ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {selectedPlaces.map((id) => <li key={id}>{islandPlaces.find((place) => place.id === id)?.name}</li>)}
                </ul>
              ) : <p className="mt-2 text-sm text-muted-foreground">ยังไม่ได้เลือกจุดแวะ</p>}
            </div>
            <div className="mt-5 border-t border-border pt-5">
              <p className="text-sm text-muted-foreground">ราคาที่ตกลงร่วมกับคนขับ</p>
              <p className="mt-2 text-xl font-medium">สอบถามราคา</p>
              <p className="mt-2 text-xs text-muted-foreground">ยังไม่มีราคาที่ตกลง ต้องยืนยันก่อนจอง</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
