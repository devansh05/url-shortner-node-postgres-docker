import dotenv from "dotenv";
dotenv.config();
import { urlValidations } from "../validations/index.js";
import { nanoid } from "nanoid";
import {
  getUrl,
  createShortenedUrl,
  getUrlFromShortCode,
  getAllUrls,
  deleteUrlFromId,
  getAllUrlsByUserId,
  updateShortenedUrl,
} from "../services/index.js";

const shortenUrl = async (req, res) => {
  const validatedRequest = await urlValidations.safeParseAsync(req.body);

  if (validatedRequest.error) {
    throw new Error(validatedRequest.error);
  }

  const { url } = validatedRequest.data;
  const existingUrl = await getUrl(url, "");

  if (existingUrl) {
    throw new Error({ message: "Url already exists." });
  }
  const shortCode = nanoid(6);

  const user = req.user;

  if (!user.id) {
    throw new Error({ message: "Login in before shortening url." });
  }

  const createdUrl = await createShortenedUrl({
    userId: user.id,
    shortUrl: shortCode,
    targetUrl: url,
  });

  res.status(201).json({ message: "Created url successfully.", ...createdUrl });
};
const redirectUser = async (req, res) => {
  const shortcode = req.query.shortcode;
  if (!shortcode) {
    throw new Error({ message: "You need to provide a short code in url." });
  }
  const existingUrl = await getUrlFromShortCode(shortcode);

  if (!existingUrl) {
    throw new Error({
      message: "Url doesnot exists. Created the shortened url first.",
    });
  }

  res.status(400).redirect(existingUrl.redirectTo);
};
const allUrls = async (req, res) => {
  const allUrls = await getAllUrls();
  res.status(200).json([...allUrls]);
};
const allUserUrls = async (req, res) => {
  const allUrls = await getAllUrlsByUserId(req.params.id);
  res.status(200).json([...allUrls]);
};
const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUrl = await deleteUrlFromId(id);
    res.status(200).json({ message: "Deleted successfully.", id: deletedUrl });
  } catch (err) {
    throw new Error(err);
  }
};
const updateUrl = async (req, res) => {
  try {
    const validatedRequest = await urlValidations.safeParseAsync(req.body);
    if (validatedRequest.error) {
      throw new Error(validatedRequest.error);
    }

    const { url } = validatedRequest.data;
    const userId = req.user.id;
    const existingUrl = await getUrl(url, "");
    const shortCode = nanoid(6);
    if (!existingUrl) {
      throw new Error({ message: "Url doesnot exists." });
    }

    if (!userId) {
      throw new Error({ message: "Login in before shortening url." });
    }

    const updatedUrl = await updateShortenedUrl({
      userId,
      shortUrl: shortCode,
      targetUrl: url,
      urlId: existingUrl.id,
    });

    res
      .status(201)
      .json({ message: "Updated url successfully.", ...updatedUrl });
  } catch (err) {
    throw new Error(err);
  }
};

export { shortenUrl, redirectUser, allUrls, deleteUrl, allUserUrls, updateUrl };
