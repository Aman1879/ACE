const slugify = require('slugify');

/**
 * Generate a URL-friendly slug from a name.
 * Appends a random 4-char suffix to avoid collisions.
 * If the slug still exists in DB, appends numeric counter.
 *
 * @param {string}  name       – display name, e.g. "Aman Kumar"
 * @param {Model}   UserModel  – Mongoose User model for uniqueness check
 * @returns {Promise<string>}  – e.g. "aman-kumar-x7f2"
 */
exports.generateSlug = async (name, UserModel) => {
  const randomSuffix = () =>
    Math.random().toString(36).substring(2, 6); // 4 random alphanumeric chars

  const base = slugify(name, { lower: true, strict: true, trim: true });
  let slug   = `${base}-${randomSuffix()}`;

  // Make sure slug is unique in the DB
  let counter = 1;
  while (true) {
    const exists = await UserModel.findOne({ username: slug }).lean();
    if (!exists) break;
    // If collision, try new suffix; after 5 tries, append counter
    if (counter <= 5) {
      slug = `${base}-${randomSuffix()}`;
    } else {
      slug = `${base}-${randomSuffix()}-${counter}`;
    }
    counter += 1;
  }

  return slug;
};
