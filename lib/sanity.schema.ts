import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Recipe
 *
 *
 */
export interface Recipe extends SanityDocument {
  _type: "recipe";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Description — `text`
   *
   *
   */
  description?: string;

  /**
   * Slug — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Author — `reference`
   *
   *
   */
  author?: SanityReference<Author>;

  /**
   * Image — `image`
   *
   *
   */
  image?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Category — `reference`
   *
   *
   */
  category?: SanityReference<Category>;

  /**
   * Portion — `number`
   *
   *
   */
  portion?: number;

  /**
   * Preparation (m) — `number`
   *
   *
   */
  preparation?: number;

  /**
   * Cook (m) — `number`
   *
   *
   */
  cook?: number;

  /**
   * Ingredients — `array`
   *
   *
   */
  ingredients?: Array<SanityKeyed<Ingredient>>;

  /**
   * Steps — `array`
   *
   *
   */
  steps?: Array<SanityKeyed<Step>>;
}

/**
 * Author
 *
 *
 */
export interface Author extends SanityDocument {
  _type: "author";

  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Slug — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Image — `image`
   *
   *
   */
  image?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Bio — `text`
   *
   *
   */
  bio?: string;
}

/**
 * Category
 *
 *
 */
export interface Category extends SanityDocument {
  _type: "category";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Description — `text`
   *
   *
   */
  description?: string;

  /**
   * Slug — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };
}

/**
 * Recipient
 *
 *
 */
export interface Recipient extends SanityDocument {
  _type: "recipient";

  /**
   * Email — `string`
   *
   *
   */
  email?: string;

  /**
   * Categories — `array`
   *
   *
   */
  categories?: Array<SanityKeyedReference<Category>>;
}

export type Ingredient = {
  _type: "ingredient";
  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Quantity — `number`
   *
   *
   */
  quantity?: number;

  /**
   * Unit — `string`
   *
   *
   */
  unit?: string;
};

export type Step = {
  _type: "step";
  /**
   * Title — `text`
   *
   *
   */
  title?: string;
};

export type Documents = Recipe | Author | Category | Recipient;
