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
export interface Event {
    id: bigint;
    date: bigint;
    name: string;
    description: string;
    isPast: boolean;
    outcomes?: string;
    isPublic: boolean;
    registrationLink?: string;
    photos: Array<ExternalBlob>;
    poster?: ExternalBlob;
}
export interface Collaboration {
    id: bigint;
    contactInfo?: string;
    companyName: string;
    internshipOpportunity?: string;
    isPublic: boolean;
    problemStatement?: string;
}
export interface Registration {
    id: bigint;
    status: string;
    branch: string;
    name: string;
    year: string;
    submittedBy: Principal;
    interestArea: string;
    timestamp: bigint;
    skills: string;
}
export interface Achievement {
    id: bigint;
    title: string;
    date: bigint;
    description: string;
    recipients: string;
    category: string;
    isPublic: boolean;
}
export interface GalleryImage {
    id: bigint;
    caption?: string;
    category: string;
    image: ExternalBlob;
    isPublic: boolean;
}
export interface Announcement {
    id: bigint;
    title: string;
    content: string;
    timestamp: bigint;
    category: string;
    isPublic: boolean;
}
export interface TeamMember {
    id: bigint;
    name: string;
    role: string;
    isPublic: boolean;
    photo?: ExternalBlob;
    department: string;
}
export interface Resource {
    id: bigint;
    title: string;
    link: string;
    description: string;
    category: string;
    isPublic: boolean;
}
export interface Project {
    id: bigint;
    techUsed: string;
    title: string;
    submittedBy: Principal;
    description: string;
    demoLink?: string;
    teamMembers: string;
    timestamp: bigint;
    isPublic: boolean;
}
export interface UserProfile {
    branch?: string;
    name: string;
    year?: string;
    skills?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAchievement(title: string, category: string, description: string, date: bigint, recipients: string): Promise<bigint>;
    addCollaboration(companyName: string, problemStatement: string | null, internshipOpportunity: string | null, contactInfo: string | null): Promise<bigint>;
    addResource(title: string, category: string, description: string, link: string): Promise<bigint>;
    addTeamMember(name: string, role: string, department: string, photo: ExternalBlob | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEvent(name: string, date: bigint, description: string, photos: Array<ExternalBlob>, outcomes: string | null, registrationLink: string | null, poster: ExternalBlob | null, isPast: boolean): Promise<bigint>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteEvent(id: bigint): Promise<void>;
    deleteGalleryImage(id: bigint): Promise<void>;
    deleteProject(id: bigint): Promise<void>;
    getAchievementsByCategory(category: string): Promise<Array<Achievement>>;
    getAllPublicAchievements(): Promise<Array<Achievement>>;
    getAllPublicAnnouncements(): Promise<Array<Announcement>>;
    getAllPublicCollaborations(): Promise<Array<Collaboration>>;
    getAllPublicGalleryImages(): Promise<Array<GalleryImage>>;
    getAllPublicProjects(): Promise<Array<Project>>;
    getAllPublicResources(): Promise<Array<Resource>>;
    getAllPublicTeamMembers(): Promise<Array<TeamMember>>;
    getAllRegistrations(): Promise<Array<Registration>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGalleryImagesByCategory(category: string): Promise<Array<GalleryImage>>;
    getMyProjects(): Promise<Array<Project>>;
    getMyRegistration(): Promise<Registration | null>;
    getPastEvents(): Promise<Array<Event>>;
    getResourcesByCategory(category: string): Promise<Array<Resource>>;
    getTeamMember(id: bigint): Promise<TeamMember | null>;
    getTeamMembersByDepartment(department: string): Promise<Array<TeamMember>>;
    getTeamMembersByRole(role: string): Promise<Array<TeamMember>>;
    getUpcomingEvents(): Promise<Array<Event>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    postAnnouncement(title: string, content: string, category: string): Promise<bigint>;
    publishAchievement(id: bigint): Promise<void>;
    publishAnnouncement(id: bigint): Promise<void>;
    publishCollaboration(id: bigint): Promise<void>;
    publishEvent(id: bigint): Promise<void>;
    publishGalleryImage(id: bigint): Promise<void>;
    publishProject(id: bigint): Promise<void>;
    publishResource(id: bigint): Promise<void>;
    publishTeamMember(id: bigint): Promise<void>;
    removeAchievement(id: bigint): Promise<void>;
    removeCollaboration(id: bigint): Promise<void>;
    removeResource(id: bigint): Promise<void>;
    removeTeamMember(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitProject(title: string, description: string, techUsed: string, teamMembers: string, demoLink: string | null): Promise<bigint>;
    submitRegistration(name: string, branch: string, year: string, skills: string, interestArea: string): Promise<bigint>;
    updateAchievement(id: bigint, title: string, category: string, description: string, date: bigint, recipients: string): Promise<void>;
    updateAnnouncement(id: bigint, title: string, content: string, category: string): Promise<void>;
    updateCollaboration(id: bigint, companyName: string, problemStatement: string | null, internshipOpportunity: string | null, contactInfo: string | null): Promise<void>;
    updateEvent(id: bigint, name: string, date: bigint, description: string, photos: Array<ExternalBlob>, outcomes: string | null, registrationLink: string | null, poster: ExternalBlob | null, isPast: boolean): Promise<void>;
    updateProject(id: bigint, title: string, description: string, techUsed: string, teamMembers: string, demoLink: string | null): Promise<void>;
    updateRegistrationStatus(id: bigint, status: string): Promise<void>;
    updateResource(id: bigint, title: string, category: string, description: string, link: string): Promise<void>;
    updateTeamMember(id: bigint, name: string, role: string, department: string, photo: ExternalBlob | null): Promise<void>;
    uploadGalleryImage(category: string, image: ExternalBlob, caption: string | null): Promise<bigint>;
}
