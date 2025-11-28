import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import cloudinary from '#config/cloudinary'

export default class ProjectsController {
  async index({ response }: HttpContext) {
    const projects = await Project.all()
    return response.ok(projects.map((p) => p.toJSON()))
  }

  async show({ params, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) return response.notFound({ message: 'Project not found' })
    return response.ok(project)
  }

  // ✅ Upload sur Cloudinary
  async store({ request, response }: HttpContext) {
    const data = request.only([
      'title',
      'description',
      'image_url',
      'images',
      'technologies',
      'github_link',
      'demo_link',
      'price',
      'duration',
    ])

    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (image) {
      const tmpPath = image.tmpPath!
      const uploadResult = await cloudinary.uploader.upload(tmpPath, {
        folder: 'projects', // crée un dossier "projects" sur ton compte Cloudinary
      })
      data.image_url = uploadResult.secure_url // 🔥 URL Cloudinary
    }

    // 🖼️ Galerie (images multiples)
    const galleryFiles = request.files('images', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (galleryFiles && galleryFiles.length > 0) {
      const uploadedGallery: string[] = []

      for (const img of galleryFiles) {
        const upload = await cloudinary.uploader.upload(img.tmpPath!, {
          folder: 'projects/gallery',
        })
        uploadedGallery.push(upload.secure_url)
      }

      data.images = uploadedGallery
    }
    const project = await Project.create(data)
    return response.created(project)
  }

  async update({ params, request, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) return response.notFound({ message: 'Project not found' })

    const data = request.only([
      'title',
      'description',
      'image_url',
      'images',
      'technologies',
      'github_link',
      'demo_link',
      'price',
      'duration',
    ])

    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (image) {
      const tmpPath = image.tmpPath!
      const uploadResult = await cloudinary.uploader.upload(tmpPath, {
        folder: 'projects',
      })
      data.image_url = uploadResult.secure_url
    }

    // 🖼️ Galerie (images multiples)
    const galleryFiles = request.files('images', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (galleryFiles && galleryFiles.length > 0) {
      const uploadedGallery: string[] = []

      for (const img of galleryFiles) {
        const upload = await cloudinary.uploader.upload(img.tmpPath!, {
          folder: 'projects/gallery',
        })
        uploadedGallery.push(upload.secure_url)
      }

      data.images = uploadedGallery
    }

    project.merge(data)
    await project.save()
    return response.ok(project)
  }

  async destroy({ params, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) return response.notFound({ message: 'Project not found' })

    // ✅ Supprimer l’image Cloudinary avant de supprimer le projet
    if (project.image_url) {
      const publicId = project.image_url.split('/').slice(-1)[0].split('.')[0]
      await cloudinary.uploader.destroy(`projects/${publicId}`)
    }

    await project.delete()
    return response.ok({ message: 'Project deleted successfully' })
  }
}
