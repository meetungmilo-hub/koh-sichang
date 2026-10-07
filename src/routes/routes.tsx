import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IslandMapSelector } from '@/components/travel/island-map-selector';
import { type IslandPlaceId } from '@/lib/island-places';
import { pageHead } from '@/lib/travel';

export const Route = createFileRoute('/routes')({
  head: () => ({ meta: [...pageHead('เส้นทางและเรื่องราว', 'แผนที่แนะนำสถานที่ท่องเที่ยวบนเกาะสีชัง เลือกจุดแวะเพื่อวางแผนทริป Skylab').meta] }),
  component: RoutesPage,
});

function RoutesPage() {
  const [selectedPlaces, setSelectedPlaces] = useState<IslandPlaceId[]>([]);
  const placesQuery = selectedPlaces.join(',');

  function togglePlace(placeId: IslandPlaceId) {
    setSelectedPlaces((current) => current.includes(placeId)
      ? current.filter((id) => id !== placeId)
      : [...current, placeId]);
  }

  return (
    <main className="container-site pb-20">
      <div className="page-intro">
        <p className="eyebrow text-muted-foreground">ALONG THE ISLAND</p>
        <h1 className="section-title mt-3">รู้จักสีชังผ่านจุดแวะระหว่างทาง</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">เลือกสถานที่ที่สนใจไว้ก่อนได้ แล้วนำรายการไปคุยกับคนขับเพื่อจัดเส้นทางให้เหมาะกับเวลา</p>
      </div>
      <IslandMapSelector selectedIds={selectedPlaces} onToggle={togglePlace} />
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-sea p-5 sm:p-6">
        <div>
          <h2 className="font-medium">มีจุดที่อยากแวะแล้วหรือยัง?</h2>
          <p className="mt-1 text-sm text-muted-foreground">{selectedPlaces.length ? `เลือกไว้ ${selectedPlaces.length} จุด · เปลี่ยนแปลงได้ตอนจอง` : 'เลือกแพ็กเกจ แล้วเพิ่มหรือลดจุดแวะได้ในขั้นตอนจอง'}</p>
        </div>
        <Button asChild className="h-11">
          <Link to="/booking" search={{ places: placesQuery || undefined }}>วางแผนทริป <ArrowRight /></Link>
        </Button>
      </div>
    </main>
  );
}
