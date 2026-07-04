import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import exifr from "exifr";

interface ExifInfo {
    coords: string | null;
    camera: { device: string; settings: string } | null;
}

interface AlbumExif {
    [albumId: string]: (ExifInfo | null)[];
}

async function extractExif(): Promise<void> {
    const albumsDir = path.resolve(process.cwd(), "src/content/albums");
    const result: AlbumExif = {};

    const entries = fs.readdirSync(albumsDir, { withFileTypes: true, recursive: true });
    const mdFiles = entries.filter((e) => e.isFile() && e.name.endsWith(".md"));

    for (const file of mdFiles) {
        const mdPath = path.join(file.parentPath, file.name);
        const mdContent = fs.readFileSync(mdPath, "utf-8");
        const frontmatterMatch = mdContent.match(/^---\n([\s\S]*?)\n---/);

        if (!frontmatterMatch) continue;

        const rawData = yaml.load(frontmatterMatch[1]) as any;
        const albumDir = path.dirname(mdPath);
        const albumRelPath = path.relative(albumsDir, mdPath).replace(/\.md$/, "");

        const albumExif: (ExifInfo | null)[] = [];

        for (const img of rawData.images || []) {
            const imagePath = path.resolve(albumDir, img.src);
            let exif: ExifInfo | null = null;

            try {
                const parsed = await exifr.parse(imagePath, {
                    gps: true,
                    exif: true,
                });

                if (parsed) {
                    const parts: string[] = [];
                    if (parsed.Make || parsed.Model) {
                        parts.push(`${parsed.Make || ""} ${parsed.Model || ""}`.trim());
                    }
                    if (parsed.FocalLength) {
                        parts.push(`${Math.round(parsed.FocalLength)}mm`);
                    }
                    if (parsed.FNumber) {
                        parts.push(`f/${parsed.FNumber}`);
                    }
                    if (parsed.ExposureTime) {
                        if (parsed.ExposureTime < 1) {
                            parts.push(`1/${Math.round(1 / parsed.ExposureTime)}s`);
                        } else {
                            parts.push(`${parsed.ExposureTime}s`);
                        }
                    }
                    if (parsed.ISO) {
                        parts.push(`ISO ${parsed.ISO}`);
                    }

                    function parseCameraSpec(parts: string[]): { device: string; settings: string } | null {
                        const raw = parts.join(" ");
                        // Strip redundant "Apple " prefix
                        const spec = raw.replace(/^Apple\s+/, "");
                        // Extract focal length position (e.g., "6mm")
                        const mmIdx = parts.findIndex((p) => /^\d+mm$/.test(p));
                        if (mmIdx === -1) return null;
                        const device = parts.slice(0, mmIdx).join(" ").replace(/^Apple\s+/, "");
                        const settings = parts.slice(mmIdx).join(" · ");
                        return { device, settings };
                    }

                    const coords =
                        parsed.latitude != null && parsed.longitude != null
                            ? `${Math.abs(parsed.latitude).toFixed(4)}° ${parsed.latitude >= 0 ? "N" : "S"}, ${Math.abs(parsed.longitude).toFixed(4)}° ${parsed.longitude >= 0 ? "E" : "W"}`
                            : null;
                    const camera = parts.length > 0 ? parseCameraSpec(parts) : null;

                    if (coords || camera) {
                        exif = { coords, camera };
                    }
                }
            } catch {
                // Silently skip — no EXIF or unreadable file
            }

            albumExif.push(exif);
        }

        result[albumRelPath] = albumExif;
    }

    const outDir = path.resolve(process.cwd(), "src/data");
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(outDir, "exif.json"),
        JSON.stringify(result, null, 2),
        "utf-8",
    );

    console.log(`✓ Extracted EXIF data for ${Object.keys(result).length} albums`);
}

extractExif();
