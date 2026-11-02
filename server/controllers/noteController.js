const Note = require('../models/Note');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getNotes = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 20;
    const skip   = (page - 1) * limit;
    const filter = { user: req.user.id };
    if (req.query.category)   filter.category   = req.query.category;
    if (req.query.isArchived !== undefined) filter.isArchived = req.query.isArchived === 'true';
    if (req.query.isPinned !== undefined)   filter.isPinned   = req.query.isPinned === 'true';
    if (req.query.search) {
      filter.$or = [
        { title:   { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Note.find(filter).sort({ isPinned: -1, updatedAt: -1 }).skip(skip).limit(limit),
      Note.countDocuments(filter),
    ]);
    return paginatedResponse(res, items, total, page, limit);
  } catch (err) { next(err); }
};

exports.getNote = async (req, res, next) => {
  try {
    const item = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Note not found', 404);
    return successResponse(res, item);
  } catch (err) { next(err); }
};

exports.createNote = async (req, res, next) => {
  try {
    const item = await Note.create({ ...req.body, user: req.user.id });
    return successResponse(res, item, 'Note created', 201);
  } catch (err) { next(err); }
};

exports.updateNote = async (req, res, next) => {
  try {
    const item = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return errorResponse(res, 'Note not found', 404);
    return successResponse(res, item, 'Note updated');
  } catch (err) { next(err); }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const item = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Note not found', 404);
    return successResponse(res, null, 'Note deleted');
  } catch (err) { next(err); }
};

exports.togglePin = async (req, res, next) => {
  try {
    const item = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Note not found', 404);
    item.isPinned = !item.isPinned;
    await item.save();
    return successResponse(res, item, item.isPinned ? 'Note pinned' : 'Note unpinned');
  } catch (err) { next(err); }
};

exports.toggleArchive = async (req, res, next) => {
  try {
    const item = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return errorResponse(res, 'Note not found', 404);
    item.isArchived = !item.isArchived;
    await item.save();
    return successResponse(res, item, item.isArchived ? 'Note archived' : 'Note unarchived');
  } catch (err) { next(err); }
};
