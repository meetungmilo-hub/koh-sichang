import { Check, ExternalLink, MapPin } from 'lucide-react';
import { islandPlaces, type IslandPlaceId } from '@/lib/island-places';

type IslandMapSelectorProps = {
  selectedIds: IslandPlaceId[];
  onToggle: (placeId: IslandPlaceId) => void;
};

export function IslandMapSelector({ selectedIds, onToggle }: IslandMapSelectorProps) {
  return (
    <section aria-labelledby="island-map-title" className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">PLAN YOUR STOPS</p>
          <h2 id="island-map-title" className="mt-2 text-xl font-medium">เลือกสถานที่บนแผนที่</h2>
          <p className="mt-1 text-sm text-muted-foreground">แตะหมุดหรือรายการด้านล่างเพื่อเพิ่มจุดแวะในทริป</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground" aria-live="polite">
          เลือกแล้ว {selectedIds.length} / {islandPlaces.length} จุด
        </span>
      </div>

      <div className="island-map mt-5" role="group" aria-label="แผนที่แนะนำสถานที่ท่องเที่ยวเกาะสีชัง">
        <svg className="island-map-art" viewBox="0 0 700 430" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <pattern id="island-map-waves" width="92" height="42" patternUnits="userSpaceOnUse">
              <path d="M0 15c11-7 22-7 33 0s22 7 33 0 18-7 26-2M-24 34c11-7 22-7 33 0s22 7 33 0 22-7 33 0 18 7 26 2" fill="none" stroke="#80aeb0" strokeOpacity=".2" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="700" height="430" fill="#dcebea" />
          <rect width="700" height="430" fill="url(#island-map-waves)" />
          <g transform="translate(-20, -10) scale(1.00)">
          <path d="M374 35c-35 2-60 24-62 53-2 22 12 35 5 55-8 22-38 31-39 59-1 24 21 36 12 60-8 23-39 32-39 60 0 28 25 39 28 64 3 25 25 44 53 40 28-4 39-25 62-33 24-8 49-2 63-22 13-18 3-38 15-58 12-21 39-30 38-56-1-23-23-34-19-56 4-24 32-43 21-66-10-22-38-21-51-42-14-22-4-51-25-66-17-12-40 8-62 8Z" fill="#e8dfca" stroke="#aebda8" strokeWidth="3" />
          <path d="M365 58c-14 44 28 58 4 100s27 51-4 91 20 47-12 91 20 35 2 61" fill="none" stroke="#bdad8d" strokeWidth="3" strokeDasharray="7 8" strokeLinecap="round" />
          <path d="M334 143c28 3 51 17 61 38M315 258c29-5 52-1 74 17" fill="none" stroke="#a2b79f" strokeWidth="2" strokeLinecap="round" />
          </g>
          <text x="380" y="222" textAnchor="middle" fill="#718b80" fontSize="15" fontFamily="sans-serif" letterSpacing="3">KOH SI CHANG</text>
          <text x="380" y="244" textAnchor="middle" fill="#87998d" fontSize="10" fontFamily="sans-serif" letterSpacing="2">CHONBURI · THAILAND</text>
          <g transform="translate(640 42)" fill="#55766e" fontFamily="sans-serif" textAnchor="middle">
            <text y="0" fontSize="10" fontWeight="700">N</text><path d="M0 8l-5 15 5-3 5 3z" />
          </g>
          <text x="18" y="408" fill="#66817c" fontSize="10" fontFamily="sans-serif" letterSpacing="1">GULF OF THAILAND</text>
        </svg>

        {islandPlaces.map((place, index) => {
          const selected = selectedIds.includes(place.id);
          return (
            <button
              type="button"
              key={place.id}
              className={`island-map-pin ${selected ? 'island-map-pin-selected' : ''}`}
              style={{ top: place.position.top, left: place.position.left }}
              onClick={() => onToggle(place.id)}
              aria-pressed={selected}
              aria-label={`${selected ? 'นำออกจากทริป' : 'เพิ่มในทริป'}: ${place.name}`}
              title={`${selected ? 'นำออกจากทริป' : 'เพิ่มในทริป'}: ${place.name}`}
            >
              <span>{selected ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}</span>
              <span className="island-map-pin-label">{place.shortName}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">หมุดเป็นตำแหน่งโดยประมาณเพื่อช่วยวางแผน ไม่ใช่แผนที่นำทาง · ตรวจสอบจุดแวะและเวลาเดินทางกับคนขับอีกครั้ง</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {islandPlaces.map((place, index) => {
          const selected = selectedIds.includes(place.id);
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} เกาะสีชัง`)}`;
          return (
            <div key={place.id} className={`flex items-start gap-3 rounded-md border p-3 transition-colors ${selected ? 'border-primary/50 bg-secondary/60' : 'border-border'}`}>
              <button type="button" onClick={() => onToggle(place.id)} aria-pressed={selected} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{selected ? <Check className="size-3.5"/> : index + 1}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{place.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{place.area}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{place.description}</span>
                </span>
              </button>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-1 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-primary" aria-label={`เปิด ${place.name} ใน Google Maps`} title="เปิดใน Google Maps">
                <ExternalLink className="size-4" />
              </a>
            </div>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="size-3.5 shrink-0"/>จุดที่เลือกจะถูกแนบไปกับคำขอจอง เพื่อใช้คุยรายละเอียดเส้นทางกับคนขับ</p>
    </section>
  );
}
