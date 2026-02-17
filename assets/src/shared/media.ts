
export function calculateFileBitrate(file: File) {
  return new Promise<number>((resolve) => {
    const tag = file.type.startsWith('audio/') ? 'audio' : 'video';

    const el = document.createElement(tag);
    el.preload = "metadata";

    el.onloadedmetadata = function () {
      window.URL.revokeObjectURL(el.src);

      const duration = el.duration; // seconds
      const fileSize = file.size; // bytes

      const bitrate = calculateBitrate(fileSize, duration); // bits per second

      resolve(bitrate);
    };

    el.src = URL.createObjectURL(file);
  });
}

export function calculateBitrate(bytesSize: number, duration: number) {
  // To bits and per second
  return (bytesSize * 8) / duration;
}
