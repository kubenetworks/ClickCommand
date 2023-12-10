import dayjs from 'dayjs';

export function getTime(isoStr?: string) {
  if (!isoStr) return '-';

  return dayjs(isoStr).format('YYYY-MM-DD HH:mm:ss');
}

export const basicRe = /^[\w-]+$/;

export function getIsoTime() {
  return new Date().toISOString();
}
