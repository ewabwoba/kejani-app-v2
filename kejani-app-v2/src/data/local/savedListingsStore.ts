import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'kejani.savedListingIds.v1';

export async function getSavedListingIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function toggleSavedListingId(id: string): Promise<string[]> {
  const current = await getSavedListingIds();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
