/**
 * Single source of truth for Pakistan city suggestions.
 * Used as <datalist> options — the inputs remain free-text, so a user can always
 * type a city/area that isn't listed here. "Area" within a city is captured by
 * the separate district/address fields on the forms.
 */
export const PK_CITIES: string[] = [
  'Abbottabad', 'Attock', 'Bahawalnagar', 'Bahawalpur', 'Bannu', 'Burewala',
  'Chakwal', 'Charsadda', 'Chiniot', 'Chitral', 'Dadu', 'Daska',
  'Dera Ghazi Khan', 'Dera Ismail Khan', 'Faisalabad', 'Gilgit', 'Gojra',
  'Gujranwala', 'Gujrat', 'Gwadar', 'Hafizabad', 'Haripur', 'Hub', 'Hyderabad',
  'Islamabad', 'Jacobabad', 'Jaranwala', 'Jhang', 'Jhelum', 'Kamoke', 'Karachi',
  'Kasur', 'Khairpur', 'Khanewal', 'Khushab', 'Khuzdar', 'Kohat', 'Kotri',
  'Lahore', 'Larkana', 'Layyah', 'Lodhran', 'Mandi Bahauddin', 'Mansehra',
  'Mardan', 'Mingora', 'Mirpur (AJK)', 'Mirpur Khas', 'Multan', 'Muzaffarabad',
  'Muzaffargarh', 'Nawabshah', 'Nowshera', 'Okara', 'Pakpattan', 'Peshawar',
  'Quetta', 'Rahim Yar Khan', 'Rawalpindi', 'Sadiqabad', 'Sahiwal', 'Sargodha',
  'Sheikhupura', 'Sialkot', 'Skardu', 'Sukkur', 'Swabi', 'Swat', 'Tando Adam',
  'Tando Allahyar', 'Turbat', 'Vehari', 'Wah Cantonment', 'Zhob',
];
