import Express from "express";
import { nanoid } from "nanoid";
import multer from "multer";
import createHttpError from "http-errors";
import { checkMediasSchema, triggerBadRequest } from "./validator.js";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const mediasRouter = Express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "netflix/poster",
    },
  }),
}).single("cover");

mediasRouter.post(
  "/",
  checkMediasSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newMedia = {
        ...req.body,
        id: nanoid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mediaList = await getMedias();
      mediaList.push(newMedia);
      await writeMedias(mediaList);
      res.status(201).send({ id: newMedia.id });
    } catch (error) {
      next(error);
    }
  }
);

mediasRouter.get("/", async (req, res, next) => {
  try {
    const mediaList = await getMedias();
    if (req.query && req.query.category) {
      const fillteredMedias = mediaList.filter(
        (media) => media.category === req.query.category
      );
      res.status(200).send(fillteredMedias);
    } else if (
      Object.keys(req.query).length === 0 &&
      req.query.constructor === Object
    ) {
      res.status(200).send(mediaList);
    } else {
      next(createHttpError(404, `Invalid route!`));
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.get("/:id", triggerBadRequest, async (req, res, next) => {
  try {
    const mediaList = await getMedias();
    const media = mediaList.find((media) => media.id === req.params.id);
    if (media) {
      res.status(200).send(media);
    } else {
      next(
        createHttpError(404, `media with the id ${req.params.id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.put("/:id", triggerBadRequest, async (req, res, next) => {
  try {
    const mediaList = await getMedias();
    const index = mediaList.findIndex((media) => media.id === req.params.id);
    if (index !== -1) {
      const oldMedia = mediaList[index];
      const updatedMedia = {
        ...oldMedia,
        ...req.body,
        updatedAt: new Date(),
      };

      mediaList[index] = updatedMedia;
      await writeMedias(mediaList);
      res.status(200).send(updatedMedia);
    } else {
      createHttpError(404, `media with the id ${req.params.id} not found!`);
    }
  } catch (error) {}
});

mediasRouter.delete("/:id", async (req, res, next) => {
  try {
    const mediaList = await getMedias();
    const updatedMediaList = mediaList.filter(
      (media) => media.id !== req.params.id
    );
    if (mediaList.length !== updatedMediaList.length) {
      writeMedias(updatedMediaList);
      res.status(204).send();
    } else {
      next(createHttpError(404, `media with id ${req.params.id} not found!`)); //
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.put("/:id/poster", cloudinaryUploader, async (req, res, next) => {
  try {
    if (req.file !== undefined) {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.id + originalFileExtension;
      await saveProductsImg(fileName, req.file.buffer);
      const mediaList = await getMedias();
      const index = mediaList.findIndex((media) => media.id === req.params.id);
      if (index !== -1) {
        console.log(index);
        const oldMedia = mediaList[index];
        const updatedMedia = {
          ...oldMedia,
          cover: req.file.path,
          updatedAt: new Date(),
        };
        mediaList[index] = updatedMedia;
        await writeMedias(mediaList);
      }
      res.send({ message: "file uploaded" });
    } else {
      next(createHttpError(404, `The uploaded image is undefined`));
    }
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
