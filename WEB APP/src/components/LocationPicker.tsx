import { useEffect, useState } from "react";

export function LocationPicker(props: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
}) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    import("./LocationPickerClient").then((mod) => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) {
    return (
      <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-muted/20 animate-pulse text-muted-foreground text-sm">
        Loading location picker...
      </div>
    );
  }

  return <Component {...props} />;
}
