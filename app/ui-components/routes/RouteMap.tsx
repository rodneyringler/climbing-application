'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClimbGrades {
  yds?: string | null;
  vscale?: string | null;
  french?: string | null;
  ewbank?: string | null;
  font?: string | null;
  uiaa?: string | null;
  wi?: string | null;
  brazilianCrux?: string | null;
}

interface ClimbMedia {
  mediaUrl: string;
  width: number;
  height: number;
}

interface Pitch {
  id: string;
  pitchNumber: number;
  grades?: ClimbGrades | null;
  type?: ClimbType | null;
  length?: number | null;
  boltsCount?: number | null;
  description?: string | null;
}

interface ClimbMetadata {
  lat?: number | null;
  lng?: number | null;
  mp_id?: string | null;
}

interface ClimbType {
  trad?: boolean | null;
  sport?: boolean | null;
  bouldering?: boolean | null;
  alpine?: boolean | null;
  snow?: boolean | null;
  ice?: boolean | null;
  mixed?: boolean | null;
  aid?: boolean | null;
  tr?: boolean | null;
}

interface ClimbContent {
  description?: string | null;
  location?: string | null;
  protection?: string | null;
}

interface Climb {
  uuid: string;
  name: string;
  fa?: string | null;
  length?: number | null;
  boltsCount?: number | null;
  grades?: ClimbGrades | null;
  type?: ClimbType | null;
  safety?: string | null;
  content?: ClimbContent | null;
  pathTokens?: string[] | null;
  media?: ClimbMedia[] | null;
  pitches?: Pitch[] | null;
  metadata?: ClimbMetadata | null;
}

interface CragMetadata {
  lat: number;
  lng: number;
}

interface Crag {
  uuid: string;
  area_name: string;
  metadata: CragMetadata;
  totalClimbs: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getClimbTypes(type?: ClimbType | null): string {
  if (!type) return 'Unknown';
  const types: string[] = [];
  if (type.sport) types.push('Sport');
  if (type.trad) types.push('Trad');
  if (type.bouldering) types.push('Boulder');
  if (type.tr) types.push('Top Rope');
  if (type.alpine) types.push('Alpine');
  if (type.snow) types.push('Snow');
  if (type.ice) types.push('Ice');
  if (type.mixed) types.push('Mixed');
  if (type.aid) types.push('Aid');
  return types.join(', ') || 'Unknown';
}

function getGrade(grades?: ClimbGrades | null): string {
  if (!grades) return '–';
  return grades.yds || grades.vscale || grades.french || grades.ewbank || grades.font || grades.uiaa || grades.wi || '–';
}

function getAllGrades(grades?: ClimbGrades | null): Array<{ label: string; value: string }> {
  if (!grades) return [];
  const systems = [
    { label: 'YDS', value: grades.yds },
    { label: 'V-Scale', value: grades.vscale },
    { label: 'French', value: grades.french },
    { label: 'Ewbank', value: grades.ewbank },
    { label: 'Font', value: grades.font },
    { label: 'UIAA', value: grades.uiaa },
    { label: 'WI', value: grades.wi },
    { label: 'Brazilian', value: grades.brazilianCrux },
  ];
  return systems.filter((s): s is { label: string; value: string } => !!s.value);
}

const MEDIA_CDN = 'https://media.openbeta.io';
function getMediaUrl(mediaUrl: string): string {
  return mediaUrl.startsWith('http') ? mediaUrl : `${MEDIA_CDN}/${mediaUrl}`;
}

// ─── OpenBeta API ─────────────────────────────────────────────────────────────

const CRAGS_WITHIN_QUERY = `
  query CragsWithin($filter: SearchWithinFilter) {
    cragsWithin(filter: $filter) {
      uuid
      area_name
      totalClimbs
      metadata {
        lat
        lng
      }
    }
  }
`;

const AREA_CLIMBS_QUERY = `
  query Area($uuid: ID) {
    area(uuid: $uuid) {
      uuid
      area_name
      climbs {
        uuid
        name
        fa
        length
        boltsCount
        grades {
          yds
          vscale
          french
          ewbank
          font
          uiaa
          wi
          brazilianCrux
        }
        type {
          trad
          sport
          bouldering
          alpine
          snow
          ice
          mixed
          aid
          tr
        }
        safety
        content {
          description
          location
          protection
        }
        pathTokens
        media {
          mediaUrl
          width
          height
        }
        pitches {
          id
          pitchNumber
          grades {
            yds
            vscale
            french
            ewbank
          }
          type {
            trad
            sport
            bouldering
            alpine
            ice
            mixed
          }
          length
          boltsCount
          description
        }
        metadata {
          lat
          lng
          mp_id
        }
      }
    }
  }
`;

async function fetchCragsWithin(bbox: [number, number, number, number], zoom: number): Promise<Crag[]> {
  const res = await fetch('https://api.openbeta.io', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: CRAGS_WITHIN_QUERY,
      variables: { filter: { bbox, zoom } },
    }),
  });

  if (!res.ok) throw new Error(`OpenBeta API error: ${res.status}`);
  const data = await res.json();
  if (data.errors) throw new Error(data.errors[0]?.message ?? 'Unknown API error');

  const crags: Crag[] = data.data?.cragsWithin ?? [];
  return crags.filter((c) => c.metadata?.lat != null && c.metadata?.lng != null);
}

async function fetchAreaClimbs(uuid: string): Promise<Climb[]> {
  const res = await fetch('https://api.openbeta.io', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: AREA_CLIMBS_QUERY, variables: { uuid } }),
  });

  if (!res.ok) throw new Error(`OpenBeta API error: ${res.status}`);
  const data = await res.json();
  if (data.errors) throw new Error(data.errors[0]?.message ?? 'Unknown API error');
  return data.data?.area?.climbs ?? [];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-stone-400">
      <div className="w-6 h-6 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 text-sm leading-relaxed">
      {message}
    </div>
  );
}

function CragList({ crags, onSelect }: { crags: Crag[]; onSelect: (crag: Crag) => void }) {
  if (!crags.length) {
    return (
      <p className="text-sm text-stone-400 py-4">
        No climbing areas found within 25 miles.
      </p>
    );
  }

  return (
    <div>
      <p className="text-xs text-stone-400 mb-3 uppercase tracking-wide">
        {crags.length} area{crags.length !== 1 ? 's' : ''} nearby
      </p>
      <div className="space-y-2">
        {crags.map((crag) => (
          <button
            key={crag.uuid}
            onClick={() => onSelect(crag)}
            className="w-full text-left p-3 rounded-lg bg-white hover:bg-sage-400/10 border border-stone-200 hover:border-sage-400 transition-colors"
          >
            <div className="font-medium text-stone-800 text-sm">{crag.area_name}</div>
            <div className="text-xs text-stone-400 mt-0.5">
              {crag.totalClimbs} route{crag.totalClimbs !== 1 ? 's' : ''}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ClimbList({
  climbs,
  crag,
  onSelect,
  onBack,
}: {
  climbs: Climb[];
  crag: Crag;
  onSelect: (climb: Climb) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-sage-500 hover:text-sage-600 mb-4 font-medium"
      >
        <ArrowLeftIcon className="w-3.5 h-3.5" />
        All areas
      </button>
      <h2 className="font-semibold text-stone-800 text-sm mb-0.5">{crag.area_name}</h2>
      <p className="text-xs text-stone-400 mb-4">
        {climbs.length} route{climbs.length !== 1 ? 's' : ''}
      </p>

      {climbs.length === 0 ? (
        <p className="text-sm text-stone-400">No routes listed for this area.</p>
      ) : (
        <div className="space-y-2">
          {climbs.map((climb) => (
            <button
              key={climb.uuid}
              onClick={() => onSelect(climb)}
              className="w-full text-left p-3 rounded-lg bg-white hover:bg-sage-400/10 border border-stone-200 hover:border-sage-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-stone-800 text-sm leading-snug">
                  {climb.name}
                </span>
                <span className="text-xs font-mono text-sage-600 bg-sage-400/10 px-2 py-0.5 rounded flex-none">
                  {getGrade(climb.grades)}
                </span>
              </div>
              <div className="text-xs text-stone-400 mt-0.5">{getClimbTypes(climb.type)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoField({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-stone-400 mb-0.5">{label}</dt>
      <dd className={`text-sm font-medium ${highlight ? 'text-sage-600' : muted ? 'text-stone-400 italic' : 'text-stone-700'}`}>
        {value}
      </dd>
    </div>
  );
}

function ClimbDetail({ climb, onBack }: { climb: Climb; onBack: () => void }) {
  const grade = getGrade(climb.grades);
  const types = getClimbTypes(climb.type);
  const allGrades = getAllGrades(climb.grades);
  const photos = (climb.media ?? []).filter((m) => m.mediaUrl);
  const pitches = climb.pitches ?? [];
  const mpId = climb.metadata?.mp_id;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-sage-500 hover:text-sage-600 mb-4 font-medium"
      >
        <ArrowLeftIcon className="w-3.5 h-3.5" />
        Back to routes
      </button>

      <div className="bg-white rounded-lg border border-stone-200 p-4 space-y-4">
        {/* ── Name & breadcrumb ── */}
        <div>
          <h2 className="text-base font-semibold text-stone-800 leading-snug">{climb.name}</h2>
          {climb.pathTokens && climb.pathTokens.length > 0 && (
            <p className="text-xs text-stone-400 mt-1">{climb.pathTokens.join(' › ')}</p>
          )}
        </div>

        {/* ── Key stats ── */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <InfoField label="Grade" value={grade} highlight />
          <InfoField label="Type" value={types} />
          <InfoField
            label="Length"
            value={climb.length != null && climb.length !== -1 ? `${climb.length} m` : 'No data'}
            muted={climb.length == null || climb.length === -1}
          />
          <InfoField
            label="Bolts"
            value={climb.boltsCount != null && climb.boltsCount !== -1 ? String(climb.boltsCount) : 'No data'}
            muted={climb.boltsCount == null || climb.boltsCount === -1}
          />
          <InfoField label="First Ascent" value={climb.fa || 'No data'} muted={!climb.fa} />
          <InfoField
            label="Safety"
            value={climb.safety && climb.safety !== 'UNSPECIFIED' ? climb.safety : 'No data'}
            muted={!climb.safety || climb.safety === 'UNSPECIFIED'}
          />
        </dl>

        {/* ── All grade systems (when more than one is present) ── */}
        {allGrades.length > 1 && (
          <div>
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Grades
            </h3>
            <div className="flex flex-wrap gap-2">
              {allGrades.map(({ label, value }) => (
                <span
                  key={label}
                  className="text-xs bg-stone-100 border border-stone-200 rounded px-2 py-1"
                >
                  <span className="text-stone-400">{label} </span>
                  <span className="font-medium text-stone-700">{value}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Text content ── */}
        <div>
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
            Description
          </h3>
          {climb.content?.description
            ? <p className="text-sm text-stone-700 leading-relaxed">{climb.content.description}</p>
            : <p className="text-sm text-stone-400 italic">No data</p>
          }
        </div>

        <div>
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
            Getting There
          </h3>
          {climb.content?.location
            ? <p className="text-sm text-stone-700 leading-relaxed">{climb.content.location}</p>
            : <p className="text-sm text-stone-400 italic">No data</p>
          }
        </div>

        <div>
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
            Protection
          </h3>
          {climb.content?.protection
            ? <p className="text-sm text-stone-700 leading-relaxed">{climb.content.protection}</p>
            : <p className="text-sm text-stone-400 italic">No data</p>
          }
        </div>

        {/* ── Pitches ── */}
        <div>
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
            Pitches
          </h3>
          {pitches.length > 0 ? (
            <div className="space-y-2">
              {pitches.map((pitch) => (
                <div
                  key={pitch.id}
                  className="flex items-start gap-3 p-2 rounded-lg bg-stone-50 border border-stone-200"
                >
                  <span className="text-xs font-bold text-stone-400 w-5 text-center flex-none mt-0.5">
                    {pitch.pitchNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {pitch.grades && (
                        <span className="text-xs font-mono font-medium text-sage-600">
                          {getGrade(pitch.grades)}
                        </span>
                      )}
                      {pitch.type && (
                        <span className="text-xs text-stone-400">{getClimbTypes(pitch.type)}</span>
                      )}
                      {pitch.length != null && pitch.length > 0 && (
                        <span className="text-xs text-stone-400">{pitch.length} m</span>
                      )}
                      {pitch.boltsCount != null && pitch.boltsCount > 0 && (
                        <span className="text-xs text-stone-400">{pitch.boltsCount} bolts</span>
                      )}
                    </div>
                    {pitch.description && (
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {pitch.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400 italic">No data</p>
          )}
        </div>

        {/* ── Photos ── */}
        <div>
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
            Photos
          </h3>
          {photos.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {photos.map((photo, i) => (
                <a
                  key={i}
                  href={getMediaUrl(photo.mediaUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-none"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getMediaUrl(photo.mediaUrl)}
                    alt={`${climb.name} photo ${i + 1}`}
                    className="h-32 w-auto rounded-lg object-cover border border-stone-200"
                  />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400 italic">No data</p>
          )}
        </div>

        {/* ── Mountain Project link ── */}
        {mpId && (
          <a
            href={`https://www.mountainproject.com/route/${mpId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-sage-600 hover:text-sage-700 font-medium"
          >
            View on Mountain Project ↗
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [crags, setCrags] = useState<Crag[]>([]);
  const [selectedCrag, setSelectedCrag] = useState<Crag | null>(null);
  const [cragClimbs, setCragClimbs] = useState<Climb[]>([]);
  const [selectedClimb, setSelectedClimb] = useState<Climb | null>(null);

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingCrags, setLoadingCrags] = useState(false);
  const [loadingClimbs, setLoadingClimbs] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // ── Get user location ──
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoadingLocation(false);
      },
      () => {
        setLocationError('Unable to access your location. Please enable location permissions and reload.');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ── Select a crag ──
  const handleCragSelect = useCallback((crag: Crag) => {
    setSelectedCrag(crag);
    setSelectedClimb(null);
    setCragClimbs([]);
    setApiError(null);

    mapInstanceRef.current?.panTo({ lat: crag.metadata.lat, lng: crag.metadata.lng });

    setLoadingClimbs(true);
    fetchAreaClimbs(crag.uuid)
      .then(setCragClimbs)
      .catch((err) => setApiError(`Failed to load routes: ${err.message}`))
      .finally(() => setLoadingClimbs(false));
  }, []);

  // ── Initialize Google Map ──
  useEffect(() => {
    if (!mapsLoaded || !userLocation || !mapRef.current || mapInstanceRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 11,
      mapTypeId: 'terrain',
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
      zoomControl: true,
      scrollwheel: true,
      gestureHandling: 'greedy',
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    // User location marker
    new google.maps.Marker({
      position: userLocation,
      map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#5C6B52',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2.5,
      },
      zIndex: 100,
    });

    // Re-fetch crags using the visible bounds whenever the map settles
    map.addListener('idle', () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      if (!bounds || zoom == null) return;
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      // bbox format: [minLng, minLat, maxLng, maxLat]
      const bbox: [number, number, number, number] = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
      setLoadingCrags(true);
      setApiError(null);
      fetchCragsWithin(bbox, zoom)
        .then(setCrags)
        .catch((err) => setApiError(`Failed to load climbing areas: ${err.message}`))
        .finally(() => setLoadingCrags(false));
    });
  }, [mapsLoaded, userLocation]);

  // ── Add / refresh crag markers ──
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !crags.length) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    crags.forEach((crag) => {
      const marker = new google.maps.Marker({
        position: { lat: crag.metadata.lat, lng: crag.metadata.lng },
        map,
        title: crag.area_name,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#8B6F47',
          fillOpacity: 0.95,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
          rotation: 180,
        },
      });

      marker.addListener('click', () => handleCragSelect(crag));
      markersRef.current.push(marker);
    });
  }, [crags, handleCragSelect]);

  // ── Panel content ──
  let panelContent: React.ReactNode;

  if (loadingLocation) {
    panelContent = <LoadingSpinner message="Getting your location…" />;
  } else if (locationError) {
    panelContent = <ErrorMessage message={locationError} />;
  } else if (selectedClimb) {
    panelContent = (
      <ClimbDetail climb={selectedClimb} onBack={() => setSelectedClimb(null)} />
    );
  } else if (selectedCrag) {
    panelContent = loadingClimbs ? (
      <LoadingSpinner message="Loading routes…" />
    ) : apiError ? (
      <ErrorMessage message={apiError} />
    ) : (
      <ClimbList
        climbs={cragClimbs}
        crag={selectedCrag}
        onSelect={setSelectedClimb}
        onBack={() => {
          setSelectedCrag(null);
          setCragClimbs([]);
        }}
      />
    );
  } else if (loadingCrags) {
    panelContent = <LoadingSpinner message="Finding nearby climbing areas…" />;
  } else if (apiError) {
    panelContent = <ErrorMessage message={apiError} />;
  } else {
    panelContent = <CragList crags={crags} onSelect={handleCragSelect} />;
  }

  return (
    <div className="flex flex-col md:flex-row md:h-full gap-3 md:gap-4">
      {/* ── Map — top on mobile, right on desktop ── */}
      <div className="order-1 md:order-2 h-64 md:h-auto md:flex-1 rounded-xl overflow-hidden border border-stone-200 relative">
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
          strategy="afterInteractive"
          onLoad={() => setMapsLoaded(true)}
        />
        {!mapsLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
            <div className="text-stone-400 text-sm">Loading map…</div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* ── Panel — bottom on mobile, left on desktop ── */}
      <div className="order-2 md:order-1 md:w-72 md:flex-none bg-stone-100 rounded-xl border border-stone-200 md:overflow-y-auto p-4">
        {panelContent}
      </div>
    </div>
  );
}
