import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { BadgeCheck, Bell, Check, Clock3, Save, Settings2, UserRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { islandPlaces } from '@/lib/island-places';
import { emptyDriverProfile, readDriverBookings, readDriverProfile, saveDriverProfile, updateDriverBooking, type DriverBooking, type DriverProfile, type DriverBookingStatus } from '@/lib/driver-demo';
import { packages, pageHead } from '@/lib/travel';

export const Route = createFileRoute('/driver')({
  head: () => pageHead('สำหรับคนขับ Skylab', 'จัดการโปรไฟล์ ราคา เวลาพร้อมรับงาน และคำขอจอง Skylab ตัวอย่าง'),
  component: DriverPage,
});

const sampleTimes = ['09:00', '13:00', '16:00'];

function DriverPage() {
  const [profile, setProfile] = useState<DriverProfile>(emptyDriverProfile);
  const [bookings, setBookings] = useState<DriverBooking[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(readDriverProfile());
    setBookings(readDriverBookings());
  }, []);

  function updateProfile<K extends keyof DriverProfile>(key: K, value: DriverProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function toggleTime(time: string) {
    const next = profile.availableTimes.includes(time)
      ? profile.availableTimes.filter((item) => item !== time)
      : [...profile.availableTimes, time];
    updateProfile('availableTimes', next);
  }

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveDriverProfile(profile);
    setSaved(true);
  }

  function changeStatus(id: string, status: DriverBookingStatus) {
    setBookings(updateDriverBooking(id, status));
  }

  const inbox = bookings.filter((booking) => booking.status === 'pending' || booking.status === 'accepted');
  const history = bookings.filter((booking) => booking.status === 'declined' || booking.status === 'completed');

  return (
    <main className="container-site pb-20">
      <div className="page-intro">
        <p className="eyebrow text-muted-foreground">SKYLAB PARTNER · DEMO</p>
        <h1 className="section-title mt-3">พื้นที่คนขับ</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">จัดการข้อมูลบริการและทดลองดูคำขอทริปจากฝั่งนักท่องเที่ยว</p>
      </div>

      <div className="mb-10 flex gap-3 rounded-lg border border-primary/20 bg-secondary p-4 text-sm">
        <InfoIcon />
        <div><p className="font-medium">ต้นแบบสำหรับทดลอง · ข้อมูลอยู่ในเบราว์เซอร์นี้</p><p className="mt-1 text-muted-foreground">ยังไม่มีบัญชีคนขับหรือระบบออนไลน์ ข้อมูลจะไม่ส่งไปยังคนขับคนอื่น และไม่ควรกรอกข้อมูลส่วนตัวจริง</p></div>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-border p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"><UserRound className="size-5" /></span><div><h2 className="text-xl font-medium">โปรไฟล์และบริการ</h2><p className="text-sm text-muted-foreground">ข้อมูลตัวอย่างสำหรับหน้าคนขับ</p></div></div>
          <form onSubmit={submitProfile} className="space-y-5">
            <label className="block text-sm">ชื่อที่แสดง
              <input className="field mt-2" value={profile.displayName} onChange={(event) => updateProfile('displayName', event.target.value)} placeholder="เช่น พี่สมชาย · ตัวอย่าง" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">ประสบการณ์ (ปี)
                <input className="field mt-2" type="number" min="0" value={profile.experienceYears} onChange={(event) => updateProfile('experienceYears', event.target.value)} placeholder="เช่น 5" />
              </label>
              <label className="text-sm">จำนวนที่นั่ง
                <input className="field mt-2" type="number" min="1" value={profile.seats} onChange={(event) => updateProfile('seats', event.target.value)} placeholder="ระบุจำนวน" />
              </label>
            </div>
            <label className="block text-sm">ประเภทรถ
              <input className="field mt-2" value={profile.vehicle} onChange={(event) => updateProfile('vehicle', event.target.value)} placeholder="เช่น Skylab" />
            </label>
            <div>
              <p className="text-sm font-medium">ราคาเสนอ (บาท/ทริป)</p>
              <p className="mt-1 text-xs text-muted-foreground">ใช้ประกอบต้นแบบเท่านั้น ยังไม่ประกาศหรือยืนยันเป็นราคากลาง</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="text-sm">เที่ยวรอบสั้น<input className="field mt-2" type="number" min="0" value={profile.shortPrice} onChange={(event) => updateProfile('shortPrice', event.target.value)} placeholder="ยังไม่ระบุ" /></label>
                <label className="text-sm">พัก 2 วัน 1 คืน<input className="field mt-2" type="number" min="0" value={profile.overnightPrice} onChange={(event) => updateProfile('overnightPrice', event.target.value)} placeholder="ยังไม่ระบุ" /></label>
              </div>
            </div>
            <div className="rounded-md bg-muted/50 p-4">
              <label className="flex cursor-pointer items-center justify-between gap-4 text-sm"><span><span className="block font-medium">พร้อมรับคำขอ</span><span className="text-xs text-muted-foreground">ตั้งสถานะพร้อมให้เห็นในโปรไฟล์ต้นแบบ</span></span><input type="checkbox" className="size-5 accent-primary" checked={profile.available} onChange={(event) => updateProfile('available', event.target.checked)} /></label>
              <fieldset className="mt-4">
                <legend className="flex items-center gap-2 text-sm"><Clock3 className="size-4" />รอบเวลาที่สะดวก <span className="text-xs text-muted-foreground">(ตัวอย่าง)</span></legend>
                <div className="mt-3 flex flex-wrap gap-2">{sampleTimes.map((time) => <label key={time} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${profile.availableTimes.includes(time) ? 'border-primary bg-secondary text-primary' : 'border-border'}`}><input type="checkbox" className="sr-only" checked={profile.availableTimes.includes(time)} onChange={() => toggleTime(time)} />{time} น.</label>)}</div>
              </fieldset>
            </div>
            <div className="flex flex-wrap items-center gap-3"><Button type="submit" className="h-11"><Save className="size-4" />บันทึกโปรไฟล์</Button>{saved && <span role="status" className="flex items-center gap-1 text-sm text-primary"><Check className="size-4" />บันทึกในเบราว์เซอร์นี้แล้ว</span>}</div>
          </form>
        </section>

        <div className="space-y-10">
          <section>
            <div className="mb-5 flex items-center justify-between gap-3"><div><p className="eyebrow text-muted-foreground">BOOKING INBOX</p><h2 className="mt-2 text-2xl font-medium">คำขอทริป <span className="text-base text-muted-foreground">{inbox.length}</span></h2></div><Bell className="size-5 text-primary" /></div>
            {inbox.length ? <div className="space-y-4">{inbox.map((booking) => <BookingCard key={booking.id} booking={booking} onStatus={changeStatus} />)}</div> : <div className="rounded-lg border border-dashed border-border p-7 text-center"><p className="font-medium">ยังไม่มีคำขอในกล่องนี้</p><p className="mt-2 text-sm text-muted-foreground">เปิดหน้าจองในเบราว์เซอร์เดียวกันและส่งคำขอตัวอย่าง เพื่อทดลองฝั่งคนขับ</p></div>}
          </section>

          <section>
            <div className="mb-5 flex items-center gap-3"><Settings2 className="size-5 text-primary" /><div><p className="eyebrow text-muted-foreground">TRIP HISTORY</p><h2 className="mt-2 text-2xl font-medium">ประวัติงาน</h2></div></div>
            {history.length ? <div className="space-y-3">{history.map((booking) => <BookingCard key={booking.id} booking={booking} onStatus={changeStatus} compact />)}</div> : <p className="rounded-lg bg-muted/40 p-5 text-sm text-muted-foreground">งานที่ปฏิเสธหรือทำเสร็จแล้วจะแสดงที่นี่</p>}
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoIcon() { return <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />; }

function BookingCard({ booking, onStatus, compact = false }: { booking: DriverBooking; onStatus: (id: string, status: DriverBookingStatus) => void; compact?: boolean }) {
  const pkg = packages.find((item) => item.id === booking.packageId);
  const statusText = { pending: 'รอตอบรับ', accepted: 'รับงานแล้ว', declined: 'ปฏิเสธ', completed: 'เสร็จสิ้น' }[booking.status];
  const placeNames = booking.places.map((id) => islandPlaces.find((place) => place.id === id)?.name).filter(Boolean);
  const dateLabel = new Date(`${booking.date}T12:00:00`).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <article className="rounded-lg border border-border p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-medium">{pkg?.name ?? 'ทริป Skylab'}</h3><p className="mt-1 text-sm text-muted-foreground">{dateLabel} · {booking.time} น. · {booking.travelers} คน</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs text-primary">{statusText}</span></div>
      <dl className="mt-4 grid gap-2 border-t border-border pt-4 text-sm sm:grid-cols-[100px_1fr]"><dt className="text-muted-foreground">จุดรับ</dt><dd>{booking.pickup}</dd><dt className="text-muted-foreground">จุดแวะ</dt><dd>{placeNames.length ? placeNames.join(' · ') : 'ไม่ได้เลือก'}</dd></dl>
      {!compact && <div className="mt-5 flex flex-wrap gap-2">{booking.status === 'pending' && <><Button size="sm" className="h-9" onClick={() => onStatus(booking.id, 'accepted')}><Check className="size-4" />รับคำขอ</Button><Button size="sm" variant="outline" className="h-9" onClick={() => onStatus(booking.id, 'declined')}><X className="size-4" />ปฏิเสธ</Button></>}{booking.status === 'accepted' && <Button size="sm" className="h-9" onClick={() => onStatus(booking.id, 'completed')}><Check className="size-4" />ทำเครื่องหมายว่าเสร็จแล้ว</Button>}</div>}
    </article>
  );
}
