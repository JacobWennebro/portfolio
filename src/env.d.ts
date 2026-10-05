declare module "virtual:archive-filesystem" {
    export type ArchiveNode =
        | { name: string; type: "file" }
        | { name: string; type: "directory"; children: ArchiveNode[] };

    const archiveFilesystem: ArchiveNode[];
    export default archiveFilesystem;
}
