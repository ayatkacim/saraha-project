import multer from "multer"
import path from "node:path"
import fs from "node:fs"
import { fileTypeFromBuffer, fileTypeFromFile } from "file-type"
import { BadRequestException } from "../exceptions/index.js"

export const fileTypes = {
    images: [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/webp"
    ],
    pdf: ["application/pdf"],
    video: ["video/mp4"]
}

const buildFileFilter = (fileType) => (req, file, cb) => {
    if (!fileType.includes(file.mimetype)) {
        return cb(new Error("wrong file type", { cause: 400 }))
    }
    cb(null, true)
}

export const multerLocal = ({ fileType }) => {
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let folderPath = path.resolve("./uploads")
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true })
            }
            cb(null, folderPath)
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname)
        }
    })

    return multer({
        storage,
        fileFilter: buildFileFilter(fileType)
    })
}

export const multerMemory = ({ fileType }) => {
    return multer({
        storage: multer.memoryStorage(),
        fileFilter: buildFileFilter(fileType)
    })
}

// يجمع كل الملفات في array واحدة مهما كان شكل req.file / req.files
const collectFiles = (req) => {
    if (req.file) return [req.file]
    if (Array.isArray(req.files)) return req.files
    if (req.files && typeof req.files === "object") return Object.values(req.files).flat()
    return []
}

// يحدد نوع الملف الحقيقي من محتواه (من غير ما يحفظ حاجة)
const detectFile = async (file, fileType) => {
    const result = file.buffer
        ? await fileTypeFromBuffer(file.buffer)
        : await fileTypeFromFile(file.path)

    if (!result || !fileType.includes(result.mime)) {
        throw BadRequestException(`Invalid file: ${file.originalname}`)
    }
    return result
}

// لو كنا بنستخدم diskStorage الملفات اتحفظت خلاص، فنمسحها كلها عند أي فشل
const removeFromDisk = (files) => {
    files.forEach((file) => {
        if (file.path) fs.rmSync(file.path, { force: true })
    })
}

export const processFiles = ({ fileType }) => {
    return async (req, res, next) => {
        const files = collectFiles(req)
        if (!files.length) return next()

        // 1) افحص كل الملفات الأول (من غير أي حفظ)
        const detected = []
        try {
            for (const file of files) {
                detected.push(await detectFile(file, fileType))
            }
        } catch (error) {
            removeFromDisk(files)
            return next(error)
        }

        // 2) كلهم سليمين: احفظهم (لو حصل فشل في النص نمسح اللي اتحفظ)
        const saved = []
        try {
            const folder = path.resolve("./uploads")
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })

            files.forEach((file, i) => {
                if (!file.buffer) return
                const fullPath = path.join(folder, `${Date.now()}-${i}.${detected[i].ext}`)
                fs.writeFileSync(fullPath, file.buffer)
                file.fullPath = fullPath
                saved.push(fullPath)
            })
        } catch (error) {
            saved.forEach((p) => fs.rmSync(p, { force: true }))
            return next(error)
        }

        next()
    }
}