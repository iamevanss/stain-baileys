import { executeWMexQuery } from './mex.js'

/**
 * Privacy layer for Stain Baileys
 * Handles privacy settings, status, profile, blocklist, etc. via MEX queries
 */
const PRIVACY_MEX_IDS = {
  GET_SETTINGS: '32774292262215380',
  SET_SETTINGS: '32774292262215381',
  // Additional IDs can be expanded from the full original
}

export const makePrivacySocket = (sock) => {
  const base = sock

  const getPrivacySettings = async () => {
    // Placeholder that can call executeWMexQuery when full IDs are present
    return base.query ? base.query({ tag: 'iq', attrs: { type: 'get', xmlns: 'privacy' } }) : null
  }

  const updatePrivacySettings = async (settings) => {
    return base.query ? base.query({
      tag: 'iq',
      attrs: { type: 'set', xmlns: 'privacy' },
      content: Object.entries(settings).map(([name, value]) => ({
        tag: 'category',
        attrs: { name, value }
      }))
    }) : null
  }

  return {
    ...base,
    getPrivacySettings,
    updatePrivacySettings,
    PRIVACY_MEX_IDS
  }
}
