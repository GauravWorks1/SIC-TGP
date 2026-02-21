import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile
  public type UserProfile = {
    name : Text;
    branch : ?Text;
    year : ?Text;
    skills : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Team Section
  public type TeamMember = {
    id : Nat;
    name : Text;
    role : Text;
    department : Text;
    photo : ?Storage.ExternalBlob;
    isPublic : Bool;
  };

  let teamMembers = Map.empty<Nat, TeamMember>();
  var nextMemberId = 0;

  public shared ({ caller }) func addTeamMember(name : Text, role : Text, department : Text, photo : ?Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add team members");
    };
    let member : TeamMember = {
      id = nextMemberId;
      name;
      role;
      department;
      photo;
      isPublic = false;
    };
    teamMembers.add(nextMemberId, member);
    nextMemberId += 1;
    nextMemberId - 1;
  };

  public shared ({ caller }) func updateTeamMember(id : Nat, name : Text, role : Text, department : Text, photo : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update team members");
    };
    switch (teamMembers.get(id)) {
      case (null) { Runtime.trap("Member not found") };
      case (?existing) {
        let updated : TeamMember = {
          id;
          name;
          role;
          department;
          photo;
          isPublic = existing.isPublic;
        };
        teamMembers.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func removeTeamMember(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove team members");
    };
    teamMembers.remove(id);
  };

  public query func getTeamMember(id : Nat) : async ?TeamMember {
    teamMembers.get(id);
  };

  public shared ({ caller }) func publishTeamMember(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish team members");
    };
    switch (teamMembers.get(id)) {
      case (null) { Runtime.trap("Member not found") };
      case (?member) {
        let updated : TeamMember = {
          id = member.id;
          name = member.name;
          role = member.role;
          department = member.department;
          photo = member.photo;
          isPublic = true;
        };
        teamMembers.add(id, updated);
      };
    };
  };

  public query func getAllPublicTeamMembers() : async [TeamMember] {
    teamMembers.values().filter(func(member) { member.isPublic }).toArray();
  };

  public query func getTeamMembersByRole(role : Text) : async [TeamMember] {
    teamMembers.values().filter(func(member) { Text.equal(member.role, role) and member.isPublic }).toArray();
  };

  public query func getTeamMembersByDepartment(department : Text) : async [TeamMember] {
    teamMembers.values().filter(func(member) { Text.equal(member.department, department) and member.isPublic }).toArray();
  };

  // Events Section
  public type Event = {
    id : Nat;
    name : Text;
    date : Int;
    description : Text;
    photos : [Storage.ExternalBlob];
    outcomes : ?Text;
    registrationLink : ?Text;
    poster : ?Storage.ExternalBlob;
    isPast : Bool;
    isPublic : Bool;
  };

  let events = Map.empty<Nat, Event>();
  var nextEventId = 0;

  public shared ({ caller }) func createEvent(
    name : Text,
    date : Int,
    description : Text,
    photos : [Storage.ExternalBlob],
    outcomes : ?Text,
    registrationLink : ?Text,
    poster : ?Storage.ExternalBlob,
    isPast : Bool,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };
    let event : Event = {
      id = nextEventId;
      name;
      date;
      description;
      photos;
      outcomes;
      registrationLink;
      poster;
      isPast;
      isPublic = false;
    };
    events.add(nextEventId, event);
    nextEventId += 1;
    nextEventId - 1;
  };

  public shared ({ caller }) func updateEvent(
    id : Nat,
    name : Text,
    date : Int,
    description : Text,
    photos : [Storage.ExternalBlob],
    outcomes : ?Text,
    registrationLink : ?Text,
    poster : ?Storage.ExternalBlob,
    isPast : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?existing) {
        let updated : Event = {
          id;
          name;
          date;
          description;
          photos;
          outcomes;
          registrationLink;
          poster;
          isPast;
          isPublic = existing.isPublic;
        };
        events.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteEvent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };
    events.remove(id);
  };

  public shared ({ caller }) func publishEvent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish events");
    };
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        let updated : Event = {
          id = event.id;
          name = event.name;
          date = event.date;
          description = event.description;
          photos = event.photos;
          outcomes = event.outcomes;
          registrationLink = event.registrationLink;
          poster = event.poster;
          isPast = event.isPast;
          isPublic = true;
        };
        events.add(id, updated);
      };
    };
  };

  public query func getPastEvents() : async [Event] {
    events.values().filter(func(event) { event.isPast and event.isPublic }).toArray();
  };

  public query func getUpcomingEvents() : async [Event] {
    events.values().filter(func(event) { not event.isPast and event.isPublic }).toArray();
  };

  // Image Gallery Section
  public type GalleryImage = {
    id : Nat;
    category : Text;
    image : Storage.ExternalBlob;
    caption : ?Text;
    isPublic : Bool;
  };

  let galleryImages = Map.empty<Nat, GalleryImage>();
  var nextImageId = 0;

  public shared ({ caller }) func uploadGalleryImage(category : Text, image : Storage.ExternalBlob, caption : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload gallery images");
    };
    let galleryImage : GalleryImage = {
      id = nextImageId;
      category;
      image;
      caption;
      isPublic = false;
    };
    galleryImages.add(nextImageId, galleryImage);
    nextImageId += 1;
    nextImageId - 1;
  };

  public shared ({ caller }) func deleteGalleryImage(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery images");
    };
    galleryImages.remove(id);
  };

  public shared ({ caller }) func publishGalleryImage(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish gallery images");
    };
    switch (galleryImages.get(id)) {
      case (null) { Runtime.trap("Image not found") };
      case (?img) {
        let updated : GalleryImage = {
          id = img.id;
          category = img.category;
          image = img.image;
          caption = img.caption;
          isPublic = true;
        };
        galleryImages.add(id, updated);
      };
    };
  };

  public query func getGalleryImagesByCategory(category : Text) : async [GalleryImage] {
    galleryImages.values().filter(func(img) { Text.equal(img.category, category) and img.isPublic }).toArray();
  };

  public query func getAllPublicGalleryImages() : async [GalleryImage] {
    galleryImages.values().filter(func(img) { img.isPublic }).toArray();
  };

  // Project Showcase Section
  public type Project = {
    id : Nat;
    title : Text;
    description : Text;
    techUsed : Text;
    teamMembers : Text;
    demoLink : ?Text;
    submittedBy : Principal;
    timestamp : Int;
    isPublic : Bool;
  };

  let projects = Map.empty<Nat, Project>();
  var nextProjectId = 0;

  public shared ({ caller }) func submitProject(
    title : Text,
    description : Text,
    techUsed : Text,
    teamMembers : Text,
    demoLink : ?Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit projects");
    };
    let project : Project = {
      id = nextProjectId;
      title;
      description;
      techUsed;
      teamMembers;
      demoLink;
      submittedBy = caller;
      timestamp = Time.now();
      isPublic = false;
    };
    projects.add(nextProjectId, project);
    nextProjectId += 1;
    nextProjectId - 1;
  };

  public shared ({ caller }) func updateProject(
    id : Nat,
    title : Text,
    description : Text,
    techUsed : Text,
    teamMembers : Text,
    demoLink : ?Text,
  ) : async () {
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?existing) {
        if (caller != existing.submittedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own projects");
        };
        let updated : Project = {
          id;
          title;
          description;
          techUsed;
          teamMembers;
          demoLink;
          submittedBy = existing.submittedBy;
          timestamp = existing.timestamp;
          isPublic = existing.isPublic;
        };
        projects.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteProject(id : Nat) : async () {
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?existing) {
        if (caller != existing.submittedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own projects");
        };
        projects.remove(id);
      };
    };
  };

  public shared ({ caller }) func publishProject(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish projects");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        let updated : Project = {
          id = project.id;
          title = project.title;
          description = project.description;
          techUsed = project.techUsed;
          teamMembers = project.teamMembers;
          demoLink = project.demoLink;
          submittedBy = project.submittedBy;
          timestamp = project.timestamp;
          isPublic = true;
        };
        projects.add(id, updated);
      };
    };
  };

  public query func getAllPublicProjects() : async [Project] {
    projects.values().filter(func(project) { project.isPublic }).toArray();
  };

  public query ({ caller }) func getMyProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their projects");
    };
    projects.values().filter(func(project) { project.submittedBy == caller }).toArray();
  };

  // Achievements Section
  public type Achievement = {
    id : Nat;
    title : Text;
    category : Text;
    description : Text;
    date : Int;
    recipients : Text;
    isPublic : Bool;
  };

  let achievements = Map.empty<Nat, Achievement>();
  var nextAchievementId = 0;

  public shared ({ caller }) func addAchievement(
    title : Text,
    category : Text,
    description : Text,
    date : Int,
    recipients : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add achievements");
    };
    let achievement : Achievement = {
      id = nextAchievementId;
      title;
      category;
      description;
      date;
      recipients;
      isPublic = false;
    };
    achievements.add(nextAchievementId, achievement);
    nextAchievementId += 1;
    nextAchievementId - 1;
  };

  public shared ({ caller }) func updateAchievement(
    id : Nat,
    title : Text,
    category : Text,
    description : Text,
    date : Int,
    recipients : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update achievements");
    };
    switch (achievements.get(id)) {
      case (null) { Runtime.trap("Achievement not found") };
      case (?existing) {
        let updated : Achievement = {
          id;
          title;
          category;
          description;
          date;
          recipients;
          isPublic = existing.isPublic;
        };
        achievements.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func removeAchievement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove achievements");
    };
    achievements.remove(id);
  };

  public shared ({ caller }) func publishAchievement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish achievements");
    };
    switch (achievements.get(id)) {
      case (null) { Runtime.trap("Achievement not found") };
      case (?achievement) {
        let updated : Achievement = {
          id = achievement.id;
          title = achievement.title;
          category = achievement.category;
          description = achievement.description;
          date = achievement.date;
          recipients = achievement.recipients;
          isPublic = true;
        };
        achievements.add(id, updated);
      };
    };
  };

  public query func getAllPublicAchievements() : async [Achievement] {
    achievements.values().filter(func(achievement) { achievement.isPublic }).toArray();
  };

  public query func getAchievementsByCategory(category : Text) : async [Achievement] {
    achievements.values().filter(func(achievement) { Text.equal(achievement.category, category) and achievement.isPublic }).toArray();
  };

  // Announcements Section
  public type Announcement = {
    id : Nat;
    title : Text;
    content : Text;
    category : Text;
    timestamp : Int;
    isPublic : Bool;
  };

  let announcements = Map.empty<Nat, Announcement>();
  var nextAnnouncementId = 0;

  public shared ({ caller }) func postAnnouncement(title : Text, content : Text, category : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can post announcements");
    };
    let announcement : Announcement = {
      id = nextAnnouncementId;
      title;
      content;
      category;
      timestamp = Time.now();
      isPublic = false;
    };
    announcements.add(nextAnnouncementId, announcement);
    nextAnnouncementId += 1;
    nextAnnouncementId - 1;
  };

  public shared ({ caller }) func updateAnnouncement(id : Nat, title : Text, content : Text, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update announcements");
    };
    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?existing) {
        let updated : Announcement = {
          id;
          title;
          content;
          category;
          timestamp = existing.timestamp;
          isPublic = existing.isPublic;
        };
        announcements.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };
    announcements.remove(id);
  };

  public shared ({ caller }) func publishAnnouncement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish announcements");
    };
    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?announcement) {
        let updated : Announcement = {
          id = announcement.id;
          title = announcement.title;
          content = announcement.content;
          category = announcement.category;
          timestamp = announcement.timestamp;
          isPublic = true;
        };
        announcements.add(id, updated);
      };
    };
  };

  public query func getAllPublicAnnouncements() : async [Announcement] {
    announcements.values().filter(func(announcement) { announcement.isPublic }).toArray();
  };

  // Industry Collaboration Section
  public type Collaboration = {
    id : Nat;
    companyName : Text;
    problemStatement : ?Text;
    internshipOpportunity : ?Text;
    contactInfo : ?Text;
    isPublic : Bool;
  };

  let collaborations = Map.empty<Nat, Collaboration>();
  var nextCollaborationId = 0;

  public shared ({ caller }) func addCollaboration(
    companyName : Text,
    problemStatement : ?Text,
    internshipOpportunity : ?Text,
    contactInfo : ?Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add collaborations");
    };
    let collaboration : Collaboration = {
      id = nextCollaborationId;
      companyName;
      problemStatement;
      internshipOpportunity;
      contactInfo;
      isPublic = false;
    };
    collaborations.add(nextCollaborationId, collaboration);
    nextCollaborationId += 1;
    nextCollaborationId - 1;
  };

  public shared ({ caller }) func updateCollaboration(
    id : Nat,
    companyName : Text,
    problemStatement : ?Text,
    internshipOpportunity : ?Text,
    contactInfo : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update collaborations");
    };
    switch (collaborations.get(id)) {
      case (null) { Runtime.trap("Collaboration not found") };
      case (?existing) {
        let updated : Collaboration = {
          id;
          companyName;
          problemStatement;
          internshipOpportunity;
          contactInfo;
          isPublic = existing.isPublic;
        };
        collaborations.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func removeCollaboration(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove collaborations");
    };
    collaborations.remove(id);
  };

  public shared ({ caller }) func publishCollaboration(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish collaborations");
    };
    switch (collaborations.get(id)) {
      case (null) { Runtime.trap("Collaboration not found") };
      case (?collaboration) {
        let updated : Collaboration = {
          id = collaboration.id;
          companyName = collaboration.companyName;
          problemStatement = collaboration.problemStatement;
          internshipOpportunity = collaboration.internshipOpportunity;
          contactInfo = collaboration.contactInfo;
          isPublic = true;
        };
        collaborations.add(id, updated);
      };
    };
  };

  public query func getAllPublicCollaborations() : async [Collaboration] {
    collaborations.values().filter(func(collaboration) { collaboration.isPublic }).toArray();
  };

  // Resources Section
  public type Resource = {
    id : Nat;
    title : Text;
    category : Text;
    description : Text;
    link : Text;
    isPublic : Bool;
  };

  let resources = Map.empty<Nat, Resource>();
  var nextResourceId = 0;

  public shared ({ caller }) func addResource(title : Text, category : Text, description : Text, link : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add resources");
    };
    let resource : Resource = {
      id = nextResourceId;
      title;
      category;
      description;
      link;
      isPublic = false;
    };
    resources.add(nextResourceId, resource);
    nextResourceId += 1;
    nextResourceId - 1;
  };

  public shared ({ caller }) func updateResource(id : Nat, title : Text, category : Text, description : Text, link : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update resources");
    };
    switch (resources.get(id)) {
      case (null) { Runtime.trap("Resource not found") };
      case (?existing) {
        let updated : Resource = {
          id;
          title;
          category;
          description;
          link;
          isPublic = existing.isPublic;
        };
        resources.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func removeResource(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove resources");
    };
    resources.remove(id);
  };

  public shared ({ caller }) func publishResource(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish resources");
    };
    switch (resources.get(id)) {
      case (null) { Runtime.trap("Resource not found") };
      case (?resource) {
        let updated : Resource = {
          id = resource.id;
          title = resource.title;
          category = resource.category;
          description = resource.description;
          link = resource.link;
          isPublic = true;
        };
        resources.add(id, updated);
      };
    };
  };

  public query func getAllPublicResources() : async [Resource] {
    resources.values().filter(func(resource) { resource.isPublic }).toArray();
  };

  public query func getResourcesByCategory(category : Text) : async [Resource] {
    resources.values().filter(func(resource) { Text.equal(resource.category, category) and resource.isPublic }).toArray();
  };

  // Join Us/Register Section
  public type Registration = {
    id : Nat;
    name : Text;
    branch : Text;
    year : Text;
    skills : Text;
    interestArea : Text;
    submittedBy : Principal;
    timestamp : Int;
    status : Text;
  };

  let registrations = Map.empty<Nat, Registration>();
  var nextRegistrationId = 0;

  public shared ({ caller }) func submitRegistration(
    name : Text,
    branch : Text,
    year : Text,
    skills : Text,
    interestArea : Text,
  ) : async Nat {
    let registration : Registration = {
      id = nextRegistrationId;
      name;
      branch;
      year;
      skills;
      interestArea;
      submittedBy = caller;
      timestamp = Time.now();
      status = "pending";
    };
    registrations.add(nextRegistrationId, registration);
    nextRegistrationId += 1;
    nextRegistrationId - 1;
  };

  public query ({ caller }) func getMyRegistration() : async ?Registration {
    let userRegs = registrations.values().filter(func(reg) { reg.submittedBy == caller }).toArray();
    if (userRegs.size() > 0) {
      ?userRegs[0];
    } else {
      null;
    };
  };

  public query ({ caller }) func getAllRegistrations() : async [Registration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };
    registrations.values().toArray();
  };

  public shared ({ caller }) func updateRegistrationStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update registration status");
    };
    switch (registrations.get(id)) {
      case (null) { Runtime.trap("Registration not found") };
      case (?existing) {
        let updated : Registration = {
          id = existing.id;
          name = existing.name;
          branch = existing.branch;
          year = existing.year;
          skills = existing.skills;
          interestArea = existing.interestArea;
          submittedBy = existing.submittedBy;
          timestamp = existing.timestamp;
          status;
        };
        registrations.add(id, updated);
      };
    };
  };
};
