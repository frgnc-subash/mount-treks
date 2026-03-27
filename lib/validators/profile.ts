export type ProfileInput = {
  fullName: string;
  avatarUrl: string;
  phoneNumber: string;
  country: string;
  bio: string;
};

export type ProfileUpdate = {
  fullName: string;
  avatarUrl: string | null;
  phoneNumber: string | null;
  country: string | null;
  bio: string | null;
};

export class ProfileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileValidationError";
  }
}

export function validateProfileInput(input: ProfileInput): ProfileUpdate {
  const fullName = input.fullName.trim();
  if (!fullName || fullName.length < 2 || fullName.length > 80) {
    throw new ProfileValidationError("Full name must be between 2 and 80 characters.");
  }

  const avatarUrlRaw = input.avatarUrl.trim();
  const avatarUrl = avatarUrlRaw ? validateAvatarUrl(avatarUrlRaw) : null;

  const phoneNumberRaw = input.phoneNumber.trim();
  const phoneNumber = phoneNumberRaw ? validatePhone(phoneNumberRaw) : null;

  const countryRaw = input.country.trim();
  const country = countryRaw ? validateCountry(countryRaw) : null;

  const bioRaw = input.bio.trim();
  const bio = bioRaw ? validateBio(bioRaw) : null;

  return {
    fullName,
    avatarUrl,
    phoneNumber,
    country,
    bio,
  };
}

function validateAvatarUrl(value: string) {
  if (value.startsWith("/")) {
    if (value.length > 500) {
      throw new ProfileValidationError("Avatar path is too long.");
    }
    return value;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new ProfileValidationError("Avatar URL is invalid.");
  }

  if (!["https:", "http:"].includes(parsed.protocol)) {
    throw new ProfileValidationError("Avatar URL must use http or https.");
  }

  if (value.length > 1000) {
    throw new ProfileValidationError("Avatar URL is too long.");
  }

  return value;
}

function validatePhone(value: string) {
  if (!/^[+0-9()\-\s]{7,25}$/.test(value)) {
    throw new ProfileValidationError("Phone number format is invalid.");
  }

  return value;
}

function validateCountry(value: string) {
  if (value.length < 2 || value.length > 80) {
    throw new ProfileValidationError("Country must be between 2 and 80 characters.");
  }

  return value;
}

function validateBio(value: string) {
  if (value.length > 500) {
    throw new ProfileValidationError("Bio must be 500 characters or less.");
  }

  return value;
}
