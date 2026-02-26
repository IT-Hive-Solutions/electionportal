const NEPALI_DIGITS: Record<string, string> = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
};

export function toNepaliNumber(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => NEPALI_DIGITS[d]);
}
