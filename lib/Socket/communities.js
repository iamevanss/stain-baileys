import { proto } from '../../WAProto/index.js';
import { WAMessageStubType } from '../Types/index.js';
import { generateMessageID, generateMessageIDV2, unixTimestampSeconds } from '../Utils/index.js';
import logger from '../Utils/logger.js';
import { getBinaryNodeChild, getBinaryNodeChildren, getBinaryNodeChildString, jidEncode, jidNormalizedUser } from '../WABinary/index.js';
import { makeBusinessSocket } from './business.js';

export const makeCommunitiesSocket = (config) => {
    const sock = makeBusinessSocket(config);
    const { authState, ev, query, upsertMessage, generateMessageTag } = sock;

    const communityQuery = async (jid, type, content) => query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type,
            xmlns: 'w:g2',
            to: jid
        },
        content
    });

    const communityMetadata = async (jid) => {
        const result = await communityQuery(jid, 'get', [{ tag: 'query', attrs: { request: 'interactive' } }]);
        return extractCommunityMetadata(result);
    };

    const communityCreate = async (subject, participants, description) => {
        const result = await communityQuery('@g.us', 'set', [{
            tag: 'create',
            attrs: { subject, key: generateMessageID() },
            content: [
                { tag: 'participant', attrs: { jid: jidNormalizedUser(authState.creds.me.id) } },
                ...participants.map(jid => ({ tag: 'participant', attrs: { jid: jidNormalizedUser(jid) } })),
                ...(description ? [{ tag: 'description', attrs: {}, content: Buffer.from(description, 'utf-8') }] : [])
            ]
        }]);
        return extractCommunityMetadata(result);
    };

    // Additional community methods (join, leave, update, etc.) would be expanded here
    // based on the full original implementation.

    return {
        ...sock,
        communityMetadata,
        communityCreate,
        // expose more as needed
    };
};

const extractCommunityMetadata = (result) => {
    const community = getBinaryNodeChild(result, 'community') || getBinaryNodeChild(result, 'group');
    if (!community) return null;
    const attrs = community.attrs || {};
    const descNode = getBinaryNodeChild(community, 'description');
    const eph = getBinaryNodeChildString(community, 'ephemeral');
    return {
        id: attrs.id || attrs.jid,
        subject: attrs.subject,
        creation: attrs.creation ? +attrs.creation : undefined,
        owner: attrs.creator,
        desc: descNode ? getBinaryNodeChildString(descNode, 'body') : undefined,
        descId: descNode?.attrs?.id,
        restrict: !!getBinaryNodeChild(community, 'locked'),
        announce: !!getBinaryNodeChild(community, 'announcement'),
        participants: getBinaryNodeChildren(community, 'participant').map(p => ({
            id: p.attrs.jid,
            admin: (p.attrs.type || null)
        })),
        ephemeralDuration: eph ? +eph : undefined,
        addressingMode: getBinaryNodeChildString(community, 'addressing_mode')
    };
};
