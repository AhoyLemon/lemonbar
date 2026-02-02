import { readInventoryCSV, writeInventoryCSV, getNextId } from '~/server/utils/csvHelper'
import type { Bottle } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Partial<Bottle>>(event)

    // Validate required fields
    if (!body.name || !body.category) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and category are required',
      })
    }

    const bottles = readInventoryCSV()
    const newBottle: Bottle = {
      id: getNextId(bottles),
      name: body.name,
      category: body.category,
      tags: body.tags || [],
      inStock: body.inStock ?? true,
      bottleSize: body.bottleSize,
      bottleState: body.bottleState,
      image: body.image,
    }

    bottles.push(newBottle)
    writeInventoryCSV(bottles)

    return {
      success: true,
      bottle: newBottle,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create bottle',
    })
  }
})
