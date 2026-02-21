import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TeamMember, Event, GalleryImage, Project, Achievement, Announcement, Collaboration, Resource, Registration, UserProfile } from '../backend';
import { ExternalBlob } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Team Members
export function useGetAllPublicTeamMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<TeamMember[]>({
    queryKey: ['publicTeamMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicTeamMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTeamMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; role: string; department: string; photo: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTeamMember(data.name, data.role, data.department, data.photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicTeamMembers'] });
    },
  });
}

export function useUpdateTeamMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; name: string; role: string; department: string; photo: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTeamMember(data.id, data.name, data.role, data.department, data.photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicTeamMembers'] });
    },
  });
}

export function useRemoveTeamMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeTeamMember(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicTeamMembers'] });
    },
  });
}

export function usePublishTeamMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishTeamMember(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicTeamMembers'] });
    },
  });
}

// Events
export function useGetPastEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['pastEvents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPastEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUpcomingEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUpcomingEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      date: bigint;
      description: string;
      photos: ExternalBlob[];
      outcomes: string | null;
      registrationLink: string | null;
      poster: ExternalBlob | null;
      isPast: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEvent(
        data.name,
        data.date,
        data.description,
        data.photos,
        data.outcomes,
        data.registrationLink,
        data.poster,
        data.isPast
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastEvents'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
    },
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      date: bigint;
      description: string;
      photos: ExternalBlob[];
      outcomes: string | null;
      registrationLink: string | null;
      poster: ExternalBlob | null;
      isPast: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEvent(
        data.id,
        data.name,
        data.date,
        data.description,
        data.photos,
        data.outcomes,
        data.registrationLink,
        data.poster,
        data.isPast
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastEvents'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastEvents'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
    },
  });
}

export function usePublishEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastEvents'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
    },
  });
}

// Gallery Images
export function useGetAllPublicGalleryImages() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryImage[]>({
    queryKey: ['publicGalleryImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { category: string; image: ExternalBlob; caption: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadGalleryImage(data.category, data.image, data.caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicGalleryImages'] });
    },
  });
}

export function useDeleteGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicGalleryImages'] });
    },
  });
}

export function usePublishGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicGalleryImages'] });
    },
  });
}

// Projects
export function useGetAllPublicProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['publicProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['myProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      techUsed: string;
      teamMembers: string;
      demoLink: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitProject(data.title, data.description, data.techUsed, data.teamMembers, data.demoLink);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      queryClient.invalidateQueries({ queryKey: ['publicProjects'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      techUsed: string;
      teamMembers: string;
      demoLink: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProject(data.id, data.title, data.description, data.techUsed, data.teamMembers, data.demoLink);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      queryClient.invalidateQueries({ queryKey: ['publicProjects'] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      queryClient.invalidateQueries({ queryKey: ['publicProjects'] });
    },
  });
}

export function usePublishProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicProjects'] });
    },
  });
}

// Achievements
export function useGetAllPublicAchievements() {
  const { actor, isFetching } = useActor();

  return useQuery<Achievement[]>({
    queryKey: ['publicAchievements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicAchievements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      category: string;
      description: string;
      date: bigint;
      recipients: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAchievement(data.title, data.category, data.description, data.date, data.recipients);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicAchievements'] });
    },
  });
}

export function useUpdateAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      category: string;
      description: string;
      date: bigint;
      recipients: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAchievement(data.id, data.title, data.category, data.description, data.date, data.recipients);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicAchievements'] });
    },
  });
}

export function useRemoveAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAchievement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicAchievements'] });
    },
  });
}

export function usePublishAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishAchievement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicAchievements'] });
    },
  });
}

// Announcements
export function useGetAllPublicAnnouncements() {
  const { actor, isFetching } = useActor();

  return useQuery<Announcement[]>({
    queryKey: ['publicAnnouncements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicAnnouncements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePostAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; content: string; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postAnnouncement(data.title, data.content, data.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicAnnouncements'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; title: string; content: string; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAnnouncement(data.id, data.title, data.content, data.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicAnnouncements'] });
    },
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicAnnouncements'] });
    },
  });
}

export function usePublishAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishAnnouncement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicAnnouncements'] });
    },
  });
}

// Collaborations
export function useGetAllPublicCollaborations() {
  const { actor, isFetching } = useActor();

  return useQuery<Collaboration[]>({
    queryKey: ['publicCollaborations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicCollaborations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCollaboration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      companyName: string;
      problemStatement: string | null;
      internshipOpportunity: string | null;
      contactInfo: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCollaboration(
        data.companyName,
        data.problemStatement,
        data.internshipOpportunity,
        data.contactInfo
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicCollaborations'] });
    },
  });
}

export function useUpdateCollaboration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      companyName: string;
      problemStatement: string | null;
      internshipOpportunity: string | null;
      contactInfo: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCollaboration(
        data.id,
        data.companyName,
        data.problemStatement,
        data.internshipOpportunity,
        data.contactInfo
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicCollaborations'] });
    },
  });
}

export function useRemoveCollaboration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeCollaboration(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicCollaborations'] });
    },
  });
}

export function usePublishCollaboration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishCollaboration(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicCollaborations'] });
    },
  });
}

// Resources
export function useGetAllPublicResources() {
  const { actor, isFetching } = useActor();

  return useQuery<Resource[]>({
    queryKey: ['publicResources'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicResources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; category: string; description: string; link: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addResource(data.title, data.category, data.description, data.link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicResources'] });
    },
  });
}

export function useUpdateResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; title: string; category: string; description: string; link: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateResource(data.id, data.title, data.category, data.description, data.link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicResources'] });
    },
  });
}

export function useRemoveResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeResource(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicResources'] });
    },
  });
}

export function usePublishResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishResource(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicResources'] });
    },
  });
}

// Registrations
export function useGetMyRegistration() {
  const { actor, isFetching } = useActor();

  return useQuery<Registration | null>({
    queryKey: ['myRegistration'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyRegistration();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      branch: string;
      year: string;
      skills: string;
      interestArea: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRegistration(data.name, data.branch, data.year, data.skills, data.interestArea);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRegistration'] });
    },
  });
}
