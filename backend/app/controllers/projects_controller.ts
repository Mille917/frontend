import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import cloudinary from '#config/cloudinary'

export default class ProjectsController {
  async index({ response }: HttpContext) {
    try {
      const projects = await Project.all()
      return response.ok(projects.map((p) => p.toJSON()))
    } catch (e: any) {
      console.error('ProjectsController.index error', e)
      return response.internalServerError({
        message: 'Erreur lors de la récupération des projets',
        error: e.message,
        stack: e.stack,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) return response.notFound({ message: 'Project not found' })
    return response.ok(project)
  }

  // ✅Upload sur Cloudinary
  async store({ request, response }: HttpContext) {
    const data = request.only([
      'title',
      'description',
      'technologies',
      'github_link',
      'demo_link',
      'price',
      'duration',
    ]) as any

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
    const project = await Project.create(data)
    return response.created(project)
  }

  async update({ params, request, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) return response.notFound({ message: 'Project not found' })

    const data = request.only([
      'title',
      'description',
      'technologies',
      'github_link',
      'demo_link',
      'price',
      'duration',
    ]) as any

    // On récupère les images existantes envoyées par le front (pour ne pas les perdre)
    const existingImages = request.input('existing_images')
    let currentImages: string[] = []
    if (Array.isArray(existingImages)) {
      currentImages = existingImages
    } else if (existingImages) {
      currentImages = [existingImages]
    }

    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    try {
      if (image) {
        const tmpPath = image.tmpPath!
        const uploadResult = await cloudinary.uploader.upload(tmpPath, {
          folder: 'projects',
        })
        data.image_url = uploadResult.secure_url
      }
    } catch (e: any) {
      return response.internalServerError({
        message: "Erreur d'upload de l'image sur Cloudinary",
        error: e.message,
      })
    }

    // 🖼️ Galerie (nouvelles images)
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

      // Fusionner les anciennes et les nouvelles images
      data.images = [...currentImages, ...uploadedGallery]
    } else {
      // Si pas de nouvelles images, on garde les anciennes
      data.images = currentImages
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
      const publicId = project.image_url.split('/').at(-1)?.split('.')[0]
      await cloudinary.uploader.destroy(`projects/${publicId}`)
    }

    await project.delete()
    return response.ok({ message: 'Project deleted successfully' })
  }
}
