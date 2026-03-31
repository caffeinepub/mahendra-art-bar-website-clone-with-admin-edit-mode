import Map "mo:core/Map";
import Nat32 "mo:core/Nat32";

module {
  type Section = {
    title : Text;
    subtitle : ?Text;
    description : ?Text;
    image : ?Blob;
  };

  type GalleryImage = {
    id : Text;
    title : Text;
    description : Text;
    imageUrl : Blob;
  };

  type OldWebsiteContent = {
    sectionsMap : Map.Map<Text, Section>;
    galleryMap : Map.Map<Nat32, GalleryImage>;
  };

  type NewSection = {
    title : Text;
    subtitle : ?Text;
    description : ?Text;
    image : ?Blob;
  };

  type NewGalleryImage = {
    id : Text;
    title : Text;
    description : Text;
    imageUrl : Blob;
  };

  type NewWebsiteContent = {
    sectionsMap : Map.Map<Text, NewSection>;
    galleryMap : Map.Map<Nat32, NewGalleryImage>;
  };

  public func run(old : OldWebsiteContent) : NewWebsiteContent {
    let newSectionsMap = old.sectionsMap.map<Text, Section, NewSection>(
      func(_sectionId, oldSection) { oldSection },
    );
    let newGalleryMap = old.galleryMap.map<Nat32, GalleryImage, NewGalleryImage>(
      func(_imageId, oldImage) { oldImage },
    );
    {
      sectionsMap = newSectionsMap;
      galleryMap = newGalleryMap;
    };
  };
};
