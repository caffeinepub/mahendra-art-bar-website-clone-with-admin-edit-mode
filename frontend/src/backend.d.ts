import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Section {
    title: string;
    description?: string;
    image?: ExternalBlob;
    subtitle?: string;
}
export interface WebsiteContent {
    sections: Array<Section>;
    gallery: Array<GalleryImage>;
}
export interface GalleryImage {
    id: string;
    title: string;
    description: string;
    imageUrl: ExternalBlob;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryImage(id: number, image: GalleryImage): Promise<void>;
    addSection(sectionId: string, section: Section): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGalleryImage(id: number): Promise<void>;
    deleteSection(sectionId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGalleryImageCount(): Promise<bigint>;
    getSectionCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    /**
     * / CONTENT MANAGEMENT
     */
    getWebsiteContent(): Promise<WebsiteContent>;
    /**
     * / AUTHENTICATION & AUTHORIZATION
     */
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateGalleryImage(id: number, image: GalleryImage): Promise<void>;
    updateSection(sectionId: string, section: Section): Promise<void>;
    updateWebsiteContent(content: WebsiteContent): Promise<void>;
    uploadImage(image: ExternalBlob): Promise<ExternalBlob>;
}
