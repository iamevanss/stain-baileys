import { Boom } from '@hapi/boom'
import { S_WHATSAPP_NET, getBinaryNodeChild } from '../WABinary/index.js'

const wMexQuery = (variables, queryId, query, generateMessageTag) => {
  return query({
    tag: 'iq',
    attrs: {
      id: generateMessageTag(),
      type: 'get',
      to: S_WHATSAPP_NET,
      xmlns: 'w:mex'
    },
    content: [
      {
        tag: 'query',
        attrs: { query_id: queryId },
        content: Buffer.from(JSON.stringify({ variables }), 'utf-8')
      }
    ]
  })
}

export const makeMexSocket = (sock) => {
  const { query, generateMessageTag } = sock

  const executeWMexQuery = async (variables, queryId, errorName) => {
    try {
      const result = await wMexQuery(variables, queryId, query, generateMessageTag)
      const child = getBinaryNodeChild(result, 'result')
      if (!child?.content) {
        throw new Boom('No result content', { statusCode: 400 })
      }
      const data = JSON.parse(child.content.toString())
      return data
    } catch (error) {
      throw new Boom(`${errorName}: ${error.message}`, { statusCode: error.output?.statusCode || 500 })
    }
  }

  return {
    ...sock,
    executeWMexQuery
  }
}
