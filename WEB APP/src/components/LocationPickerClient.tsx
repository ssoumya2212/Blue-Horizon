import { useState, useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const customIcon = new L.DivIcon({
  html: '<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#ef4444;color:white;box-shadow:0 4px 12px rgba(0,0,0,0.3)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>',
  className: "custom-leaflet-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const DEFAULT_CENTER: [number, number] = [13.0094, 80.0111]; // Saveetha College area

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerClient({
  value,
  defaultValue = "",
  onChange,
  placeholder = "Enter location or pick on map",
  id,
  name,
  required,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);

  // Sync internal value when prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleSearch = async () => {
    if (!internalValue) return;
    setIsSearching(true);
    try {
      const query = encodeURIComponent(`${internalValue}, Chennai, Tamil Nadu, India`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setMarkerPos([lat, lng]);
        setMapCenter([lat, lng]);
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    }
    setIsSearching(false);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.display_name) {
        // Extract a shorter, friendlier address
        const parts = data.display_name.split(", ");
        const shortAddress = parts.slice(0, 3).join(", ");
        setInternalValue(shortAddress);
        onChange?.(shortAddress);
      }
    } catch (e) {
      console.error("Reverse geocoding failed", e);
    }
    setIsSearching(false);
  };

  const handleConfirm = () => {
    onChange?.(internalValue);
    setIsOpen(false);
  };

  return (
    <div className="flex w-full gap-2">
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          onChange?.(e.target.value);
        }}
        required={required}
        className="flex-1"
      />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="icon" title="Pick on map">
            <MapPin className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Select Location</DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-2 px-4 py-2">
            <Input 
              value={internalValue}
              onChange={(e) => setInternalValue(e.target.value)}
              placeholder="Search address..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching} type="button">
              {isSearching ? <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          <div className="h-[400px] w-full relative z-0">
            <MapContainer
              center={mapCenter}
              zoom={14}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapEvents onLocationSelect={handleMapClick} />
              {markerPos && <Marker position={markerPos} icon={customIcon} />}
            </MapContainer>
          </div>
          
          <div className="p-4 flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setIsOpen(false)} type="button">Cancel</Button>
            <Button onClick={handleConfirm} type="button">Confirm Location</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
