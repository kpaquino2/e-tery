const projectId = "zsceetvnigvlhybcjdxa"; // your supabase project id

export default function supabaseLoader({ src, width, height, quality }) {
  return `https://${projectId}.supabase.co/storage/v1/object/public/${src}?width=${width}&height=${
    height || 0
  }&quality=${quality || 75}`;
}
