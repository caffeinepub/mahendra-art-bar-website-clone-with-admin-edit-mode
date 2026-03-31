import Map "mo:core/Map";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import Nat32 "mo:core/Nat32";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  let sectionsMap = Map.empty<Text, Section>();
  let galleryMap = Map.empty<Nat32, GalleryImage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  type Section = {
    title : Text;
    subtitle : ?Text;
    description : ?Text;
    image : ?Storage.ExternalBlob;
  };

  type GalleryImage = {
    id : Text;
    title : Text;
    description : Text;
    imageUrl : Storage.ExternalBlob;
  };

  type WebsiteContent = {
    sections : [Section];
    gallery : [GalleryImage];
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  /// AUTHENTICATION & AUTHORIZATION

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  /// CONTENT MANAGEMENT

  public query ({ caller }) func getWebsiteContent() : async WebsiteContent {
    {
      sections = sectionsMap.values().toArray();
      gallery = galleryMap.values().toArray();
    };
  };

  public shared ({ caller }) func updateWebsiteContent(content : WebsiteContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can update website content");
    };

    sectionsMap.clear();
    for (section in content.sections.values()) {
      sectionsMap.add(section.title, section);
    };

    galleryMap.clear();
    for (image in content.gallery.values()) {
      galleryMap.add(Nat32.fromNat(galleryMap.size()), image);
    };
  };

  public shared ({ caller }) func addSection(sectionId : Text, section : Section) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can add sections");
    };
    sectionsMap.add(sectionId, section);
  };

  public shared ({ caller }) func updateSection(sectionId : Text, section : Section) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can update sections");
    };
    sectionsMap.add(sectionId, section);
  };

  public shared ({ caller }) func deleteSection(sectionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can delete sections");
    };
    sectionsMap.remove(sectionId);
  };

  public shared ({ caller }) func addGalleryImage(id : Nat32, image : GalleryImage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can add gallery images");
    };
    galleryMap.add(id, image);
  };

  public shared ({ caller }) func updateGalleryImage(id : Nat32, image : GalleryImage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can update gallery images");
    };
    galleryMap.add(id, image);
  };

  public shared ({ caller }) func deleteGalleryImage(id : Nat32) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can delete gallery images");
    };
    galleryMap.remove(id);
  };

  public shared ({ caller }) func uploadImage(image : Storage.ExternalBlob) : async Storage.ExternalBlob {
    // External blobs are securely stored outside with admin-only access.
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can upload images");
    };
    image;
  };

  public query ({ caller }) func getSectionCount() : async Nat {
    sectionsMap.size();
  };

  public query ({ caller }) func getGalleryImageCount() : async Nat {
    galleryMap.size();
  };
};
