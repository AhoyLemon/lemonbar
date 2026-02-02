import { readInventoryCSV, writeInventoryCSV } from '~/server/utils/csvHelper'

export default defineEventHandler((event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bottle ID is required',
      })
    }

    const bottles = readInventoryCSV()
    const index = bottles.findIndex((b) => b.id === id)

    if (index === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bottle not found',
      })
    }

    bottles.splice(index, 1)
    writeInventoryCSV(bottles)

    return {
      success: true,
      message: 'Bottle deleted successfully',
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete bottle',
    })
  }
})
